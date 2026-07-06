// Simple, plain, table-based UI component (not "AI-beautified")
// columns: [{ key, label }]
// rows: array of objects
// actions: optional render(row) -> JSX for edit/delete buttons
export default function Table({ columns, rows, actions, emptyText = "No records found." }) {
  return (
    <table className="w-full border border-gray-400 text-sm bg-white">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((col) => (
            <th
              key={col.key}
              className="border border-gray-400 px-2 py-1 text-left font-semibold"
            >
              {col.label}
            </th>
          ))}
          {actions && (
            <th className="border border-gray-400 px-2 py-1 text-left font-semibold">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rows && rows.length > 0 ? (
          rows.map((row, idx) => (
            <tr key={row.id ?? idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {columns.map((col) => (
                <td key={col.key} className="border border-gray-400 px-2 py-1">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="border border-gray-400 px-2 py-1">{actions(row)}</td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td
              className="border border-gray-400 px-2 py-2 text-center text-gray-500"
              colSpan={columns.length + (actions ? 1 : 0)}
            >
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
