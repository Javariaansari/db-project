import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/add-student", label: "Add Student" },
  { to: "/add-result", label: "Add Semester Result" },
  { to: "/datasheet", label: "Student Datasheet" },
  { to: "/gpa-report", label: "GPA / CGPA Report" },
  { to: "/batches", label: "Batch / Semester List" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap">
        <span className="font-bold text-gray-800 text-sm mr-4">
          Student Datasheet | Semester GPA &amp; CGPA
        </span>
        <ul className="flex flex-wrap gap-1 text-sm">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={
                  "block px-3 py-1 border border-gray-300 " +
                  (location.pathname === link.to
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200")
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
