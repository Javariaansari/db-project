export default function Input({ label, name, type = "text", value, onChange, required, placeholder, step }) {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        step={step}
        className="w-full border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:border-gray-700"
      />
    </div>
  );
}
