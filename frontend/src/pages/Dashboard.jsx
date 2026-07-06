import { useEffect, useState } from "react";
import { getStudents, getSemesters, getResults } from "../services/api";
import Table from "../components/Table";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [sRes, semRes, resRes] = await Promise.all([
          getStudents(),
          getSemesters(),
          getResults(),
        ]);
        setStudents(sRes.data.data);
        setSemesters(semRes.data.data);
        setResults(resRes.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const batches = [...new Set(students.map((s) => s.batch))];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-lg font-bold mb-4">Dashboard</h1>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {loading && <p className="text-sm text-gray-600">Loading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <table className="border border-gray-400 bg-white text-sm w-full">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 bg-gray-100 font-semibold">Total Students</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-3 text-center text-xl font-bold">{students.length}</td>
            </tr>
          </tbody>
        </table>
        <table className="border border-gray-400 bg-white text-sm w-full">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 bg-gray-100 font-semibold">Total Semesters</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-3 text-center text-xl font-bold">{semesters.length}</td>
            </tr>
          </tbody>
        </table>
        <table className="border border-gray-400 bg-white text-sm w-full">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 bg-gray-100 font-semibold">Total Batches</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-3 text-center text-xl font-bold">{batches.length}</td>
            </tr>
          </tbody>
        </table>
        <table className="border border-gray-400 bg-white text-sm w-full">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 bg-gray-100 font-semibold">Total Results</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-3 text-center text-xl font-bold">{results.length}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-sm font-bold mb-2">Students</h2>
      <Table
        columns={[
          { key: "roll_no", label: "Roll No" },
          { key: "student_name", label: "Name" },
          { key: "batch", label: "Batch" },
          { key: "department", label: "Department" },
        ]}
        rows={students}
      />
    </div>
  );
}
