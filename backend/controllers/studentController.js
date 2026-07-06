// backend/controllers/studentController.js
const pool = require("../db/connection");

// GET /api/students
async function getStudents(req, res, next) {
  try {
    const { batch, department } = req.query;
    let query = "SELECT * FROM students";
    const params = [];
    const conditions = [];

    if (batch) {
      params.push(batch);
      conditions.push(`batch = $${params.length}`);
    }
    if (department) {
      params.push(department);
      conditions.push(`department = $${params.length}`);
    }
    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY id ASC";

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/students/:id
async function getStudentById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// POST /api/students
async function createStudent(req, res, next) {
  try {
    const { roll_no, student_name, father_name, batch, department } = req.body;
    const result = await pool.query(
      `INSERT INTO students (roll_no, student_name, father_name, batch, department)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [roll_no, student_name, father_name || null, batch, department]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/students/:id
async function updateStudent(req, res, next) {
  try {
    const { id } = req.params;
    const { roll_no, student_name, father_name, batch, department } = req.body;
    const result = await pool.query(
      `UPDATE students SET roll_no=$1, student_name=$2, father_name=$3, batch=$4, department=$5
       WHERE id=$6 RETURNING *`,
      [roll_no, student_name, father_name || null, batch, department, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/students/:id
async function deleteStudent(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM students WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, message: "Student deleted", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// GET /api/students/:id/datasheet  -> full datasheet (all semesters, subjects, results, gpa)
async function getStudentDatasheet(req, res, next) {
  try {
    const { id } = req.params;

    const studentRes = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const resultsRes = await pool.query(
      `SELECT r.id AS result_id, r.marks_obtained, r.total_marks, r.grade, r.grade_point,
              sub.id AS subject_id, sub.subject_name, sub.credit_hours,
              sem.id AS semester_id, sem.semester_name, sem.year, sem.batch
       FROM results r
       JOIN subjects sub ON r.subject_id = sub.id
       JOIN semesters sem ON sub.semester_id = sem.id
       WHERE r.student_id = $1
       ORDER BY sem.year ASC, sem.id ASC, sub.id ASC`,
      [id]
    );

    const gpaRes = await pool.query(
      `SELECT g.*, sem.semester_name, sem.year
       FROM gpa_records g
       JOIN semesters sem ON g.semester_id = sem.id
       WHERE g.student_id = $1
       ORDER BY sem.year ASC, sem.id ASC`,
      [id]
    );

    // group results by semester
    const semesterMap = {};
    resultsRes.rows.forEach((row) => {
      if (!semesterMap[row.semester_id]) {
        semesterMap[row.semester_id] = {
          semester_id: row.semester_id,
          semester_name: row.semester_name,
          year: row.year,
          batch: row.batch,
          subjects: [],
        };
      }
      semesterMap[row.semester_id].subjects.push({
        result_id: row.result_id,
        subject_id: row.subject_id,
        subject_name: row.subject_name,
        credit_hours: row.credit_hours,
        marks_obtained: row.marks_obtained,
        total_marks: row.total_marks,
        grade: row.grade,
        grade_point: row.grade_point,
      });
    });

    res.json({
      success: true,
      data: {
        student: studentRes.rows[0],
        semesters: Object.values(semesterMap),
        gpaRecords: gpaRes.rows,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentDatasheet,
};
