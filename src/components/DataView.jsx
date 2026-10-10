import { COLUMNS } from "../columns";

// T4 : vue des données (une rangée par Année-Mois)

function DataView({ rows = [] }) {
  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Données météo</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} className="border px-2 py-1">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="border py-4 text-center">
                Aucune donnée
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={`${row.year}-${row.month}`}>
                {COLUMNS.map((col) => (
                  <td key={col.key} className="border px-2 py-1 text-center">
                    {row[col.key] ?? ""}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataView;
