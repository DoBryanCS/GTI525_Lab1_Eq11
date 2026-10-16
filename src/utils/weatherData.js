
import { parseCSV } from "./csv";
import { WeatherStation } from "../models/WeatherStation";

export function getWeatherRows(stationId) {
  const csvText = window.stations[stationId];

  if (csvText === undefined) {
    console.error("No weather data for station:", stationId);
    return [];
  }

  const rows = parseCSV(csvText);
  return rows;
}

export async function loadCSV(filename) {
  try {
    const response = await fetch(
      `/data/${encodeURIComponent(filename)}`
    );

    if (!response.ok) {
      console.error("Could not load CSV:", filename);
      return [];
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    console.log("CSV loaded:", filename);
    console.table(rows.slice(0, 10));

    return rows;

  } catch (error) {
    console.error("Error reading CSV:", error);
    return [];
  }
}

// Load the station inventory
export async function loadStationInventory() {
  const rows = await loadCSV("Station Inventory EN.csv");

  const headerIndex = rows.findIndex(
    (row) =>
      row.includes("Name") &&
      row.includes("Station ID")
  );

  if (headerIndex === -1) {
    console.error("Inventory header not found");
    return [];
  }

  const headers = rows[headerIndex];

  return rows.slice(headerIndex + 1)
    .filter((row) => row.some((field) => field.trim() !== ""))
    .map((row) => {
      const station = {};

      headers.forEach((header, index) => {
        station[header] = row[index] ?? "";
      });

      return station;
    });
}


export function getAvailableStations() {
  const inventoryRows = parseCSV(StationInventoryEN);

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
  provinces.sort();

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


export function getStationDateRange(stationId) {
  const rows = getWeatherRows(stationId);

  // Remove empty rows
  const validRows = rows.filter((row) => row.length > 1);

  // The first row contains the CSV headers
  const headers = validRows[0];

  const yearIndex = headers.indexOf("Year");
  const monthIndex = headers.indexOf("Month");

  // Exclude the header row
  const dataRows = validRows.slice(1);

  if (dataRows.length === 0) {
    return null;
  }

  const firstRow = dataRows[0];
  const lastRow = dataRows[dataRows.length - 1];

  return {
    fromYear: Number(firstRow[yearIndex]),
    fromMonth: Number(firstRow[monthIndex]),
    toYear: Number(lastRow[yearIndex]),
    toMonth: Number(lastRow[monthIndex])
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
  // Retrieve the parsed CSV rows
  const rows = getWeatherRows(stationId);

  // Remove empty rows
  const validRows = rows.filter((row) => row.length > 1);

  if (validRows.length === 0) {
    return [];
  }

  // First row contains the CSV column names
  const headers = validRows[0];

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

  // Exclude the header
  const dataRows = validRows.slice(1);

  // Convert each CSV row into a weather object
  const weatherRecords = dataRows.map((row) => ({
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

  return weatherRecords;
}


export function filterWeatherRecords(records, range) {
  if (!range) {
    return records;
  }

  //Mathematical gymnastics -> YYYMM
  const startDate = range.fromYear * 100 + range.fromMonth;
  const endDate = range.toYear * 100 + range.toMonth;

  return records.filter((record) => {
    const recordDate = record.year * 100 + record.month;

    return recordDate >= startDate && recordDate <= endDate;
  });
}
