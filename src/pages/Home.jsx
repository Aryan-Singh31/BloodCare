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
    <div className="min-h-screen bg-linear-to-b from-red-50 via-white to-red-50">
      
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT SIDE */}
        <div data-aos="fade-right">
          <p className="text-sm font-semibold tracking-wide text-red-500 uppercase mb-2">
            Donate Blood, Save Lives
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Connecting <span className="text-red-600">Donors</span> and{" "}
            <span className="text-red-600">Patients</span> in Seconds.
          </h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
            Join our community-driven platform where verified blood donors and
            patients can find each other instantly. Fast, reliable, and
            life-saving connections, right when needed the most.
          </p>

          {/* CTA Buttons */}
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

          {/* Avatars + Social Proof */}
          <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-white" style={{ backgroundImage: `url(${Avatar1})` }}></div>
              <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-white" style={{ backgroundImage: `url(${Avatar2})` }}></div>
              <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-white" style={{ backgroundImage: `url(${Avatar3})` }}></div>
            </div>
            <p>
              <span className="font-semibold text-gray-700">Thousands</span>{" "} of
              lives impacted by donors like you.
            </p>
          </div>

        </div>

        {/* RIGHT SIDE Hero Card */}
        <div className="flex justify-center" data-aos="fade-left">
          <div className="relative group [perspective-1200px]">
            
            <div className="absolute inset-0 blur-3xl bg-red-300/40 rounded-3xl -z-10 transition group-hover:blur-2xl" />

            <div className="relative w-full max-w-md h-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-red-100
                           transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1">

              {/* Image Loads Perfectly */}
              <img src={HeroImg} alt="Hero Blood Donation" className="w-full h-full object-cover" />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-red-200">
                  Real-time help
                </p>
                <h2 className="text-xl font-bold mt-1">
                  A single donation can save up to three lives.
                </h2>
                <p className="text-xs mt-2 text-gray-100">
                  Our platform connects nearby donors and patients with instant chat and location-based matching.
                </p>
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

          {/* CARD 1 → LOCAL */}
          <div data-aos="fade-up" className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition">
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${Step1})` }} />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">1. Register as Donor</h3>
              <p className="text-sm text-gray-600">Add your blood group & location details.</p>
            </div>
          </div>

          {/* CARD 2 → LOCAL */}
          <div data-aos="fade-up" data-aos-delay="150" className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition">
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${Step2})` }} />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">2. Search Nearby Donors</h3>
              <p className="text-sm text-gray-600">Patients find matching donors instantly.</p>
            </div>
          </div>

          {/* CARD 3 → LOCAL */}
          <div data-aos="fade-up" data-aos-delay="300" className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition">
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${Step3})` }} />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">3. Chat & Donate Safely</h3>
              <p className="text-sm text-gray-600">Coordinate securely through built-in chat.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
