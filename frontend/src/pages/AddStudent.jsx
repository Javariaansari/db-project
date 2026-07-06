import { useEffect, useState } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import Table from "../components/Table";
import Button from "../components/Button";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/api";

const emptyForm = {
  roll_no: "",
  student_name: "",
  father_name: "",
  batch: "",
  department: "",
};

export default function AddStudent() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadStudents() {
    try {
      const res = await getStudents();
      setStudents(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (editingId) {
        await updateStudent(editingId, form);
        setMessage("Student updated successfully.");
      } else {
        await createStudent(form);
        setMessage("Student added successfully.");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  function handleEdit(row) {
    setEditingId(row.id);
    setForm({
      roll_no: row.roll_no,
      student_name: row.student_name,
      father_name: row.father_name || "",
      batch: row.batch,
      department: row.department,
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-lg font-bold mb-4">Add Student</h1>

      {message && <p className="text-green-700 text-sm mb-2">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <div className="flex flex-col md:flex-row gap-6">
        <Form
          title={editingId ? "Edit Student" : "New Student"}
          onSubmit={handleSubmit}
          submitLabel={editingId ? "Update Student" : "Add Student"}
        >
          <Input label="Roll No" name="roll_no" value={form.roll_no} onChange={handleChange} required />
          <Input label="Student Name" name="student_name" value={form.student_name} onChange={handleChange} required />
          <Input label="Father Name" name="father_name" value={form.father_name} onChange={handleChange} />
          <Input label="Batch" name="batch" value={form.batch} onChange={handleChange} required placeholder="e.g. 2022" />
          <Input label="Department" name="department" value={form.department} onChange={handleChange} required />
        </Form>

        <div className="flex-1">
          <h2 className="text-sm font-bold mb-2">Students Table</h2>
          <Table
            columns={[
              { key: "roll_no", label: "Roll No" },
              { key: "student_name", label: "Name" },
              { key: "father_name", label: "Father Name" },
              { key: "batch", label: "Batch" },
              { key: "department", label: "Department" },
            ]}
            rows={students}
            actions={(row) => (
              <div className="flex gap-1">
                <Button variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
