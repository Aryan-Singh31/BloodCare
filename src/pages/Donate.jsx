import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    bloodGroup: "",
    location: "",
    phone: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);
    // API call: register user
  }

  return (
    <div className="max-w-md mx-auto mt-5 p-6 shadow-lg bg-white rounded">
      <h2 className="text-xl font-bold mb-4">Register as Donor</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input name="fullName" onChange={handleChange} className="w-full border p-2 rounded" placeholder="Full Name" required />
        <input name="bloodGroup" onChange={handleChange} className="w-full border p-2 rounded" placeholder="Blood Group" />
        <input name="location" onChange={handleChange} className="w-full border p-2 rounded" placeholder="City / Area" />
        <input name="phone" onChange={handleChange} className="w-full border p-2 rounded" placeholder="Contact Number" />

        <button className="bg-red-600 w-full text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
