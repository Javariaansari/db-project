// backend/controllers/gpaController.js
const pool = require("../db/connection");
const { calculateSemesterGPA, calculateCGPA } = require("../utils/gpaUtils");

/**
 * Shared helper: recalculates semester GPA for the given semester,
 * then recalculates CGPA across ALL semesters the student has taken,
 * and upserts the gpa_records table. Used by resultController after
 * every marks insert/update/delete.
 */
async function recalculateGpaForStudent(studentId, semesterId) {
  // 1. get all results for this student within this semester
  const semesterResults = await pool.query(
    `SELECT r.grade_point, sub.credit_hours
     FROM results r
     JOIN subjects sub ON r.subject_id = sub.id
     WHERE r.student_id = $1 AND sub.semester_id = $2`,
    [studentId, semesterId]
  );

  const semesterGpa = calculateSemesterGPA(semesterResults.rows);

  // 2. get ALL results for this student across every semester (for CGPA)
  const allResults = await pool.query(
    `SELECT r.grade_point, sub.credit_hours
     FROM results r
     JOIN subjects sub ON r.subject_id = sub.id
     WHERE r.student_id = $1`,
    [studentId]
  );

  const cgpa = calculateCGPA(allResults.rows);

  // 3. upsert into gpa_records for this semester
  const upsert = await pool.query(
    `INSERT INTO gpa_records (student_id, semester_id, semester_gpa, cgpa)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (student_id, semester_id)
     DO UPDATE SET semester_gpa = EXCLUDED.semester_gpa, cgpa = EXCLUDED.cgpa
     RETURNING *`,
    [studentId, semesterId, semesterGpa, cgpa]
  );

  // 4. also refresh cgpa value stored against every OTHER semester row
  //    the student already has, so cgpa always reflects the latest total
  await pool.query(
    `UPDATE gpa_records SET cgpa = $1 WHERE student_id = $2`,
    [cgpa, studentId]
  );

  return upsert.rows[0];
}

// GET /api/gpa/student/:studentId  -> all gpa records for a student
async function getGpaByStudent(req, res, next) {
  try {
    const { studentId } = req.params;
    const result = await pool.query(
      `SELECT g.*, sem.semester_name, sem.year, sem.batch
       FROM gpa_records g
       JOIN semesters sem ON g.semester_id = sem.id
       WHERE g.student_id = $1
       ORDER BY sem.year ASC, sem.id ASC`,
      [studentId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/gpa/semester/:semesterId -> gpa table for a whole semester (all students)
async function getGpaBySemester(req, res, next) {
  try {
    const { semesterId } = req.params;
    const result = await pool.query(
      `SELECT g.*, s.student_name, s.roll_no
       FROM gpa_records g
       JOIN students s ON g.student_id = s.id
       WHERE g.semester_id = $1
       ORDER BY s.roll_no ASC`,
      [semesterId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/gpa/recalculate  -> manual trigger { student_id, semester_id }
async function recalculateGpa(req, res, next) {
  try {
    const { student_id, semester_id } = req.body;
    if (!student_id || !semester_id) {
      return res.status(400).json({ success: false, message: "student_id and semester_id are required" });
    }
    const record = await recalculateGpaForStudent(student_id, semester_id);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getGpaByStudent,
  getGpaBySemester,
  recalculateGpa,
  recalculateGpaForStudent,
};
