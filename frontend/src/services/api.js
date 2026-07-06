// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------- Students ----------
export const getStudents = (params) => api.get("/students", { params });
export const getStudentById = (id) => api.get(`/students/${id}`);
export const getStudentDatasheet = (id) => api.get(`/students/${id}/datasheet`);
export const createStudent = (data) => api.post("/students", data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// ---------- Semesters ----------
export const getSemesters = (params) => api.get("/semesters", { params });
export const getSemesterById = (id) => api.get(`/semesters/${id}`);
export const createSemester = (data) => api.post("/semesters", data);
export const updateSemester = (id, data) => api.put(`/semesters/${id}`, data);
export const deleteSemester = (id) => api.delete(`/semesters/${id}`);

// ---------- Subjects ----------
export const getSubjects = (params) => api.get("/subjects", { params });
export const createSubject = (data) => api.post("/subjects", data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);

// ---------- Results ----------
export const getResults = (params) => api.get("/results", { params });
export const createResult = (data) => api.post("/results", data);
export const updateResult = (id, data) => api.put(`/results/${id}`, data);
export const deleteResult = (id) => api.delete(`/results/${id}`);

// ---------- GPA / CGPA ----------
export const getGpaByStudent = (studentId) => api.get(`/gpa/student/${studentId}`);
export const getGpaBySemester = (semesterId) => api.get(`/gpa/semester/${semesterId}`);
export const recalculateGpa = (data) => api.post("/gpa/recalculate", data);

export default api;
