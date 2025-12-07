import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="text-red-500" size={28} />
            <h2 className="text-2xl font-bold text-white">BloodCare</h2>
          </div>
          <p className="mt-3 text-sm leading-6">
            Donate blood. Save lives. Join our mission to ensure safe and reliable blood availability anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-red-500 transition">Home</Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-red-500 transition">Search Donor</Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-red-500 transition">Become a Donor</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-red-500 transition">Login</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-red-500 transition">Signup</Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">Phone: +91 98765 43210</p>
          <p className="text-sm mt-1">Email: support@bloodcare.org</p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition">
              <Facebook size={18} className="text-white" />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition">
              <Instagram size={18} className="text-white" />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition">
              <Twitter size={18} className="text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 py-4">
        <p className="text-center text-sm text-gray-400">
          Copyright © {new Date().getFullYear()} BloodCare. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
