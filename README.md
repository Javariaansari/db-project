# Student Datasheet — Semester GPA & CGPA

A simple, table-based full-stack app (React + Tailwind on the frontend,
Node/Express + PostgreSQL on the backend) for managing students, semesters,
subjects, marks, and auto-calculated Semester GPA / CGPA.

The UI intentionally follows a plain, table-driven style (bordered tables,
simple forms) similar to the reference page, rather than a heavily
"designed" look.

## Folder Structure

```
project/
├── backend/
│   ├── db/
│   │   ├── connection.js      # PostgreSQL pool
│   │   └── seed.js            # creates schema + demo data
│   ├── models/sql/
│   │   └── schema.sql         # table definitions
│   ├── routes/                # studentRoutes, semesterRoutes, subjectRoutes, resultRoutes, gpaRoutes
│   ├── controllers/           # studentController, semesterController, subjectController, resultController, gpaController
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── utils/gpaUtils.js      # grade / GPA / CGPA formulas
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/        # Navbar, Table, Form, Button, Input, SelectBox, StudentCard, GPAResultBox
    │   ├── pages/              # Dashboard, AddStudent, AddSemesterResult, StudentDatasheet, GPAReport, BatchSemesterList
    │   ├── services/api.js     # axios calls to backend
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── .env.example
```

## 1. Database Setup (PostgreSQL)

1. Create a database:
   ```sql
   CREATE DATABASE student_gpa_db;
   ```
2. Copy `backend/.env.example` to `backend/.env` and fill in your PostgreSQL
   credentials:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=student_gpa_db
   ```
3. From `backend/`, install dependencies and run the seed script — this
   creates all tables (`models/sql/schema.sql`) and inserts a couple of demo
   students/results:
   ```bash
   cd backend
   npm install
   npm run seed
   ```

   (You can re-run `npm run seed` any time to reset the database — it drops
   and recreates all tables.)

## 2. Backend

```bash
cd backend
npm install     # if not already done
npm run dev     # starts on http://localhost:5000 (nodemon)
# or: npm start
```

Health check: `GET http://localhost:5000/api/health`

### API Endpoints

| Resource   | Endpoint                                   |
|------------|---------------------------------------------|
| Students   | `GET/POST /api/students`, `GET/PUT/DELETE /api/students/:id`, `GET /api/students/:id/datasheet` |
| Semesters  | `GET/POST /api/semesters`, `GET/PUT/DELETE /api/semesters/:id` |
| Subjects   | `GET/POST /api/subjects`, `GET/PUT/DELETE /api/subjects/:id` |
| Results    | `GET/POST /api/results`, `PUT/DELETE /api/results/:id` |
| GPA/CGPA   | `GET /api/gpa/student/:studentId`, `GET /api/gpa/semester/:semesterId`, `POST /api/gpa/recalculate` |

Adding/updating/deleting a result automatically recalculates that semester's
GPA and the student's overall CGPA (see `gpaController.recalculateGpaForStudent`).

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # adjust VITE_API_URL if backend runs elsewhere
npm run dev              # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser. The Navbar links to all six
pages: Dashboard, Add Student, Add Semester Result, Student Datasheet,
GPA/CGPA Report, and Batch/Semester List.

## GPA Formula Used

- **Grade & Grade Point**: derived from percentage (`marks_obtained / total_marks`)
  using a standard 4.0-scale table (see `backend/utils/gpaUtils.js`).
- **Semester GPA** = (Σ grade_point × credit_hours) ÷ (Σ credit_hours), for
  all subjects in that semester.
- **CGPA** = (Σ grade_point × credit_hours across ALL semesters) ÷
  (Σ credit_hours across ALL semesters).

## Notes

- CORS is enabled on the backend so the Vite dev server can call the API
  directly.
- Validation middleware checks required fields before hitting the database;
  the error middleware also translates common PostgreSQL errors (duplicate
  key, foreign key violation, not-null violation) into readable messages.
- Tables are deliberately plain (bordered `<table>` elements) to match the
  simple, table-based reference UI rather than a modern "card" design.
"# db-project" 
