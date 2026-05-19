import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import AIChatbot from '../components/common/AIChatbot';
import { FiSearch, FiMapPin, FiPhone, FiMessageCircle, FiDroplet } from 'react-icons/fi';
import './SearchDonor.css';

const API = import.meta.env.VITE_API_URL || '/api';
const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SearchDonor() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [total, setTotal] = useState(0);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (bloodGroup && bloodGroup !== 'All') params.append('bloodGroup', bloodGroup);

      const { data } = await axios.get(`${API}/donors/search?${params}`);
      setDonors(data.donors);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (donorUserId) => {
    navigate(`/chat/${donorUserId}`);
  };

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        {/* Header */}
        <div className="search-header">
          <h1>Find a <span>Blood Donor</span></h1>
          <p>Search by city and blood group to find available donors near you</p>
        </div>

        {/* Search Form */}
        <div className="search-box card">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-field">
              <FiMapPin color="var(--red)" />
              <input
                type="text" value={city} onChange={e => setCity(e.target.value)}
                placeholder="Enter city (e.g., Prayagraj, Delhi)"
                className="search-input"
              />
            </div>

            <div className="blood-group-filter">
              {BLOOD_GROUPS.map(bg => (
                <button
                  key={bg} type="button"
                  onClick={() => setBloodGroup(bg === 'All' ? '' : bg)}
                  className={`bg-filter-btn ${(bg === 'All' && !bloodGroup) || bloodGroup === bg ? 'active' : ''}`}
                >{bg}</button>
              ))}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSearch /> {loading ? 'Searching...' : 'Search Donors'}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="search-results">
            <div className="results-header">
              {loading ? (
                <span style={{ color: 'var(--text2)' }}>Searching...</span>
              ) : (
                <span>
                  Found <strong style={{ color: 'var(--red)' }}>{total}</strong> donor{total !== 1 ? 's' : ''}
                  {city && ` in ${city}`}
                  {bloodGroup && ` with ${bloodGroup}`}
                </span>
              )}
            </div>

            {loading ? (
              <div className="donors-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card" style={{ height: 240 }} />
                ))}
              </div>
            ) : donors.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 48 }}>🔍</div>
                <h3 style={{ marginTop: 12 }}>No donors found</h3>
                <p style={{ color: 'var(--text2)', marginTop: 8 }}>
                  Try a different city or blood group. You can also post an urgent request.
                </p>
                <Link to="/urgent" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>
                  Post Urgent Request
                </Link>
              </div>
            ) : (
              <div className="donors-grid">
                {donors.map((donor, i) => (
                  <div key={donor._id} className="donor-card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="donor-card-top">
                      <div className="donor-avatar">
                        {donor.user?.avatar
                          ? <img src={donor.user.avatar} alt={donor.user.name} />
                          : <span>{donor.user?.name?.[0]?.toUpperCase()}</span>}
                      </div>
                      <div className="donor-blood">{donor.bloodGroup}</div>
                    </div>

                    <div className="donor-name">{donor.user?.name}</div>

                    <div className="donor-info">
                      <div className="donor-info-row">
                        <FiMapPin size={13} />
                        {donor.city}, {donor.state}
                      </div>
                      <div className="donor-info-row">
                        <FiDroplet size={13} />
                        {donor.totalDonations > 0 ? `${donor.totalDonations} donations` : 'New donor'}
                      </div>
                      {donor.age && (
                        <div className="donor-info-row">
                          👤 {donor.age} years
                        </div>
                      )}
                    </div>

                    <div className="donor-availability">
                      <span className={`badge ${donor.isAvailable ? 'badge-green' : 'badge-gray'}`}>
                        {donor.isAvailable ? '✓ Available' : '✗ Unavailable'}
                      </span>
                    </div>

                    {donor.isAvailable && (
                      <div className="donor-actions">
                        <a href={`tel:${donor.phone}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                          <FiPhone size={13} /> Call
                        </a>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => handleChat(donor.user?._id)}
                        >
                          <FiMessageCircle size={13} /> Chat
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text2)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16 }}>Enter a city and/or blood group to find donors near you</p>
          </div>
        )}
      </div>
      <AIChatbot />
    </div>
  );
}
