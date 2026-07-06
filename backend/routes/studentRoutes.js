// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentDatasheet,
} = require("../controllers/studentController");
const { validateStudent } = require("../middleware/validationMiddleware");

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.get("/:id/datasheet", getStudentDatasheet);
router.post("/", validateStudent, createStudent);
router.put("/:id", validateStudent, updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
