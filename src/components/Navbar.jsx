import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">📘 Classroom Prototype</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {["/", "/student", "/teacher"].map((path, i) => {
            const labels = ["Home", "Student", "Teacher"];
            return (
              <NavLink
                key={i}
                to={path}
                className={({ isActive }) =>
                  `hover:text-yellow-300 transition ${
                    isActive ? "font-bold underline" : ""
                  }`
                }
              >
                {labels[i]}
              </NavLink>
            );
          })}
        </div>

        {/* Mobile Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-indigo-700 flex flex-col items-center py-4 space-y-4">
          <NavLink to="/" onClick={() => setIsOpen(false)} className="hover:text-yellow-300">
            Home
          </NavLink>
          <NavLink to="/student" onClick={() => setIsOpen(false)} className="hover:text-yellow-300">
            Student
          </NavLink>
          <NavLink to="/teacher" onClick={() => setIsOpen(false)} className="hover:text-yellow-300">
            Teacher
          </NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
