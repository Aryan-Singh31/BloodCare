import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Heart } from "lucide-react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

function Field({ label, icon: Icon, type = "text", ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={17} />
        </span>
        <input
          {...props}
          type={isPassword ? (show ? "text" : "password") : type}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition text-sm"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
    if (val && i < 5) document.getElementById("otp-" + (i + 1))?.focus();
    if (e.key === "Backspace" && !val && i > 0) document.getElementById("otp-" + (i - 1))?.focus();
  };
  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input key={i} id={"otp-" + i} maxLength={1} value={d.trim()}
          onChange={(e) => handleKey(e, i)} onKeyDown={(e) => handleKey(e, i)}
          className="w-11 h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none bg-gray-50 focus:bg-white transition"
        />
      ))}
    </div>
  );
}

function Card({ children, title, subtitle, error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-md border border-red-100">
            <Heart className="text-red-600 fill-red-600" size={22} />
            <span className="text-xl font-extrabold text-red-600 tracking-tight">BloodCare</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-400" />
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const go = (v) => { setView(v); setError(""); };

  const btnClass = "w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2";

  async function handleLogin(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      login(res.data); navigate("/");
    } catch (err) {
      const d = err.response?.data;
      setError(d?.unverified ? "Email not verified. Please check your inbox." : d?.message || "Invalid credentials");
    } finally { setLoading(false); }
  }

  async function handleForgotSend(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email: forgotEmail });
      go("forgot-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  }

  function handleForgotVerify(e) {
    e.preventDefault();
    if (resetOtp.trim().length < 6) return setError("Enter the 6-digit OTP");
    go("reset");
  }

  async function handleReset(e) {
    e.preventDefault(); setError("");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { email: forgotEmail, otp: resetOtp.trim(), newPassword });
      go("login");
      setForgotEmail(""); setResetOtp(""); setNewPassword(""); setConfirmPassword("");
      alert("Password reset successful! Please login.");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally { setLoading(false); }
  }

  if (view === "login") return (
    <Card title="Welcome back" subtitle="Sign in to your BloodCare account" error={error}>
      <form onSubmit={handleLogin} className="space-y-4">
        <Field label="Email or Phone" icon={Mail} name="emailOrPhone" placeholder="Enter email or phone" value={form.emailOrPhone} onChange={set("emailOrPhone")} required />
        <Field label="Password" icon={Lock} type="password" name="password" placeholder="Enter your password" value={form.password} onChange={set("password")} required />
        <div className="flex justify-end">
          <button type="button" onClick={() => go("forgot-email")} className="text-sm text-red-600 hover:underline font-medium">
            Forgot password?
          </button>
        </div>
        <button type="submit" disabled={loading} className={btnClass}>
          {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight size={17} /></>}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-5">
        Do not have an account?{" "}
        <Link to="/register" className="text-red-600 font-semibold hover:underline">Create one</Link>
      </p>
    </Card>
  );

  if (view === "forgot-email") return (
    <Card title="Forgot Password" subtitle="We will send a reset OTP to your email" error={error}>
      <form onSubmit={handleForgotSend} className="space-y-4">
        <Field label="Registered Email" icon={Mail} type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
        <button type="submit" disabled={loading} className={btnClass}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
      <button onClick={() => go("login")} className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 text-center">Back to Login</button>
    </Card>
  );

  if (view === "forgot-otp") return (
    <Card title="Enter OTP" subtitle={"A 6-digit code was sent to " + forgotEmail} error={error}>
      <form onSubmit={handleForgotVerify} className="space-y-6">
        <OTPInput value={resetOtp} onChange={setResetOtp} />
        <button type="submit" className={btnClass}>Verify OTP</button>
      </form>
      <button onClick={() => go("forgot-email")} className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 text-center">Resend OTP</button>
    </Card>
  );

  if (view === "reset") return (
    <Card title="Set New Password" subtitle="Choose a strong password for your account" error={error}>
      <form onSubmit={handleReset} className="space-y-4">
        <Field label="New Password" icon={Lock} type="password" placeholder="Min. 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <Field label="Confirm Password" icon={Lock} type="password" placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit" disabled={loading} className={btnClass}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </Card>
  );

  return null;
}
