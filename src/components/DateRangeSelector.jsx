// T3 : sélection de la plage de dates
// range : { fromYear, fromMonth, toYear, toMonth }
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MONTH_NAMES = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function DateRangeSelector({ years = [], range, limits, onChange, onShowAll }) {
  const update = (field, value) => {
    onChange?.({ ...range, [field]: Number(value) });
  };

  const getAvailableMonths = (year) => {
    if (!limits) return MONTHS;

    return MONTHS.filter((month) => {
      const afterStart = year > limits.fromYear || (year === limits.fromYear && month >= limits.fromMonth);
      const beforeEnd = year < limits.toYear || (year === limits.toYear && month <= limits.toMonth);

      return afterStart && beforeEnd; 
    })
  }

  const renderSelect = (field, options) => (
    <select
      className="border px-1"
      value={range?.[field] ?? ""}
      onChange={(e) => update(field, e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {field.includes("Month") ? MONTH_NAMES[option - 1] : option}
        </option>
      ))}
    </select>
  );

  // console.log("=== DateRangeSelector rendered ===");
  // console.log("Date limits: ", limits);
  // console.log("Start year: ", range.fromYear);
  // console.log("Start month: ", getAvailableMonths(range.fromYear));
  // console.log("End year: ", range.toYear);
  // console.log("End month: ", getAvailableMonths(range.toYear));

  return (
    <div className="flex items-center justify-between border border-dashed p-2">
      <div>
        <p className="font-bold">Plage de dates</p>
        <p>
          De : {renderSelect("fromYear", years)} {renderSelect("fromMonth", getAvailableMonths(range.fromYear))}
        </p>
        <p>
          À : {renderSelect("toYear", years)} {renderSelect("toMonth", getAvailableMonths(range.toYear))}
        </p>
      </div>

      <button className="bg-gray-500 px-4 py-1 text-white" onClick={onShowAll}>
        Toutes les données
      </button>
    </div>
  );
}


export default DateRangeSelector;
