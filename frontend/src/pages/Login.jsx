import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext"; // Correct import

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Hook MUST be inside component

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      login(res.data); // Saves user to AuthContext
      alert("Login successful!");
      navigate("/");
      
    } catch (error) {
      alert(error.response?.data?.message || "Invalid login credentials");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Phone or Email"
          name="emailOrPhone"
          type="text"
          placeholder="Enter phone/email"
          value={form.emailOrPhone}
          onChange={handleChange}
          required
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="mt-3 bg-red-600 w-full text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
