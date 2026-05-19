import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const BLOOD_GROUPS = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'];

const STATS = [
  { value: '4.7Cr+', label: 'Blood Units Needed Yearly in India' },
  { value: '38%', label: 'People Eligible But Only 10% Donate' },
  { value: '3 Lives', label: 'Saved Per Single Donation' },
  { value: '56 Days', label: 'Safe Interval Between Donations' },
];

const FEATURES = [
  {
    icon: '🩸',
    title: 'Smart Donor Registry',
    desc: 'Register as a donor with your blood group, location, and availability. Update anytime.',
  },
  {
    icon: '🔍',
    title: 'Instant Donor Search',
    desc: 'Find donors by city and blood group within seconds. Real profiles, real people.',
  },
  {
    icon: '🚨',
    title: 'Urgent Blood Alerts',
    desc: 'Post critical blood requirements. City-wide notifications reach every user instantly.',
  },
  {
    icon: '💬',
    title: 'Real-Time Chat',
    desc: 'Connect directly with donors or recipients via live messaging. No delays.',
  },
  {
    icon: '🤖',
    title: 'AI Health Assistant',
    desc: 'Gemini-powered chatbot answers your questions about blood health and donation 24/7.',
  },
  {
    icon: '📖',
    title: 'Health Articles',
    desc: 'Expert-curated articles on blood health, nutrition, lifestyle, and donation tips.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    city: 'Mumbai',
    text: 'Found a B+ donor within 20 minutes during an emergency. BloodCare literally saved my father\'s life.',
    blood: 'B+',
  },
  {
    name: 'Arjun Mehta',
    city: 'Delhi',
    text: 'As a regular donor, this platform makes it so easy to help people. The chat feature is fantastic.',
    blood: 'O-',
  },
  {
    name: 'Sunita Patel',
    city: 'Ahmedabad',
    text: 'The AI chatbot helped me understand my eligibility before registering. Incredibly helpful!',
    blood: 'AB+',
  },
];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleStats, setVisibleStats] = useState(false);
  const statsRef = useRef();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleStats(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">💉 Blood<span>Care</span></div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#stats">Impact</a>
            <a href="#testimonials">Stories</a>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        {/* Animated background blobs */}
        <div className="hero-blobs">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        {/* Floating blood group pills */}
        <div className="floating-pills">
          {BLOOD_GROUPS.map((bg, i) => (
            <div
              key={bg}
              className="blood-pill"
              style={{ animationDelay: `${i * 0.4}s`, '--i': i }}
            >
              {bg}
            </div>
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-badge animate-fade-up">
            <span className="badge-dot" />
            AI-Powered Blood Donation Network
          </div>

          <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Every Drop<br />
            <span className="hero-title-accent">Saves A Life</span>
          </h1>

          <p className="hero-desc animate-fade-up" style={{ animationDelay: '0.2s' }}>
            BloodCare connects donors and recipients instantly — powered by AI, driven by compassion.
            Find donors, post urgent needs, and join India's largest blood community.
          </p>

          <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              🩸 Join BloodCare
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Explore Platform →
            </Link>
          </div>

          <div className="hero-trust animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="trust-avatars">
              {['S', 'R', 'A', 'M', 'P'].map((l, i) => (
                <div key={i} className="trust-avatar" style={{ background: `hsl(${i * 40 + 350},80%,50%)` }}>{l}</div>
              ))}
            </div>
            <span>Join <strong>50,000+</strong> donors & recipients</span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="hero-visual animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="hero-card-main animate-float">
            <div className="hcard-header">
              <div className="hcard-avatar">AR</div>
              <div>
                <div className="hcard-name">Arjun Rawat</div>
                <div className="hcard-city">📍 Prayagraj, UP</div>
              </div>
              <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Available</span>
            </div>
            <div className="hcard-blood">
              <div className="blood-big">O<sup>+</sup></div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>Universal Donor</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>12 donations</div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
              💬 Send Message
            </button>
          </div>

          <div className="hero-card-alert">
            <div style={{ fontSize: 20 }}>🚨</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Urgent: AB- Needed</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>SRN Hospital, Prayagraj</div>
            </div>
          </div>

          <div className="hero-card-stat">
            <div className="stat-number">23</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>Donors in your city</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" ref={statsRef} id="stats">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className={`stat-card ${visibleStats ? 'visible' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">PLATFORM FEATURES</div>
            <h2 className="section-title">Everything You Need to<br /><span>Save Lives</span></h2>
            <p className="section-desc">A complete ecosystem for blood donation — from finding donors to health guidance.</p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">HOW IT WORKS</div>
            <h2 className="section-title">Simple Steps,<br /><span>Life-Saving Impact</span></h2>
          </div>
          <div className="steps">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up with email or Google. Verify via OTP.', icon: '✉️' },
              { step: '02', title: 'Register as Donor', desc: 'Fill in your blood group, city, and availability.', icon: '🩸' },
              { step: '03', title: 'Get Discovered', desc: 'Appear in searches when someone needs your blood type.', icon: '🔍' },
              { step: '04', title: 'Connect & Help', desc: 'Chat directly and arrange donation. Be a hero.', icon: '❤️' },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < 3 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">REAL STORIES</div>
            <h2 className="section-title">Lives <span>Changed</span></h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="t-quote">"</div>
                <p className="t-text">{t.text}</p>
                <div className="t-author">
                  <div className="t-avatar">{t.name[0]}</div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-city">{t.city}</div>
                  </div>
                  <span className="badge badge-red" style={{ marginLeft: 'auto' }}>{t.blood}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-blob" />
        <div className="container cta-inner">
          <h2 className="cta-title">Ready to Save a Life?</h2>
          <p className="cta-desc">Join thousands of donors and recipients on BloodCare today. It takes just 2 minutes to register.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            🩸 Start Saving Lives Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container footer-inner">
          <div className="footer-logo">💉 BloodCare</div>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>
            AI Integrated Donor & Receiver Platform · Making blood donation accessible for all.
          </p>
          <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 8 }}>
            © 2024 BloodCare. Built with ❤️ to save lives.
          </p>
        </div>
      </footer>
    </div>
  );
}
