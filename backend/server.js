// backend/server.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db/connection");

// Routes
const studentRoutes = require("./routes/studentRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const resultRoutes = require("./routes/resultRoutes");
const gpaRoutes = require("./routes/gpaRoutes");

// Error middleware
const {
    notFound,
    errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ======================================================
// REQUEST LOGGER
// ======================================================

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});


// ======================================================
// DATABASE CONNECTION TEST
// ======================================================

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database Connection Failed:", err.message);
    } else {
        console.log("Database Connected Successfully");
        console.log("Database Time:", result.rows[0]);
    }
});


// ======================================================
// ROOT ROUTE
// ======================================================

app.get("/", (req, res) => {
    res.status(200).json({
        activeStatus: true,
        error: false,
        message: "Server is running successfully",
    });
});


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});


// ======================================================
// API ROUTES
// ======================================================

app.use("/api/students", studentRoutes);

app.use("/api/semesters", semesterRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/results", resultRoutes);

app.use("/api/gpa", gpaRoutes);


// ======================================================
// 404 HANDLER
// ======================================================

app.use(notFound);


// ======================================================
// ERROR HANDLER
// ======================================================

app.use(errorHandler);


// ======================================================
// VERCEL EXPORT
// ======================================================

module.exports = app;


// ======================================================
// LOCAL DEVELOPMENT SERVER
// ======================================================

if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}