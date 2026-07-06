import { useEffect, useState } from "react";
import SelectBox from "../components/SelectBox";
import Table from "../components/Table";
import { getSemesters, getGpaBySemester, getStudents, getGpaByStudent } from "../services/api";

export default function GPAReport() {
  const [mode, setMode] = useState("semester"); // "semester" | "student"

  const [semesters, setSemesters] = useState([]);
  const [students, setStudents] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getSemesters().then((res) => setSemesters(res.data.data));
    getStudents().then((res) => setStudents(res.data.data));
  }, []);

  async function handleSemesterChange(e) {
    const id = e.target.value;
    setSemesterId(id);
    setRows([]);
    setError("");
    if (!id) return;
    try {
      const res = await getGpaBySemester(id);
      setRows(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  async function handleStudentChange(e) {
    const id = e.target.value;
    setStudentId(id);
    setRows([]);
    setError("");
    if (!id) return;
    try {
      const res = await getGpaByStudent(id);
      setRows(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-lg font-bold mb-4">GPA / CGPA Report</h1>

      <div className="flex gap-2 mb-4 text-sm">
        <button
          className={"px-3 py-1 border border-gray-400 " + (mode === "semester" ? "bg-gray-800 text-white" : "bg-gray-100")}
          onClick={() => { setMode("semester"); setRows([]); }}
        >
          By Semester (All Students)
        </button>
        <button
          className={"px-3 py-1 border border-gray-400 " + (mode === "student" ? "bg-gray-800 text-white" : "bg-gray-100")}
          onClick={() => { setMode("student"); setRows([]); }}
        >
          By Student (All Semesters)
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      {mode === "semester" ? (
        <>
          <div className="max-w-xs mb-4">
            <SelectBox
              label="Select Semester"
              name="semesterId"
              value={semesterId}
              onChange={handleSemesterChange}
              options={semesters.map((s) => ({ value: s.id, label: `${s.semester_name} (${s.batch} - ${s.year})` }))}
            />
          </div>
          <Table
            columns={[
              { key: "roll_no", label: "Roll No" },
              { key: "student_name", label: "Student" },
              { key: "semester_gpa", label: "Semester GPA" },
              { key: "cgpa", label: "CGPA" },
            ]}
            rows={rows}
          />
        </>
      ) : (
        <>
          <div className="max-w-xs mb-4">
            <SelectBox
              label="Select Student"
              name="studentId"
              value={studentId}
              onChange={handleStudentChange}
              options={students.map((s) => ({ value: s.id, label: `${s.roll_no} - ${s.student_name}` }))}
            />
          </div>
          <Table
            columns={[
              { key: "semester_name", label: "Semester" },
              { key: "year", label: "Year" },
              { key: "batch", label: "Batch" },
              { key: "semester_gpa", label: "Semester GPA" },
              { key: "cgpa", label: "CGPA" },
            ]}
            rows={rows}
          />
        </>
      )}
    </div>
  );
}
