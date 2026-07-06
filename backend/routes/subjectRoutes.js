// backend/routes/subjectRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");
const { validateSubject } = require("../middleware/validationMiddleware");

router.get("/", getSubjects);
router.get("/:id", getSubjectById);
router.post("/", validateSubject, createSubject);
router.put("/:id", validateSubject, updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
