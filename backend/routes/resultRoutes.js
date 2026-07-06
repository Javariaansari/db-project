// backend/routes/resultRoutes.js
const express = require("express");
const router = express.Router();
const {
  getResults,
  createResult,
  updateResult,
  deleteResult,
} = require("../controllers/resultController");
const { validateResult } = require("../middleware/validationMiddleware");

router.get("/", getResults);
router.post("/", validateResult, createResult);
router.put("/:id", validateResult, updateResult);
router.delete("/:id", deleteResult);

module.exports = router;
