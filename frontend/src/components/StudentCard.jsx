export default function StudentCard({ student }) {
  if (!student) return null;
  return (
    <table className="border border-gray-400 text-sm bg-white mb-4">
      <tbody>
        <tr>
          <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-100">Roll No</td>
          <td className="border border-gray-400 px-2 py-1">{student.roll_no}</td>
          <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-100">Name</td>
          <td className="border border-gray-400 px-2 py-1">{student.student_name}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-100">Father Name</td>
          <td className="border border-gray-400 px-2 py-1">{student.father_name || "-"}</td>
          <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-100">Batch</td>
          <td className="border border-gray-400 px-2 py-1">{student.batch}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-100">Department</td>
          <td className="border border-gray-400 px-2 py-1" colSpan={3}>
            {student.department}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
