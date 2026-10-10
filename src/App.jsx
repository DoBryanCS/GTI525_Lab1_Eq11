import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StationMenu from "./components/StationMenu";
import DateRangeSelector from "./components/DateRangeSelector";
import DataView from "./components/DataView";
import StatsView from "./components/StatsView";

// Il faut les remplacer par les donnees fournis dans le dossiers lab1CSV
const DEMO_PROVINCES = [
  {
    name: "Alberta",
    stations: [
      { id: "YYC", name: "CALGARY INTL A (YYC)" },
      { id: "YEG", name: "EDMONTON INT'L A (YEG)" },
    ],
  },
  { name: "British Columbia", stations: [] },
  { name: "Manitoba", stations: [] },
  { name: "Saskatchewan", stations: [] },
];
const DEMO_YEARS = [2020, 2021, 2022];

function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [range, setRange] = useState({
    fromYear: 2020,
    fromMonth: 1,
    toYear: 2022,
    toMonth: 12,
  });
  const [activeTab, setActiveTab] = useState("data");

  const tabClass = (tab) =>
    `px-6 py-1 ${activeTab === tab ? "bg-orange-500" : "bg-blue-300"}`;

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-fit border">
        <Header />

        <main className="flex border-t">
          <aside className="w-64 border-r p-4">
            <StationMenu
              provinces={DEMO_PROVINCES}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
            />
          </aside>

          <section className="flex w-[1100px] flex-col gap-2 p-4">
            <span>{selectedStation?.name ?? "Toutes les stations"}</span>

            <DateRangeSelector
              years={DEMO_YEARS}
              range={range}
              onChange={setRange}
              onShowAll={() => {}}
            />

            <div className="flex gap-2">
              <button className={tabClass("data")} onClick={() => setActiveTab("data")}>
                Données
              </button>
              <button className={tabClass("stats")} onClick={() => setActiveTab("stats")}>
                Statistiques
              </button>
            </div>

            <div className="min-h-[400px] overflow-auto border border-dashed p-2">
              {activeTab === "data" ? <DataView rows={[]} /> : <StatsView stats={{}} />}
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
