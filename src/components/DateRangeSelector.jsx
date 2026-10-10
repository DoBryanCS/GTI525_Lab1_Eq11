// T3 : sélection de la plage de dates
// range : { fromYear, fromMonth, toYear, toMonth }
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function DateRangeSelector({ years = [], range, onChange, onShowAll }) {
  const update = (field, value) => {
    onChange?.({ ...range, [field]: Number(value) });
  };

  const renderSelect = (field, options) => (
    <select
      className="border px-1"
      value={range?.[field] ?? ""}
      onChange={(e) => update(field, e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  return (
    <div className="flex items-center justify-between border border-dashed p-2">
      <div>
        <p className="font-bold">Plage de dates</p>
        <p>
          De : {renderSelect("fromYear", years)} {renderSelect("fromMonth", MONTHS)}
        </p>
        <p>
          À : {renderSelect("toYear", years)} {renderSelect("toMonth", MONTHS)}
        </p>
      </div>

      <button className="bg-gray-500 px-4 py-1 text-white" onClick={onShowAll}>
        Toutes les données
      </button>
    </div>
  );
}

export default DateRangeSelector;
