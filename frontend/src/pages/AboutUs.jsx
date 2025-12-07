// src/pages/About.jsx
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-linear-to-b from-red-50 via-white to-red-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center" data-aos="fade-down">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          About <span className="text-red-600">BloodCare</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          We are on a mission to make blood donation faster, safer, and more accessible for everyone in need.
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 mb-20">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 hover:shadow-2xl transition" data-aos="fade-right">
          <h2 className="text-2xl font-bold text-red-600 mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            To ensure no life is lost due to the unavailability of blood. We connect people who need blood with donors who are
            ready to contribute — instantly, responsibly, and effectively.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 hover:shadow-2xl transition" data-aos="fade-left">
          <h2 className="text-2xl font-bold text-red-600 mb-3">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            To build a global network of selfless donors and provide lifesaving support using technology that bridges the gap
            between donors and patients.
          </p>
        </div>
      </section>

      {/* WHY BLOODCARE */}
      <section className="bg-white border-t border-red-100 py-16" data-aos="zoom-in">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
          Why Choose <span className="text-red-600">BloodCare?</span>
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {/* Point 1 */}
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 hover:shadow-lg transition text-center">
            <h3 className="text-lg font-semibold text-red-600">Verified Donors</h3>
            <p className="text-gray-600 text-sm mt-2">
              Every donor is authenticated for safety and reliability.
            </p>
          </div>

          {/* Point 2 */}
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 hover:shadow-lg transition text-center">
            <h3 className="text-lg font-semibold text-red-600">Instant Matching</h3>
            <p className="text-gray-600 text-sm mt-2">
              Real-time results based on donor availability nearby.
            </p>
          </div>

          {/* Point 3 */}
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 hover:shadow-lg transition text-center">
            <h3 className="text-lg font-semibold text-red-600">Secure Chat</h3>
            <p className="text-gray-600 text-sm mt-2">
              Built-in chat for seamless coordination between donors and patients.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
          Meet Our Team
        </h2>

        <p className="max-w-3xl mx-auto text-center text-gray-600 mb-8">
          We are a passionate group of problem solvers who believe in the power of compassion and technology.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Member 1 */}
          <div data-aos="fade-up" className="bg-white p-6 text-center rounded-xl shadow-md border hover:shadow-xl transition">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-200 mb-4" />
            <h3 className="font-semibold text-gray-900">Aryan Singh</h3>
            <p className="text-sm text-gray-500">Founder / Developer</p>
          </div>

          {/* Member 2 */}
          <div data-aos="fade-up" data-aos-delay="100" className="bg-white p-6 text-center rounded-xl shadow-md border hover:shadow-xl transition">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-200 mb-4" />
            <h3 className="font-semibold text-gray-900">Core Team Member</h3>
            <p className="text-sm text-gray-500">Backend & Database</p>
          </div>

          {/* Member 3 */}
          <div data-aos="fade-up" data-aos-delay="200" className="bg-white p-6 text-center rounded-xl shadow-md border hover:shadow-xl transition">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-200 mb-4" />
            <h3 className="font-semibold text-gray-900">Volunteer Lead</h3>
            <p className="text-sm text-gray-500">Community Support</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <div className="text-center pb-20" data-aos="fade-up">
        <Link
          to="/register"
          className="px-8 py-4 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-lg"
        >
          Join Us & Save Lives
        </Link>
      </div>
    </div>
  );
}
