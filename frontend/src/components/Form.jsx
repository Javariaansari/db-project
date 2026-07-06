export default function Form({ title, onSubmit, children, submitLabel = "Save" }) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-gray-400 p-4 max-w-md"
    >
      {title && <h2 className="text-base font-bold mb-3 border-b border-gray-300 pb-2">{title}</h2>}
      {children}
      <button
        type="submit"
        className="mt-2 px-3 py-1 text-sm bg-gray-800 text-white border border-gray-400 hover:bg-gray-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
