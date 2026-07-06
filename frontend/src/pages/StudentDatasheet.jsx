import { useEffect, useState } from "react";
import SelectBox from "../components/SelectBox";
import StudentCard from "../components/StudentCard";
import Table from "../components/Table";
import GPAResultBox from "../components/GPAResultBox";
import { getStudents, getStudentDatasheet } from "../services/api";

export default function StudentDatasheet() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [datasheet, setDatasheet] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStudents().then((res) => setStudents(res.data.data));
  }, []);

  async function handleSelect(e) {
    const id = e.target.value;
    setStudentId(id);
    setDatasheet(null);
    setError("");
    if (!id) return;
    try {
      const res = await getStudentDatasheet(id);
      setDatasheet(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-lg font-bold mb-4">Student Datasheet</h1>

      <div className="max-w-xs mb-4">
        <SelectBox
          label="Select Student"
          name="studentId"
          value={studentId}
          onChange={handleSelect}
          options={students.map((s) => ({ value: s.id, label: `${s.roll_no} - ${s.student_name}` }))}
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      {datasheet && (
        <>
          <StudentCard student={datasheet.student} />

          {datasheet.semesters.length === 0 && (
            <p className="text-sm text-gray-600">No results recorded yet for this student.</p>
          )}

          {datasheet.semesters.map((sem) => {
            const gpaRecord = datasheet.gpaRecords.find((g) => g.semester_id === sem.semester_id);
            return (
              <div key={sem.semester_id} className="mb-6">
                <h2 className="text-sm font-bold mb-2">
                  {sem.semester_name} ({sem.year}) - Batch {sem.batch}
                </h2>
                <Table
                  columns={[
                    { key: "subject_name", label: "Subject" },
                    { key: "credit_hours", label: "Credit Hours" },
                    { key: "marks_obtained", label: "Marks Obtained" },
                    { key: "total_marks", label: "Total Marks" },
                    { key: "grade", label: "Grade" },
                    { key: "grade_point", label: "Grade Point" },
                  ]}
                  rows={sem.subjects}
                />
                <div className="mt-2">
                  <GPAResultBox
                    semesterGpa={gpaRecord?.semester_gpa}
                    cgpa={gpaRecord?.cgpa}
                  />
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
