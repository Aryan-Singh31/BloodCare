import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-red-600">
          BloodCare
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center font-medium">
          <Link to="/" className="hover:text-red-600 transition">Home</Link>
          <Link to="/search" className="hover:text-red-600 transition">Search</Link>

          <Link
            to="/donate"
            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
          >
            Donate
          </Link>

          <Link to="/aboutus" className="hover:text-red-600 transition">
            About Us
          </Link>

          {user ? (
            <>
              <span className="text-red-600 font-semibold">
                {user.fullName}
              </span>
              <button
                onClick={logout}
                className="border border-red-600 px-4 py-1 rounded-full hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
              <Link to="/messages">Messages</Link>

              
            </>
          ) : (
            <Link
              to="/register"
              className="border border-red-600 px-4 py-1 rounded-full hover:bg-red-600 hover:text-white transition"
            >
              Login/Signup
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="md:hidden bg-red-50 py-4 space-y-2 px-6">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block hover:text-red-600 transition"
          >
            Home
          </Link>

          <Link
            to="/search"
            onClick={() => setOpen(false)}
            className="block hover:text-red-600 transition"
          >
            Search
          </Link>

          <Link
            to="/donate"
            onClick={() => setOpen(false)}
            className="block bg-red-600 text-white px-4 py-2 rounded-full text-center hover:bg-red-700 transition"
          >
            Donate
          </Link>

          <Link
            to="/aboutus"
            onClick={() => setOpen(false)}
            className="block hover:text-red-600 transition"
          >
            About Us
          </Link>

          {user ? (
            <>
              <span className="block text-red-600 font-semibold text-center">
                {user.fullName}
              </span>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="block w-full border border-red-600 px-4 py-2 rounded-full text-center hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="block border border-red-600 px-4 py-2 rounded-full text-center hover:bg-red-600 hover:text-white transition"
            >
              Login/Signup
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
