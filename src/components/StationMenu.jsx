import { useState } from "react";

// T2 : menu de sélection de la station
// provinces : [{ name, stations: [WeatherStation] }]
const ALL_STATIONS = "all";

function StationList({ stations, selectedStation, onSelectStation }) {
  return (
    <ul className="max-h-60 overflow-y-auto py-1 text-sm">
      {stations.map((station) => (
        <li key={station.id}>
          <button
            className={`w-full px-2 py-0.5 text-left ${
              selectedStation?.id === station.id
                ? "bg-red-100 text-red-700"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onSelectStation(station)}
          >
            - {station.name} ({station.airportCode})
          </button>
        </li>
      ))}
    </ul>
  );
}

function CategoryButton({ label, isOpen, onClick }) {
  return (
    <button
      className={`w-full border py-2 ${
        isOpen ? "bg-green-700 text-white" : "bg-blue-200 hover:bg-blue-300"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function StationMenu({ provinces, selectedStation, onSelectStation }) {
  const [openCategory, setOpenCategory] = useState(null);

  const allStations = provinces
    .flatMap((province) => province.stations)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Une seule catégorie ouverte à la fois (T2.2)
  const toggleCategory = (name) => {
    setOpenCategory(openCategory === name ? null : name);
  };

  const categories = [
    { name: ALL_STATIONS, label: "Toutes les stations", stations: allStations },
    ...provinces.map((province) => ({ ...province, label: province.name })),
  ];

  return (
    <ul className="flex flex-col gap-2">
      {categories.map((category) => (
        <li key={category.name}>
          <CategoryButton
            label={category.label}
            isOpen={openCategory === category.name}
            onClick={() => toggleCategory(category.name)}
          />

          {openCategory === category.name && (
            <StationList
              stations={category.stations}
              selectedStation={selectedStation}
              onSelectStation={onSelectStation}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default StationMenu;
