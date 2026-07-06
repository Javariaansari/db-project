// backend/routes/semesterRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester,
} = require("../controllers/semesterController");
const { validateSemester } = require("../middleware/validationMiddleware");

router.get("/", getSemesters);
router.get("/:id", getSemesterById);
router.post("/", validateSemester, createSemester);
router.put("/:id", validateSemester, updateSemester);
router.delete("/:id", deleteSemester);

module.exports = router;
