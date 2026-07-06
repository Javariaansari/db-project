// backend/controllers/resultController.js
const pool = require("../db/connection");
const { calculateGrade } = require("../utils/gpaUtils");
const { recalculateGpaForStudent } = require("./gpaController");


// GET /api/results  (optionally filter by student_id or subject_id)
async function getResults(req, res, next) {
  try {
    const { student_id, subject_id } = req.query;
    let query = `SELECT r.*, s.student_name, sub.subject_name, sub.credit_hours, sub.semester_id
                 FROM results r
                 JOIN students s ON r.student_id = s.id
                 JOIN subjects sub ON r.subject_id = sub.id`;
    const params = [];
    const conditions = [];
    if (student_id) {
      params.push(student_id);
      conditions.push(`r.student_id = $${params.length}`);
    }
    if (subject_id) {
      params.push(subject_id);
      conditions.push(`r.subject_id = $${params.length}`);
    }
    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY r.id ASC";

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/results  -> add marks, auto-calculate grade + grade point, then recalc GPA/CGPA
async function createResult(req, res, next) {
  try {
    const { student_id, subject_id, marks_obtained, total_marks } = req.body;

    const { grade, gradePoint } = calculateGrade(marks_obtained, total_marks);

    const result = await pool.query(
      `INSERT INTO results (student_id, subject_id, marks_obtained, total_marks, grade, grade_point)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [student_id, subject_id, marks_obtained, total_marks, grade, gradePoint]
    );

    // find the semester this subject belongs to, then recalc GPA/CGPA
    const subjectRes = await pool.query("SELECT semester_id FROM subjects WHERE id = $1", [subject_id]);
    const semesterId = subjectRes.rows[0]?.semester_id;

    let gpaInfo = null;
    if (semesterId) {
      gpaInfo = await recalculateGpaForStudent(student_id, semesterId);
    }

    res.status(201).json({ success: true, data: result.rows[0], gpa: gpaInfo });
  } catch (err) {
    next(err);
  }
}

// PUT /api/results/:id -> update marks, re-grade, recalc GPA/CGPA
async function updateResult(req, res, next) {
  try {
    const { id } = req.params;
    const { marks_obtained, total_marks } = req.body;

    const { grade, gradePoint } = calculateGrade(marks_obtained, total_marks);

    const result = await pool.query(
      `UPDATE results SET marks_obtained=$1, total_marks=$2, grade=$3, grade_point=$4
       WHERE id=$5 RETURNING *`,
      [marks_obtained, total_marks, grade, gradePoint, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    const row = result.rows[0];
    const subjectRes = await pool.query("SELECT semester_id FROM subjects WHERE id = $1", [row.subject_id]);
    const semesterId = subjectRes.rows[0]?.semester_id;

    let gpaInfo = null;
    if (semesterId) {
      gpaInfo = await recalculateGpaForStudent(row.student_id, semesterId);
    }

    res.json({ success: true, data: row, gpa: gpaInfo });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/results/:id
async function deleteResult(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM results WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    const row = result.rows[0];
    const subjectRes = await pool.query("SELECT semester_id FROM subjects WHERE id = $1", [row.subject_id]);
    const semesterId = subjectRes.rows[0]?.semester_id;

    let gpaInfo = null;
    if (semesterId) {
      gpaInfo = await recalculateGpaForStudent(row.student_id, semesterId);
    }

    res.json({ success: true, message: "Result deleted", data: row, gpa: gpaInfo });
  } catch (err) {
    next(err);
  }
}

module.exports = { getResults, createResult, updateResult, deleteResult };
