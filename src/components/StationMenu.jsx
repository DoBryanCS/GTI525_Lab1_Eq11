import { useState } from "react";

// T2 : menu de sélection de la station
// provinces : [{ name, stations: [{ id, name }] }]
function StationMenu({ provinces = [], selectedStation, onSelectStation }) {
  const [openProvince, setOpenProvince] = useState(null);

  const toggleProvince = (name) => {
    setOpenProvince(openProvince === name ? null : name);
  };

  return (
    <ul className="flex max-h-[600px] flex-col gap-2 overflow-y-auto">
      <li>
        <button
          className="w-full bg-blue-200 py-2"
          onClick={() => onSelectStation?.(null)}
        >
          Toutes les stations
        </button>
      </li>

      {provinces.map((province) => (
        <li key={province.name}>
          <button
            className={`w-full py-2 ${
              openProvince === province.name
                ? "bg-green-700 text-white"
                : "bg-blue-200"
            }`}
            onClick={() => toggleProvince(province.name)}
          >
            {province.name}
          </button>

          {openProvince === province.name && (
            <ul className="max-h-40 overflow-y-auto px-2 py-1 text-sm">
              {province.stations.map((station) => (
                <li key={station.id}>
                  <button
                    className={
                      selectedStation?.id === station.id ? "text-red-600" : ""
                    }
                    onClick={() => onSelectStation?.(station)}
                  >
                    - {station.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default StationMenu;
