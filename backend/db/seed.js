// backend/db/seed.js
// Run with: npm run seed
const fs = require("fs");
const path = require("path");
const pool = require("./connection");
const { calculateGrade } = require("../utils/gpaUtils");
const { recalculateGpaForStudent } = require("../controllers/gpaController");

async function seed() {
  try {
    console.log("Running schema.sql ...");
    const schema = fs.readFileSync(
      path.join(__dirname, "../models/sql/schema.sql"),
      "utf8"
    );
    await pool.query(schema);
    console.log("Schema created.");

    // demo students
    const s1 = await pool.query(
      `INSERT INTO students (roll_no, student_name, father_name, batch, department)
       VALUES ('BS-101', 'Ali Raza', 'Mumtaz Raza', '2022', 'Computer Science') RETURNING id`
    );
    const s2 = await pool.query(
      `INSERT INTO students (roll_no, student_name, father_name, batch, department)
       VALUES ('BS-102', 'Sara Khan', 'Imran Khan', '2022', 'Computer Science') RETURNING id`
    );

    // demo semester
    const sem1 = await pool.query(
      `INSERT INTO semesters (semester_name, year, batch) VALUES ('Semester 1', 2022, '2022') RETURNING id`
    );

    // demo subjects
    const subA = await pool.query(
      `INSERT INTO subjects (subject_name, credit_hours, semester_id) VALUES ('Programming Fundamentals', 3, $1) RETURNING id`,
      [sem1.rows[0].id]
    );
    const subB = await pool.query(
      `INSERT INTO subjects (subject_name, credit_hours, semester_id) VALUES ('Calculus I', 3, $1) RETURNING id`,
      [sem1.rows[0].id]
    );

    // demo results for student 1
    const g1 = calculateGrade(88, 100);
    await pool.query(
      `INSERT INTO results (student_id, subject_id, marks_obtained, total_marks, grade, grade_point)
       VALUES ($1,$2,88,100,$3,$4)`,
      [s1.rows[0].id, subA.rows[0].id, g1.grade, g1.gradePoint]
    );
    const g2 = calculateGrade(75, 100);
    await pool.query(
      `INSERT INTO results (student_id, subject_id, marks_obtained, total_marks, grade, grade_point)
       VALUES ($1,$2,75,100,$3,$4)`,
      [s1.rows[0].id, subB.rows[0].id, g2.grade, g2.gradePoint]
    );

    await recalculateGpaForStudent(s1.rows[0].id, sem1.rows[0].id);

    console.log("Demo data inserted successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
