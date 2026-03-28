import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin, Droplets, HeartPulse, ArrowRight } from "lucide-react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

function Field({ label, icon: Icon, type = "text", children, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  if (children) return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Icon size={17} /></span>
        <select {...props} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition text-sm appearance-none">
          {children}
        </select>
      </div>
    </div>
  );
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon size={17} /></span>
        <input {...props} type={isPassword ? (show ? "text" : "password") : type}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition text-sm" />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

function OTPInput({ value, onChange }) {
  const digits = (value + "      ").slice(0, 6).split("");
  const handleKey = (e, i) => {
    const val = e.target.value.replace(/\D/, "");
    const arr = (value + "      ").slice(0, 6).split("");
    arr[i] = val.slice(-1);
    onChange(arr.join("").trimEnd());
    if (val && i < 5) document.getElementById(`rotp-${i + 1}`)?.focus();
    if (e.key === "Backspace" && !val && i > 0) document.getElementById(`rotp-${i - 1}`)?.focus();
  };
  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input key={i} id={`rotp-${i}`} maxLength={1} value={d.trim()}
          onChange={(e) => handleKey(e, i)} onKeyDown={(e) => handleKey(e, i)}
          className="w-11 h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none bg-gray-50 focus:bg-white transition"
        />
      ))}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [view, setView] = useState("form"); // "form" | "otp"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", password: "", bloodGroup: "", city: "",
  });

  const handle = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  async function handleRegister(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await API.post("/auth/register", formData);
      setView("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  }

  async function handleVerify(e) {
    e.preventDefault(); setError("");
    if (otp.trim().length < 6) return setError("Enter the 6-digit OTP");
    setLoading(true);
    try {
      const res = await API.post("/auth/verify-otp", { email: formData.email, otp: otp.trim() });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally { setLoading(false); }
  }

  async function handleResend() {
    setError(""); setLoading(true);
    try {
      await API.post("/auth/register", formData);
      setOtp("");
      alert("OTP resent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally { setLoading(false); }
  }

  const Logo = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-md border border-red-100">
        <HeartPulse className="text-red-600" size={22} />
        <span className="text-xl font-extrabold text-red-600 tracking-tight">BloodCare</span>
      </div>
    </div>
  );

  if (view === "otp") return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Logo />
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-400" />
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-red-600" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Verify your email</h2>
            <p className="text-sm text-gray-500 mb-6">
              We sent a 6-digit code to <span className="font-semibold text-gray-700">{formData.email}</span>
            </p>
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
            )}
            <form onSubmit={handleVerify} className="space-y-6">
              <OTPInput value={otp} onChange={setOtp} />
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? "Verifying..." : <><span>Verify & Create Account</span><ArrowRight size={17} /></>}
              </button>
            </form>
            <button onClick={handleResend} disabled={loading} className="mt-4 text-sm text-red-600 hover:underline font-medium disabled:opacity-50">
              Didn't receive it? Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <Logo />
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-400" />
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Become a Donor</h2>
            <p className="text-sm text-gray-500 mb-6">Your contribution can save lives. Join our mission today.</p>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" icon={User} name="fullName" placeholder="Your full name" value={formData.fullName} onChange={handle} required />
                <Field label="Phone Number" icon={Phone} type="tel" name="phone" placeholder="9876543210" value={formData.phone} onChange={handle} required />
              </div>
              <Field label="Email Address" icon={Mail} type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handle} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Blood Group" icon={Droplets} name="bloodGroup" value={formData.bloodGroup} onChange={handle} required>
                  <option value="">Select Blood Group</option>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g} value={g}>{g}</option>)}
                </Field>
                <Field label="City" icon={MapPin} name="city" placeholder="Your city" value={formData.city} onChange={handle} required />
              </div>
              <Field label="Password" icon={Lock} type="password" name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handle} required />

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                {loading ? "Sending OTP..." : <><span>Create Account</span><ArrowRight size={17} /></>}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-red-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
