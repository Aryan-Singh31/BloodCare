import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import AIChatbot from '../components/common/AIChatbot';
import { FiArrowLeft, FiClock, FiTag } from 'react-icons/fi';
import './ArticleDetail.css';

const API = import.meta.env.VITE_API_URL || '/api';

function parseContent(content) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <h3 key={i} style={{ fontSize: 20, margin: '24px 0 10px', fontFamily: "'Playfair Display', serif" }}>{line.slice(2, -2)}</h3>;
    }
    if (line.startsWith('- ')) {
      return <li key={i} style={{ color: 'var(--text2)', marginBottom: 6, marginLeft: 20 }}>{line.slice(2)}</li>;
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 12 }}>{line}</p>;
  });
}

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data } = await axios.get(`${API}/articles/${id}`);
      setArticle(data);
    } catch {
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const CATEGORY_COLORS = {
    'blood-health': '#e63946',
    'nutrition': '#2a9d8f',
    'donation-tips': '#f4a261',
    'lifestyle': '#8a6bff',
    'awareness': '#06b6d4',
  };

  if (loading) return (
    <div className="page">
      <Navbar />
      <div className="loader-fullscreen"><div className="pulse-loader" /></div>
    </div>
  );

  if (!article) return null;

  return (
    <div className="page">
      <Navbar />
      <div className="article-detail-page">
        {/* Back button */}
        <div className="article-back">
          <Link to="/articles" className="btn btn-ghost btn-sm">
            <FiArrowLeft /> Back to Articles
          </Link>
        </div>

        {/* Hero image */}
        {article.image && (
          <div className="article-detail-img-wrap">
            <img src={article.image} alt={article.title} className="article-detail-img" />
            <div className="article-detail-overlay" />
            <div className="article-detail-category"
              style={{ background: CATEGORY_COLORS[article.category] || 'var(--red)' }}>
              {article.category?.replace('-', ' ')}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="article-detail-content">
          <h1 className="article-detail-title">{article.title}</h1>

          <div className="article-detail-meta">
            <span className="article-meta-item">
              <FiClock size={14} /> {article.readTime} min read
            </span>
            {article.tags?.map(tag => (
              <span key={tag} className="article-tag">
                <FiTag size={12} /> {tag}
              </span>
            ))}
          </div>

          <p className="article-detail-excerpt">{article.excerpt}</p>

          <div className="article-divider" />

          <div className="article-detail-body">
            {parseContent(article.content)}
          </div>

          {/* CTA */}
          <div className="article-cta">
            <div style={{ fontSize: 40, marginBottom: 12 }}>🩸</div>
            <h3>Ready to Make a Difference?</h3>
            <p style={{ color: 'var(--text2)', marginTop: 8, marginBottom: 20 }}>
              Register as a blood donor and help save lives in your community.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/become-donor" className="btn btn-primary">Become a Donor</Link>
              <Link to="/articles" className="btn btn-outline">More Articles</Link>
            </div>
          </div>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
