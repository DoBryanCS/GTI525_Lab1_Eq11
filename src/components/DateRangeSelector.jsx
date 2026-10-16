import { getMonthName } from "../months";

// T3 : sélection de la plage de dates
// range et limits : { fromYear, fromMonth, toYear, toMonth }
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function getAvailableMonths(year, limits) {
  return MONTHS.filter((month) => {
    const afterStart = year > limits.fromYear || (year === limits.fromYear && month >= limits.fromMonth);
    const beforeEnd = year < limits.toYear || (year === limits.toYear && month <= limits.toMonth);

    return afterStart && beforeEnd;
  });
}

// Ramène le mois dans les mois disponibles pour l'année choisie
function clampMonth(year, month, limits) {
  const available = getAvailableMonths(year, limits);
  return Math.min(Math.max(month, available[0]), available[available.length - 1]);
}

// Garde une plage valide : mois dans les limites du fichier et début <= fin
function normalizeRange(range, limits, changedField) {
  const result = {
    ...range,
    fromMonth: clampMonth(range.fromYear, range.fromMonth, limits),
    toMonth: clampMonth(range.toYear, range.toMonth, limits),
  };

  const start = result.fromYear * 100 + result.fromMonth;
  const end = result.toYear * 100 + result.toMonth;

  if (start > end) {
    if (changedField.startsWith("from")) {
      result.toYear = result.fromYear;
      result.toMonth = result.fromMonth;
    } else {
      result.fromYear = result.toYear;
      result.fromMonth = result.toMonth;
    }
  }

  return result;
}

function DateRangeSelector({ range, limits, onChange, onShowAll }) {
  const years = [];
  for (let year = limits.fromYear; year <= limits.toYear; year++) {
    years.push(year);
  }

  const update = (field, value) => {
    onChange(normalizeRange({ ...range, [field]: Number(value) }, limits, field));
  };

  const renderSelect = (field, options, formatOption) => (
    <select
      className="border px-1"
      value={range[field]}
      onChange={(e) => update(field, e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {formatOption(option)}
        </option>
      ))}
    </select>
  );

  const renderYearSelect = (field) => renderSelect(field, years, (year) => year);
  const renderMonthSelect = (field, year) =>
    renderSelect(field, getAvailableMonths(year, limits), getMonthName);

  return (
    <div className="flex items-center justify-between border border-dashed p-2">
      <div>
        <p className="font-bold">Plage de dates</p>
        <p>
          De : {renderYearSelect("fromYear")} {renderMonthSelect("fromMonth", range.fromYear)}
        </p>
        <p>
          À : {renderYearSelect("toYear")} {renderMonthSelect("toMonth", range.toYear)}
        </p>
      </div>

      <button className="bg-gray-500 px-4 py-1 text-white hover:bg-gray-600" onClick={onShowAll}>
        Toutes les données
      </button>
    </div>
  );
}

export default DateRangeSelector;
