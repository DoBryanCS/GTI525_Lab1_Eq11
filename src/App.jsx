import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StationMenu from "./components/StationMenu";
import DateRangeSelector from "./components/DateRangeSelector";
import DataView from "./components/DataView";
import StatsView from "./components/StatsView";
import { loadStationInventory, loadCSV } from "./utils/weatherData";
import { getWeatherRows, getAvailableStations, getStationsByProvince, getStationDateRange, getWeatherRecords, filterWeatherRecords } from "./utils/weatherData";


function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [range, setRange] = useState(null);
  const [stationLimits, setStationLimits] = useState(null);
  const [activeTab, setActiveTab] = useState("data");
  const [provinces, setProvinces] = useState([]);

  const weatherRecords = selectedStation ? getWeatherRecords(selectedStation.stationID, range) : [];
  const filteredRecords = filterWeatherRecords(weatherRecords, range);

  function handleStationSelection(station) {
  setSelectedStation(station);

  if (station === null) {
    setStationLimits(null);
    setRange(null);
    return;
  }

  const limits = getStationDateRange(station.stationID);

  setStationLimits(limits);
  setRange(limits);
  }

  const years = [];
  if (stationLimits != null) {
    for (let i = stationLimits.fromYear; i <= stationLimits.toYear; i++) {
      years.push(i);
    }
  }

  const tabClass = (tab) =>
    `px-6 py-1 ${activeTab === tab ? "bg-orange-500" : "bg-blue-300"}`;


  
  useEffect(() => {
    const groupedStations = getStationsByProvince();

    console.log("=== STATIONS BY PROVINCE ===");
    console.log(groupedStations);

    setProvinces(groupedStations);

    const victoriaRange = getStationDateRange(118);
    console.log("=== VICTORIA DATE RANGE ===");
    console.log(victoriaRange);

    const victoriaRecords = getWeatherRecords(118, victoriaRange);
    console.log("=== VICTORIA RECORDS ===");
    console.log(victoriaRecords);
  }, []);




  return (
    <div className="min-h-screen">
      <div className="mx-auto w-fit border">
        <Header />

        <main className="flex border-t">
          <aside className="w-64 border-r p-4">
            <StationMenu
              provinces={provinces}
              selectedStation={selectedStation}
              onSelectStation={handleStationSelection}
            />
          </aside>

          <section className="flex w-[1100px] flex-col gap-2 p-4">
            <span>{selectedStation? `${selectedStation.name} (${selectedStation.airportCode})` : "Toutes les stations"}</span>
            {range !== null && (
              <DateRangeSelector
                years={years}
                range={range}
                limits={stationLimits}
                onChange={setRange}
                onShowAll={() => setRange({...stationLimits })}
              />
            )}

            <div className="flex gap-2">
              <button className={tabClass("data")} onClick={() => setActiveTab("data")}>
                Données
              </button>
              <button className={tabClass("stats")} onClick={() => setActiveTab("stats")}>
                Statistiques
              </button>
            </div>

            <div className="min-h-[400px] overflow-auto border border-dashed p-2">
              {activeTab === "data" ? <DataView rows={filteredRecords} /> : <StatsView stats={{}} />}
            </div>
          </section>
        </main>

        <div className="border-t">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
