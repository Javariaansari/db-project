// backend/routes/gpaRoutes.js
const express = require("express");
const router = express.Router();
const {
  getGpaByStudent,
  getGpaBySemester,
  recalculateGpa,
} = require("../controllers/gpaController");

router.get("/student/:studentId", getGpaByStudent);
router.get("/semester/:semesterId", getGpaBySemester);
router.post("/recalculate", recalculateGpa);

module.exports = router;
