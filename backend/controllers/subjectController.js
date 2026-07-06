// backend/controllers/subjectController.js
const pool = require("../db/connection");

// GET /api/subjects  (optionally filter by semester_id)
async function getSubjects(req, res, next) {
  try {
    const { semester_id } = req.query;
    let query = `SELECT sub.*, sem.semester_name, sem.year, sem.batch
                 FROM subjects sub
                 JOIN semesters sem ON sub.semester_id = sem.id`;
    const params = [];
    if (semester_id) {
      params.push(semester_id);
      query += ` WHERE sub.semester_id = $1`;
    }
    query += " ORDER BY sub.id ASC";
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/subjects/:id
async function getSubjectById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM subjects WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// POST /api/subjects
async function createSubject(req, res, next) {
  try {
    const { subject_name, credit_hours, semester_id } = req.body;
    const result = await pool.query(
      `INSERT INTO subjects (subject_name, credit_hours, semester_id) VALUES ($1, $2, $3) RETURNING *`,
      [subject_name, credit_hours, semester_id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/subjects/:id
async function updateSubject(req, res, next) {
  try {
    const { id } = req.params;
    const { subject_name, credit_hours, semester_id } = req.body;
    const result = await pool.query(
      `UPDATE subjects SET subject_name=$1, credit_hours=$2, semester_id=$3 WHERE id=$4 RETURNING *`,
      [subject_name, credit_hours, semester_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/subjects/:id
async function deleteSubject(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM subjects WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    res.json({ success: true, message: "Subject deleted", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
