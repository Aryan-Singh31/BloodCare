import { useState } from "react";
import InputField from "../components/InputField";

export default function Login() {
  const [form, setForm] = useState({
    phone: "",
    password: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);
    // TODO: API call for login
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Phone Number"
          name="phone"
          type="text"
          placeholder="Enter phone"
          value={form.phone}
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
