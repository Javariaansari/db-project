export default function SelectBox({ label, name, value, onChange, options, required, placeholder = "-- Select --" }) {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-400 px-2 py-1 text-sm bg-white focus:outline-none focus:border-gray-700"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
