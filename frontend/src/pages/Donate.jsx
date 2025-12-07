import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function Donate() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get logged-in user

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    bloodGroup: "",
    city: "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      alert("Please login first to register as a donor");
      return navigate("/login");
    }

    try {
      setLoading(true);

      await API.post("/donors/register", {
        userId: user._id,
        ...form,
      });

      alert("Successfully registered as a donor!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to register as donor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 px-4">
      <div
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-red-100"
        data-aos="zoom-in"
      >
        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-3">
          Register as Donor
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Your blood can save someone's life. Fill in details to become a donor.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            required
            value={form.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Full Name"
          />

          {/* Blood Group */}
          <select
            name="bloodGroup"
            required
            value={form.bloodGroup}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>

          {/* City */}
          <input
            type="text"
            name="city"
            required
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter your city"
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Phone Number"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register as Donor"}
          </button>
        </form>
      </div>
    </div>
  );
}
