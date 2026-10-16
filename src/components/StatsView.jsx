import { getMonthName } from "../months";

// T5 : vue des statistiques
// globalStats : [{ key, label, unit, max, min }] où max/min = { value, year, month } ou null
// monthlyStats : [{ month, statistics }]

// Valeur affichée lorsqu'une statistique ne peut pas être calculée (aucune donnée valide)
const NOT_AVAILABLE = "N/D";

const cellClass = "border px-2 py-1";

function formatValue(extreme, unit) {
  return extreme ? `${extreme.value} ${unit}` : NOT_AVAILABLE;
}

function formatMonth(extreme) {
  return extreme ? String(extreme.month).padStart(2, "0") : NOT_AVAILABLE;
}

function formatYear(extreme) {
  return extreme ? extreme.year : NOT_AVAILABLE;
}

// T5.1 : tableau des statistiques globales (7 colonnes)
function GlobalStatsTable({ statistics }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className={cellClass}>Donnée</th>
          <th className={cellClass}>Valeur maximale</th>
          <th className={cellClass}>Année</th>
          <th className={cellClass}>Mois</th>
          <th className={cellClass}>Valeur minimale</th>
          <th className={cellClass}>Année</th>
          <th className={cellClass}>Mois</th>
        </tr>
      </thead>
      <tbody>
        {statistics.map((statistic) => (
          <tr key={statistic.key}>
            <td className={cellClass}>{statistic.label}</td>
            <td className={`${cellClass} text-center`}>{formatValue(statistic.max, statistic.unit)}</td>
            <td className={`${cellClass} text-center`}>{formatYear(statistic.max)}</td>
            <td className={`${cellClass} text-center`}>{formatMonth(statistic.max)}</td>
            <td className={`${cellClass} text-center`}>{formatValue(statistic.min, statistic.unit)}</td>
            <td className={`${cellClass} text-center`}>{formatYear(statistic.min)}</td>
            <td className={`${cellClass} text-center`}>{formatMonth(statistic.min)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// T5.2 : tableau des statistiques d'un mois (5 colonnes, sans le mois)
function MonthlyStatsTable({ statistics }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className={cellClass}>Donnée</th>
          <th className={cellClass}>Valeur maximale</th>
          <th className={cellClass}>Année</th>
          <th className={cellClass}>Valeur minimale</th>
          <th className={cellClass}>Année</th>
        </tr>
      </thead>
      <tbody>
        {statistics.map((statistic) => (
          <tr key={statistic.key}>
            <td className={cellClass}>{statistic.label}</td>
            <td className={`${cellClass} text-center`}>{formatValue(statistic.max, statistic.unit)}</td>
            <td className={`${cellClass} text-center`}>{formatYear(statistic.max)}</td>
            <td className={`${cellClass} text-center`}>{formatValue(statistic.min, statistic.unit)}</td>
            <td className={`${cellClass} text-center`}>{formatYear(statistic.min)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatsView({ globalStats, monthlyStats }) {
  return (
    <div className="flex flex-col gap-4">
      <section>
        <h2 className="mb-2 text-lg font-bold">Statistiques globales</h2>
        <GlobalStatsTable statistics={globalStats} />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">Statistiques par mois</h2>
        <div className="flex flex-col gap-4">
          {monthlyStats.map(({ month, statistics }) => (
            <div key={month}>
              <h3 className="mb-1 font-bold">{getMonthName(month)}</h3>
              <MonthlyStatsTable statistics={statistics} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default StatsView;
