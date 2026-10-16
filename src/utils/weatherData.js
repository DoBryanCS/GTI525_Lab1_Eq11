
import { parseCSV } from "./csv";
import { WeatherStation } from "../models/WeatherStation";

export function getWeatherRows(stationId) {
  const csvText = window.stations[stationId];

  if (csvText === undefined) {
    console.error("No weather data for station:", stationId);
    return [];
  }

  // Remove empty rows (the CSV text starts with a newline)
  return parseCSV(csvText).filter((row) => row.length > 1);
}


export function getAvailableStations() {
  const inventoryRows = parseCSV(window.StationInventoryEN);

  const headerIndex = inventoryRows.findIndex(
    (row) => row.includes("Name") && row.includes("Station ID")
  );

  if (headerIndex === -1) {
    console.error("Inventory headers not found");
    return [];
  }

  const headers = inventoryRows[headerIndex];

  const nameIndex = headers.indexOf("Name");
  const provinceIndex = headers.indexOf("Province");
  const climateIndex = headers.indexOf("Climate ID");
  const stationIndex = headers.indexOf("Station ID");
  const airportIndex = headers.indexOf("TC ID");

  const weatherStations = [];

  for (let i = headerIndex + 1; i < inventoryRows.length; i++) {
    const row = inventoryRows[i];
    const stationId = row[stationIndex];

    if (window.stations[stationId] !== undefined) {
      const station = new WeatherStation(
        row[nameIndex],
        row[provinceIndex],
        row[climateIndex],
        stationId,
        row[airportIndex]
      );

      weatherStations.push(station);
    }
  }

  return weatherStations;
}


export function getStationsByProvince() {
  const weatherStations = getAvailableStations();

  const stationsByProvince = {};

  // Group stations by province
  for (const station of weatherStations) {
    if (stationsByProvince[station.province] === undefined) {
      stationsByProvince[station.province] = [];
    }

    stationsByProvince[station.province].push(station);
  }

  // Extract and sort province names
  const provinces = Object.keys(stationsByProvince);
  provinces.sort((a, b) => a.localeCompare(b));

  // Sort stations alphabetically within each province
  for (const province of provinces) {
    stationsByProvince[province].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  return provinces.map((province) => ({
    name: province,
    stations: stationsByProvince[province]
  }));
}


// Only the first and last rows of the file are considered (T3.4)
export function getStationDateRange(records) {
  if (records.length === 0) {
    return null;
  }

  const firstRecord = records[0];
  const lastRecord = records[records.length - 1];

  return {
    fromYear: firstRecord.year,
    fromMonth: firstRecord.month,
    toYear: lastRecord.year,
    toMonth: lastRecord.month
  };
}


export function parseMeasurement(value) {
  if (value === undefined || value.trim() === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}


export function getWeatherRecords(stationId) {
  const rows = getWeatherRows(stationId);

  if (rows.length === 0) {
    return [];
  }

  // First row contains the CSV column names
  const headers = rows[0];

  // Find the positions of the columns we need
  const yearIndex = headers.indexOf("Year");
  const monthIndex = headers.indexOf("Month");
  const meanMaxIndex = headers.indexOf("Mean Max Temp (°C)");
  const meanMinIndex = headers.indexOf("Mean Min Temp (°C)");
  const meanIndex = headers.indexOf("Mean Temp (°C)");
  const extrMaxIndex = headers.indexOf("Extr Max Temp (°C)");
  const extrMinIndex = headers.indexOf("Extr Min Temp (°C)");
  const rainIndex = headers.indexOf("Total Rain (mm)");
  const snowIndex = headers.indexOf("Total Snow (cm)");
  const gustIndex = headers.indexOf("Spd of Max Gust (km/h)");

  // Convert each CSV row (header excluded) into a weather object
  return rows.slice(1).map((row) => ({
    year: Number(row[yearIndex]),
    month: Number(row[monthIndex]),
    meanMaxTemp: parseMeasurement(row[meanMaxIndex]),
    meanMinTemp: parseMeasurement(row[meanMinIndex]),
    meanTemp: parseMeasurement(row[meanIndex]),
    extrMaxTemp: parseMeasurement(row[extrMaxIndex]),
    extrMinTemp: parseMeasurement(row[extrMinIndex]),
    totalRain: parseMeasurement(row[rainIndex]),
    totalSnow: parseMeasurement(row[snowIndex]),
    maxGust: parseMeasurement(row[gustIndex])
  }));
}


export function filterWeatherRecords(records, range) {
  if (!range) {
    return records;
  }

  //Mathematical gymnastics -> YYYYMM
  const startDate = range.fromYear * 100 + range.fromMonth;
  const endDate = range.toYear * 100 + range.toMonth;

  return records.filter((record) => {
    const recordDate = record.year * 100 + record.month;

    return recordDate >= startDate && recordDate <= endDate;
  });
}


// Statistics shown in the stats view (T5).
// maxKey: field searched for the maximum value, minKey: field searched for the minimum value
export const STATISTICS = [
  { key: "meanTemp", label: "Température moyenne mensuelle", unit: "°C", maxKey: "meanMaxTemp", minKey: "meanMinTemp" },
  { key: "extrTemp", label: "Température extrême", unit: "°C", maxKey: "extrMaxTemp", minKey: "extrMinTemp" },
  { key: "rain", label: "Quantité de pluie", unit: "mm", maxKey: "totalRain", minKey: "totalRain" },
  { key: "snow", label: "Quantité de neige", unit: "cm", maxKey: "totalSnow", minKey: "totalSnow" },
  { key: "wind", label: "Vitesse du vent", unit: "km/h", maxKey: "maxGust", minKey: "maxGust" }
];


// Finds the record holding the extreme value of a field, ignoring missing values.
// Returns { value, year, month } or null when no valid value exists.
function findExtreme(records, field, isBetter) {
  let best = null;

  for (const record of records) {
    const value = record[field];

    if (value === null) {
      continue;
    }

    if (best === null || isBetter(value, best.value)) {
      best = { value, year: record.year, month: record.month };
    }
  }

  return best;
}


export function computeStatistics(records) {
  return STATISTICS.map((statistic) => ({
    ...statistic,
    max: findExtreme(records, statistic.maxKey, (a, b) => a > b),
    min: findExtreme(records, statistic.minKey, (a, b) => a < b)
  }));
}


// Statistics for each of the 12 months: [{ month, statistics }]
export function computeMonthlyStatistics(records) {
  const monthlyStatistics = [];

  for (let month = 1; month <= 12; month++) {
    const monthRecords = records.filter((record) => record.month === month);

    monthlyStatistics.push({
      month,
      statistics: computeStatistics(monthRecords)
    });
  }

  return monthlyStatistics;
}
