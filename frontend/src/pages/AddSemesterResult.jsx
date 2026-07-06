import { useEffect, useState } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import SelectBox from "../components/SelectBox";
import Table from "../components/Table";
import Button from "../components/Button";
import GPAResultBox from "../components/GPAResultBox";
import {
  getSemesters,
  createSemester,
  deleteSemester,
  getSubjects,
  createSubject,
  deleteSubject,
  getStudents,
  createResult,
  deleteResult,
  getResults,
} from "../services/api";

export default function AddSemesterResult() {
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [semesterForm, setSemesterForm] = useState({ semester_name: "", year: "", batch: "" });
  const [subjectForm, setSubjectForm] = useState({ subject_name: "", credit_hours: "", semester_id: "" });
  const [resultForm, setResultForm] = useState({ student_id: "", subject_id: "", marks_obtained: "", total_marks: "" });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lastGpa, setLastGpa] = useState(null);

  async function loadAll() {
    try {
      const [semRes, subRes, stuRes, resRes] = await Promise.all([
        getSemesters(),
        getSubjects(),
        getStudents(),
        getResults(),
      ]);
      setSemesters(semRes.data.data);
      setSubjects(subRes.data.data);
      setStudents(stuRes.data.data);
      setResults(resRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleAddSemester(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await createSemester(semesterForm);
      setMessage("Semester added.");
      setSemesterForm({ semester_name: "", year: "", batch: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  async function handleAddSubject(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await createSubject(subjectForm);
      setMessage("Subject added.");
      setSubjectForm({ subject_name: "", credit_hours: "", semester_id: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  async function handleAddResult(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await createResult(resultForm);
      setMessage("Marks added and GPA/CGPA recalculated.");
      setLastGpa(res.data.gpa);
      setResultForm({ student_id: "", subject_id: "", marks_obtained: "", total_marks: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  async function handleDeleteSemester(id) {
    if (!window.confirm("Delete this semester? Subjects/results under it will also be removed.")) return;
    await deleteSemester(id);
    loadAll();
  }

  async function handleDeleteSubject(id) {
    if (!window.confirm("Delete this subject?")) return;
    await deleteSubject(id);
    loadAll();
  }

  async function handleDeleteResult(id) {
    if (!window.confirm("Delete this result?")) return;
    await deleteResult(id);
    loadAll();
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-lg font-bold mb-4">Add Semester Result</h1>

      {message && <p className="text-green-700 text-sm mb-2">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {lastGpa && (
        <GPAResultBox semesterGpa={lastGpa.semester_gpa} cgpa={lastGpa.cgpa} />
      )}

      {/* Section: Semesters */}
      <h2 className="text-sm font-bold mt-4 mb-2 border-b border-gray-300 pb-1">Semesters</h2>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Form title="Add Semester" onSubmit={handleAddSemester} submitLabel="Add Semester">
          <Input label="Semester Name" name="semester_name" value={semesterForm.semester_name}
            onChange={(e) => setSemesterForm({ ...semesterForm, semester_name: e.target.value })} required placeholder="Semester 1" />
          <Input label="Year" name="year" type="number" value={semesterForm.year}
            onChange={(e) => setSemesterForm({ ...semesterForm, year: e.target.value })} required />
          <Input label="Batch" name="batch" value={semesterForm.batch}
            onChange={(e) => setSemesterForm({ ...semesterForm, batch: e.target.value })} required placeholder="e.g. 2022" />
        </Form>
        <div className="flex-1">
          <Table
            columns={[
              { key: "semester_name", label: "Semester" },
              { key: "year", label: "Year" },
              { key: "batch", label: "Batch" },
            ]}
            rows={semesters}
            actions={(row) => (
              <Button variant="danger" onClick={() => handleDeleteSemester(row.id)}>Delete</Button>
            )}
          />
        </div>
      </div>

      {/* Section: Subjects */}
      <h2 className="text-sm font-bold mt-4 mb-2 border-b border-gray-300 pb-1">Subjects</h2>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Form title="Add Subject" onSubmit={handleAddSubject} submitLabel="Add Subject">
          <Input label="Subject Name" name="subject_name" value={subjectForm.subject_name}
            onChange={(e) => setSubjectForm({ ...subjectForm, subject_name: e.target.value })} required />
          <Input label="Credit Hours" name="credit_hours" type="number" step="0.5" value={subjectForm.credit_hours}
            onChange={(e) => setSubjectForm({ ...subjectForm, credit_hours: e.target.value })} required />
          <SelectBox label="Semester" name="semester_id" value={subjectForm.semester_id}
            onChange={(e) => setSubjectForm({ ...subjectForm, semester_id: e.target.value })} required
            options={semesters.map((s) => ({ value: s.id, label: `${s.semester_name} (${s.batch} - ${s.year})` }))} />
        </Form>
        <div className="flex-1">
          <Table
            columns={[
              { key: "subject_name", label: "Subject" },
              { key: "credit_hours", label: "Credit Hours" },
              { key: "semester_name", label: "Semester" },
              { key: "batch", label: "Batch" },
            ]}
            rows={subjects}
            actions={(row) => (
              <Button variant="danger" onClick={() => handleDeleteSubject(row.id)}>Delete</Button>
            )}
          />
        </div>
      </div>

      {/* Section: Marks / Results */}
      <h2 className="text-sm font-bold mt-4 mb-2 border-b border-gray-300 pb-1">Marks / Results</h2>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Form title="Add Marks" onSubmit={handleAddResult} submitLabel="Add Marks">
          <SelectBox label="Student" name="student_id" value={resultForm.student_id}
            onChange={(e) => setResultForm({ ...resultForm, student_id: e.target.value })} required
            options={students.map((s) => ({ value: s.id, label: `${s.roll_no} - ${s.student_name}` }))} />
          <SelectBox label="Subject" name="subject_id" value={resultForm.subject_id}
            onChange={(e) => setResultForm({ ...resultForm, subject_id: e.target.value })} required
            options={subjects.map((s) => ({ value: s.id, label: `${s.subject_name} (${s.semester_name})` }))} />
          <Input label="Marks Obtained" name="marks_obtained" type="number" value={resultForm.marks_obtained}
            onChange={(e) => setResultForm({ ...resultForm, marks_obtained: e.target.value })} required />
          <Input label="Total Marks" name="total_marks" type="number" value={resultForm.total_marks}
            onChange={(e) => setResultForm({ ...resultForm, total_marks: e.target.value })} required />
        </Form>
        <div className="flex-1">
          <Table
            columns={[
              { key: "student_name", label: "Student" },
              { key: "subject_name", label: "Subject" },
              { key: "marks_obtained", label: "Obtained" },
              { key: "total_marks", label: "Total" },
              { key: "grade", label: "Grade" },
              { key: "grade_point", label: "Grade Point" },
            ]}
            rows={results}
            actions={(row) => (
              <Button variant="danger" onClick={() => handleDeleteResult(row.id)}>Delete</Button>
            )}
          />
        </div>
      </div>
    </div>
  );
}
