export default function GPAResultBox({ semesterName, semesterGpa, cgpa }) {
  return (
    <table className="border border-gray-400 text-sm bg-white mb-3">
      <tbody>
        <tr>
          {semesterName && (
            <>
              <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-100">
                Semester
              </td>
              <td className="border border-gray-400 px-2 py-1">{semesterName}</td>
            </>
          )}
          <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-100">
            Semester GPA
          </td>
          <td className="border border-gray-400 px-2 py-1 font-bold">{semesterGpa ?? "-"}</td>
          <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-100">CGPA</td>
          <td className="border border-gray-400 px-2 py-1 font-bold">{cgpa ?? "-"}</td>
        </tr>
      </tbody>
    </table>
  );
}
