import { Link } from "react-router-dom";
import { HeartPulse, Search, MessageCircle, Users, Droplets, ShieldCheck } from "lucide-react";
import HeroImg from "../assets/images/hero.jpg";
import Step1 from "../assets/images/step1.jpg";
import Step2 from "../assets/images/step2.jpg";
import Step3 from "../assets/images/step3.jpg";
import Avatar1 from "../assets/images/avatar1.jpg";
import Avatar2 from "../assets/images/avatar2.jpg";
import Avatar3 from "../assets/images/avatar3.jpg";

const stats = [
  { icon: Users, value: "10,000+", label: "Registered Donors" },
  { icon: Droplets, value: "5,000+", label: "Lives Saved" },
  { icon: ShieldCheck, value: "100%", label: "Verified Donors" },
];

const steps = [
  { img: Step1, icon: "01", title: "Register as Donor", desc: "Add your blood group, city, and contact info to join our network." },
  { img: Step2, icon: "02", title: "Search Nearby Donors", desc: "Patients find matching donors instantly by blood group and location." },
  { img: Step3, icon: "03", title: "Chat & Donate Safely", desc: "Coordinate the donation securely through our real-time chat." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-rose-50">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-rose-100 rounded-full opacity-40 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div data-aos="fade-right">
            <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <HeartPulse size={12} className="text-red-600" /> Donate Blood, Save Lives
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Connecting <span className="text-red-600">Donors</span> &{" "}
              <span className="text-red-600">Patients</span> in Seconds
            </h1>
            <p className="mt-4 text-gray-500 text-base leading-relaxed max-w-md">
              A community-driven platform where verified blood donors and patients find each other instantly. Fast, reliable, and life-saving.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-semibold text-sm shadow-lg hover:bg-red-700 transition">
                <Search size={16} /> Find a Donor
              </Link>
              <Link to="/donate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-red-600 text-red-600 font-semibold text-sm hover:bg-red-50 transition">
                <HeartPulse size={16} /> Become a Donor
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[Avatar1, Avatar2, Avatar3].map((a, i) => (
                  <img key={i} loading="lazy" src={a} className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">Thousands</span> of lives impacted
              </p>
            </div>
          </div>

          {/* Right — hero card */}
          <div className="flex justify-center" data-aos="fade-left">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-red-100 group">
                <img loading="lazy" src={HeroImg} alt="Blood Donation" className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs uppercase tracking-widest text-red-300 mb-1">Real-time help</p>
                  <h2 className="text-lg font-bold">A single donation can save up to three lives.</h2>
                </div>
              </div>
              {/* floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 border border-red-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-gray-700">Donors Online Now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="bg-red-600 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center text-white">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} data-aos="zoom-in" data-aos-delay={i * 100}>
              <Icon size={28} className="mx-auto mb-2 opacity-80" />
              <p className="text-2xl md:text-3xl font-extrabold">{value}</p>
              <p className="text-xs md:text-sm opacity-80 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="text-xs font-semibold text-red-600 uppercase tracking-widest">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
            How <span className="text-red-600">BloodCare</span> Works
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">Three simple steps to connect donors with those in need.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 120}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <div className="relative overflow-hidden h-44">
                <img loading="lazy" src={s.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{s.icon}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gray-900 px-8 py-14 text-center shadow-2xl">
            {/* subtle background blobs */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-red-600 opacity-20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-rose-500 opacity-20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-red-500/30">
                <HeartPulse size={11} className="text-red-400" /> Join the Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                Ready to Save a Life?
              </h2>
              <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto leading-relaxed">
                Register as a donor today and be someone's hero when they need it most. Every drop counts.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/register"
                  className="px-7 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition shadow-lg text-sm">
                  Register as Donor
                </Link>
                <Link to="/search"
                  className="px-7 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition border border-white/20 text-sm">
                  Find Donors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
