-- ===================================================================
-- Student Datasheet / Semester GPA & CGPA - PostgreSQL Schema
-- ===================================================================

DROP TABLE IF EXISTS gpa_records CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS semesters CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- ---------------------------------------------------------
-- students
-- ---------------------------------------------------------
CREATE TABLE students (
    id             SERIAL PRIMARY KEY,
    roll_no        VARCHAR(50)  NOT NULL UNIQUE,
    student_name   VARCHAR(150) NOT NULL,
    father_name    VARCHAR(150),
    batch          VARCHAR(50)  NOT NULL,
    department     VARCHAR(100) NOT NULL,
    created_at     TIMESTAMP DEFAULT NOW()
);

-- ---------------------------------------------------------
-- semesters
-- ---------------------------------------------------------
CREATE TABLE semesters (
    id             SERIAL PRIMARY KEY,
    semester_name  VARCHAR(50) NOT NULL,   -- e.g. "Semester 1"
    year           INT NOT NULL,
    batch          VARCHAR(50) NOT NULL
);

-- ---------------------------------------------------------
-- subjects
-- ---------------------------------------------------------
CREATE TABLE subjects (
    id             SERIAL PRIMARY KEY,
    subject_name   VARCHAR(150) NOT NULL,
    credit_hours   NUMERIC(4,2) NOT NULL,
    semester_id    INT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- results  (marks per student per subject)
-- ---------------------------------------------------------
CREATE TABLE results (
    id              SERIAL PRIMARY KEY,
    student_id      INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id      INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    marks_obtained  NUMERIC(6,2) NOT NULL,
    total_marks     NUMERIC(6,2) NOT NULL,
    grade           VARCHAR(5),
    grade_point     NUMERIC(3,2),
    UNIQUE(student_id, subject_id)
);

-- ---------------------------------------------------------
-- gpa_records  (semester gpa + running cgpa snapshot)
-- ---------------------------------------------------------
CREATE TABLE gpa_records (
    id             SERIAL PRIMARY KEY,
    student_id     INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester_id    INT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    semester_gpa   NUMERIC(4,2),
    cgpa           NUMERIC(4,2),
    UNIQUE(student_id, semester_id)
);

CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX idx_subjects_semester ON subjects(semester_id);
CREATE INDEX idx_gpa_student ON gpa_records(student_id);
