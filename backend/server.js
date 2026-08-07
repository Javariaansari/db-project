// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db/connection");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database Connection Failed:", err);
  } else {
    console.log("Database Connected Successfully");
    console.log(res.rows);
  }
});

const studentRoutes = require("./routes/studentRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const resultRoutes = require("./routes/resultRoutes");
const gpaRoutes = require("./routes/gpaRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res))=>{
  res.send({
    activeStatus:true,
    error:false,

  })
}

// simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/students", studentRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/gpa", gpaRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
