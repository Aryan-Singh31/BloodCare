import { Link } from "react-router-dom";

// Import Local Images
import HeroImg from "../assets/images/hero.jpg";
import Step1 from "../assets/images/step1.jpg";
import Step2 from "../assets/images/step2.jpg";
import Step3 from "../assets/images/step3.jpg";
import Avatar1 from "../assets/images/avatar1.jpg";
import Avatar2 from "../assets/images/avatar2.jpg";
import Avatar3 from "../assets/images/avatar3.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50">

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT */}
        <div data-aos="fade-right">
          <p className="text-sm font-semibold tracking-wide text-red-500 uppercase mb-2">
            Donate Blood, Save Lives
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Connecting <span className="text-red-600">Donors</span> and{" "}
            <span className="text-red-600">Patients</span> in Seconds.
          </h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
            Join our community-driven platform where verified blood donors and patients
            can find each other instantly. Fast, reliable, and life-saving.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/search"
              className="px-6 py-3 rounded-full bg-red-600 text-white font-semibold text-sm shadow-lg hover:bg-red-700 transition"
            >
              Find Donor Near You
            </Link>
            <Link
              to="/donate"
              className="px-6 py-3 rounded-full border border-red-600 text-red-600 font-semibold text-sm hover:bg-red-50 transition"
            >
              Become a Donor
            </Link>
          </div>

          {/* SOCIAL PROOF */}
          <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex -space-x-2">
              <img loading="lazy" src={Avatar1} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <img loading="lazy" src={Avatar2} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <img loading="lazy" src={Avatar3} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
            </div>
            <p>
              <span className="font-semibold text-gray-700">Thousands</span> of lives impacted.
            </p>
          </div>
        </div>

        {/* RIGHT — HERO IMAGE 3D CARD */}
        <div className="flex justify-center" data-aos="fade-left">
          <div className="relative group md:[perspective:1200px]">

            {/* Card */}
            <div
              className="relative w-full max-w-md h-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-red-100
              transition-transform duration-500 md:group-hover:-translate-y-2 md:group-hover:rotate-1"
            >
              <img loading="lazy" src={HeroImg} alt="Blood Donation" className="w-full h-full object-cover" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-red-200">
                  Real-time help
                </p>
                <h2 className="text-lg sm:text-xl font-bold">
                  A single donation can save up to three lives.
                </h2>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 data-aos="zoom-in" className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          How <span className="text-red-600">BloodCare</span> Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[{img: Step1, title:"1. Register as Donor", desc:"Add your blood group & location."},
            {img: Step2, title:"2. Search Nearby Donors", desc:"Patients find matching donors instantly."},
            {img: Step3, title:"3. Chat & Donate Safely", desc:"Coordinate donation securely."}]
            .map((card, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 150} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition">
                <img loading="lazy" src={card.img} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.desc}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

    </div>
  );
}
