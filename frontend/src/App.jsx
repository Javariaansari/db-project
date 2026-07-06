import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import AddSemesterResult from "./pages/AddSemesterResult";
import StudentDatasheet from "./pages/StudentDatasheet";
import GPAReport from "./pages/GPAReport";
import BatchSemesterList from "./pages/BatchSemesterList";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/add-result" element={<AddSemesterResult />} />
        <Route path="/datasheet" element={<StudentDatasheet />} />
        <Route path="/gpa-report" element={<GPAReport />} />
        <Route path="/batches" element={<BatchSemesterList />} />
      </Routes>
    </div>
  );
}
