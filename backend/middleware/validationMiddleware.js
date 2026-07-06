// backend/middleware/validationMiddleware.js

function validateStudent(req, res, next) {
  const { roll_no, student_name, batch, department } = req.body;
  const errors = [];

  if (!roll_no || !roll_no.trim()) errors.push("roll_no is required");
  if (!student_name || !student_name.trim()) errors.push("student_name is required");
  if (!batch || !batch.trim()) errors.push("batch is required");
  if (!department || !department.trim()) errors.push("department is required");

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }
  next();
}

function validateSemester(req, res, next) {
  const { semester_name, year, batch } = req.body;
  const errors = [];

  if (!semester_name || !semester_name.trim()) errors.push("semester_name is required");
  if (!year) errors.push("year is required");
  if (!batch || !batch.trim()) errors.push("batch is required");

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }
  next();
}

function validateSubject(req, res, next) {
  const { subject_name, credit_hours, semester_id } = req.body;
  const errors = [];

  if (!subject_name || !subject_name.trim()) errors.push("subject_name is required");
  if (!credit_hours || isNaN(Number(credit_hours))) errors.push("credit_hours must be a number");
  if (!semester_id) errors.push("semester_id is required");

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }
  next();
}

function validateResult(req, res, next) {
  const { student_id, subject_id, marks_obtained, total_marks } = req.body;
  const errors = [];

  if (!student_id) errors.push("student_id is required");
  if (!subject_id) errors.push("subject_id is required");
  if (marks_obtained === undefined || isNaN(Number(marks_obtained))) errors.push("marks_obtained must be a number");
  if (!total_marks || isNaN(Number(total_marks))) errors.push("total_marks must be a number");
  if (Number(marks_obtained) > Number(total_marks)) errors.push("marks_obtained cannot exceed total_marks");

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }
  next();
}

module.exports = {
  validateStudent,
  validateSemester,
  validateSubject,
  validateResult,
};
