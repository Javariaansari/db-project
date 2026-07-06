import { useEffect, useState } from "react";
import SelectBox from "../components/SelectBox";
import Table from "../components/Table";
import { getStudents, getSemesters } from "../services/api";

export default function BatchSemesterList() {
  const [students, setStudents] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [batch, setBatch] = useState("");

  useEffect(() => {
    getStudents().then((res) => setStudents(res.data.data));
    getSemesters().then((res) => setSemesters(res.data.data));
  }, []);

  const batches = [...new Set(students.map((s) => s.batch))];

  const filteredStudents = batch ? students.filter((s) => s.batch === batch) : students;
  const filteredSemesters = batch ? semesters.filter((s) => s.batch === batch) : semesters;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-lg font-bold mb-4">Batch / Semester List</h1>

      <div className="max-w-xs mb-4">
        <SelectBox
          label="Filter by Batch"
          name="batch"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          options={batches.map((b) => ({ value: b, label: b }))}
          placeholder="-- All Batches --"
        />
      </div>

      <h2 className="text-sm font-bold mb-2">Semesters</h2>
      <Table
        columns={[
          { key: "semester_name", label: "Semester" },
          { key: "year", label: "Year" },
          { key: "batch", label: "Batch" },
        ]}
        rows={filteredSemesters}
      />

      <h2 className="text-sm font-bold mb-2 mt-6">Students in Batch</h2>
      <Table
        columns={[
          { key: "roll_no", label: "Roll No" },
          { key: "student_name", label: "Name" },
          { key: "department", label: "Department" },
          { key: "batch", label: "Batch" },
        ]}
        rows={filteredStudents}
      />
    </div>
  );
}
