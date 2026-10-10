import { COLUMNS } from "../columns";

// T5 : vue des statistiques
// stats : { [cle de colonne]: { min, max, mean } }
const STAT_COLUMNS = COLUMNS.filter(
  (col) => col.key !== "year" && col.key !== "month"
);

function StatsView({ stats = {} }) {
  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Statistiques</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Mesure</th>
            <th className="border px-2 py-1">Minimum</th>
            <th className="border px-2 py-1">Maximum</th>
            <th className="border px-2 py-1">Moyenne</th>
          </tr>
        </thead>
        <tbody>
          {STAT_COLUMNS.map((col) => (
            <tr key={col.key}>
              <td className="border px-2 py-1">{col.label}</td>
              <td className="border px-2 py-1 text-center">{stats[col.key]?.min ?? ""}</td>
              <td className="border px-2 py-1 text-center">{stats[col.key]?.max ?? ""}</td>
              <td className="border px-2 py-1 text-center">{stats[col.key]?.mean ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatsView;
