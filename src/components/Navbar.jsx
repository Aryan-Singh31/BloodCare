import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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

          <Link to="/aboutus" className="hover:text-red-600 transition">AboutUs</Link>
          <Link
            to="/register"
            className="border border-red-600 px-4 py-1 rounded-full hover:bg-red-600 hover:text-white transition"
          >
            Login/Signup
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="md:hidden bg-red-50 py-4 space-y-2 px-6">
          <Link to="/" className="block hover:text-red-600 transition" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/search" className="block hover:text-red-600 transition" onClick={() => setOpen(false)}>
            Search
          </Link>

          <Link
            to="/donate"
            className="block bg-red-600 text-white px-4 py-2 rounded-full text-center hover:bg-red-700 transition"
            onClick={() => setOpen(false)}
          >
            Donate
          </Link>

          <Link to="/aboutus" className="block hover:text-red-600 transition" onClick={() => setOpen(false)}>
            AboutUs
          </Link>
          <Link
            to="/register"
            className="block border border-red-600 px-4 py-2 rounded-full text-center hover:bg-red-600 hover:text-white transition"
            onClick={() => setOpen(false)}
          >
            Login/Signup
          </Link>
        </div>
      )}
    </nav>
  );
}
