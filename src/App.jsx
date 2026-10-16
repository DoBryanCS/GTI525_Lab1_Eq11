import { useState, useMemo } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StationMenu from "./components/StationMenu";
import DateRangeSelector from "./components/DateRangeSelector";
import DataView from "./components/DataView";
import StatsView from "./components/StatsView";
import {
  getStationsByProvince,
  getStationDateRange,
  getWeatherRecords,
  filterWeatherRecords,
  computeStatistics,
  computeMonthlyStatistics,
} from "./utils/weatherData";

const TABS = [
  { key: "data", label: "Données" },
  { key: "stats", label: "Statistiques" },
];

function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [range, setRange] = useState(null);
  const [activeTab, setActiveTab] = useState("data");

  // Les stations sont extraites une seule fois du fichier d'inventaire
  const provinces = useMemo(() => getStationsByProvince(), []);

  // Le CSV de la station n'est analysé qu'au changement de station
  const weatherRecords = useMemo(
    () => (selectedStation ? getWeatherRecords(selectedStation.stationID) : []),
    [selectedStation]
  );
  const stationLimits = useMemo(() => getStationDateRange(weatherRecords), [weatherRecords]);

  // Par défaut (range === null), la plage couvre toutes les données de la station (T3.5)
  const activeRange = range ?? stationLimits;

  const filteredRecords = useMemo(
    () => filterWeatherRecords(weatherRecords, activeRange),
    [weatherRecords, activeRange]
  );
  const globalStats = useMemo(() => computeStatistics(filteredRecords), [filteredRecords]);
  const monthlyStats = useMemo(() => computeMonthlyStatistics(filteredRecords), [filteredRecords]);

  function handleStationSelection(station) {
    setSelectedStation(station);
    setRange(null);
    setActiveTab("data");
  }

  const tabClass = (tab) =>
    `px-6 py-1 ${activeTab === tab ? "bg-orange-500 text-white" : "bg-blue-300 hover:bg-blue-400"}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-fit border bg-white">
        <Header />

        <main className="flex h-[650px] border-t">
          <aside className="w-64 shrink-0 overflow-y-auto border-r p-4">
            <StationMenu
              provinces={provinces}
              selectedStation={selectedStation}
              onSelectStation={handleStationSelection}
            />
          </aside>

          <section className="flex w-[1100px] flex-col gap-2 p-4">
            <span className="font-bold">
              {selectedStation
                ? `${selectedStation.name} (${selectedStation.airportCode})`
                : "Sélectionnez une station dans le menu de gauche"}
            </span>

            {selectedStation && stationLimits && (
              <>
                <DateRangeSelector
                  range={activeRange}
                  limits={stationLimits}
                  onChange={setRange}
                  onShowAll={() => setRange(null)}
                />

                <div className="flex gap-2">
                  {TABS.map((tab) => (
                    <button key={tab.key} className={tabClass(tab.key)} onClick={() => setActiveTab(tab.key)}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto border border-dashed p-2">
                  {activeTab === "data" ? (
                    <DataView rows={filteredRecords} />
                  ) : (
                    <StatsView globalStats={globalStats} monthlyStats={monthlyStats} />
                  )}
                </div>
              </>
            )}
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
