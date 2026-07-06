// backend/controllers/semesterController.js
const pool = require("../db/connection");

// GET /api/semesters
async function getSemesters(req, res, next) {
  try {
    const { batch } = req.query;
    let query = "SELECT * FROM semesters";
    const params = [];
    if (batch) {
      params.push(batch);
      query += ` WHERE batch = $1`;
    }
    query += " ORDER BY year ASC, id ASC";
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/semesters/:id
async function getSemesterById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM semesters WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Semester not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// POST /api/semesters
async function createSemester(req, res, next) {
  try {
    const { semester_name, year, batch } = req.body;
    const result = await pool.query(
      `INSERT INTO semesters (semester_name, year, batch) VALUES ($1, $2, $3) RETURNING *`,
      [semester_name, year, batch]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/semesters/:id
async function updateSemester(req, res, next) {
  try {
    const { id } = req.params;
    const { semester_name, year, batch } = req.body;
    const result = await pool.query(
      `UPDATE semesters SET semester_name=$1, year=$2, batch=$3 WHERE id=$4 RETURNING *`,
      [semester_name, year, batch, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Semester not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/semesters/:id
async function deleteSemester(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM semesters WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Semester not found" });
    }
    res.json({ success: true, message: "Semester deleted", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester,
};
