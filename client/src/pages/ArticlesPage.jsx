import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import AIChatbot from '../components/common/AIChatbot';
import { FiClock, FiTag } from 'react-icons/fi';
import './ArticlesPage.css';

const API = import.meta.env.VITE_API_URL || '/api';

const CATEGORIES = [
  { value: 'all', label: 'All Articles', icon: '📚' },
  { value: 'blood-health', label: 'Blood Health', icon: '🩸' },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { value: 'donation-tips', label: 'Donation Tips', icon: '💉' },
  { value: 'lifestyle', label: 'Lifestyle', icon: '🧘' },
  { value: 'awareness', label: 'Awareness', icon: '📢' },
];

const TIPS = [
  { icon: '💧', tip: 'Drink 2-3 extra glasses of water before donating' },
  { icon: '🍎', tip: 'Eat iron-rich foods like spinach, lentils, and red meat' },
  { icon: '😴', tip: 'Get at least 7-8 hours of sleep the night before donation' },
  { icon: '🚭', tip: 'Avoid smoking and alcohol 24 hours before donation' },
  { icon: '👕', tip: 'Wear comfortable clothing with sleeves that roll up easily' },
  { icon: '⏰', tip: 'Plan to spend 45-60 minutes at the donation center' },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArticles();
  }, [category, page]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page });
      if (category !== 'all') params.append('category', category);
      const { data } = await axios.get(`${API}/articles?${params}`);
      setArticles(data.articles);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'blood-health': '#e63946',
      'nutrition': '#2a9d8f',
      'donation-tips': '#f4a261',
      'lifestyle': '#8a6bff',
      'awareness': '#06b6d4',
    };
    return colors[cat] || '#e63946';
  };

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        {/* Hero */}
        <div className="articles-hero">
          <div className="articles-hero-content">
            <div className="section-tag">HEALTH KNOWLEDGE</div>
            <h1>Blood Health &<br /><span>Lifestyle Articles</span></h1>
            <p>Expert-curated articles on blood donation, nutrition, and healthy living.</p>
          </div>
          <div className="articles-hero-visual">
            {['🩸', '🧬', '💊', '🏃', '🥗', '❤️'].map((emoji, i) => (
              <div key={i} className="article-emoji-float" style={{ animationDelay: `${i * 0.3}s` }}>
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Healthy Tips Strip */}
        <div className="tips-strip">
          <div className="tips-label">💡 Quick Tips</div>
          <div className="tips-scroll">
            {TIPS.map((t, i) => (
              <div key={i} className="tip-item">
                <span>{t.icon}</span>
                <span>{t.tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`cat-tab ${category === cat.value ? 'active' : ''}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="articles-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="article-skeleton" />
            ))}
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article, i) => (
              <Link
                key={article._id}
                to={`/articles/${article._id}`}
                className="article-card animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {article.image && (
                  <div className="article-img-wrap">
                    <img src={article.image} alt={article.title} className="article-img" />
                    <div className="article-category-badge"
                      style={{ background: getCategoryColor(article.category) }}>
                      {CATEGORIES.find(c => c.value === article.category)?.icon}
                      {CATEGORIES.find(c => c.value === article.category)?.label}
                    </div>
                  </div>
                )}
                <div className="article-body">
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="article-meta">
                    <span className="article-meta-item">
                      <FiClock size={12} /> {article.readTime} min read
                    </span>
                    {article.tags?.length > 0 && (
                      <span className="article-meta-item">
                        <FiTag size={12} /> {article.tags.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-outline btn-sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >← Prev</button>
            <span style={{ color: 'var(--text2)', fontSize: 14 }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >Next →</button>
          </div>
        )}
      </div>
      <AIChatbot />
    </div>
  );
}
