
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


