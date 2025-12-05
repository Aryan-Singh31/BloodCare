// src/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    bloodGroup: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Registration Submitted (Backend pending)");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-b from-red-50 via-white to-red-50 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-red-100"
           data-aos="zoom-in">

        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-2">
          Become a Blood Donor
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Your contribution can save lives. Join our mission today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="font-medium text-gray-700 text-sm">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-medium text-gray-700 text-sm">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-medium text-gray-700 text-sm">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="font-medium text-gray-700 text-sm">Blood Group</label>
            <select
              name="bloodGroup"
              required
              value={formData.bloodGroup}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500 outline-none"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="font-medium text-gray-700 text-sm">City</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="Your city"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-gray-700 text-sm">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition shadow-md"
          >
            Sign Up
          </button>
        </form>

        {/* Already Registered */}
        <p className="text-center text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
