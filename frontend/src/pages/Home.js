import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../LanguageContext';
import './Home.css';

function Home() {
  const { t } = useLanguage();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    categories: 0
  });

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      const items = response.data;
      
      // Ia ultimele 3 articole pentru featured section
      const featured = items
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      
      setFeaturedItems(featured);
      
      // Calculate stats
      const uniqueCategories = [...new Set(items.map(item => item.category))];
      setStats({
        totalItems: items.length,
        categories: uniqueCategories.length
      });
    } catch (error) {
      console.error('Error fetching featured items:', error);
    }
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <span className="hero-badge">
            ✨ {t('handmadeWithLove') || 'Handmade with Love'}
          </span>
          
          <h1 className="hero-title">
            {t('heroTitle') || 'Unique Hand-Painted Art'}
          </h1>
          
          <p className="hero-subtitle">
            {t('heroSubtitle') || 'Transform your style with custom artwork'}
          </p>
          
          <p className="hero-description">
            {t('heroDescription') || 'Each piece is carefully crafted by hand, making it truly one-of-a-kind'}
          </p>
          
          <div className="hero-buttons">
            <Link to="/gallery" className="btn btn-primary btn-lg">
              {t('browseGallery') || 'Browse Gallery'} →
            </Link>
            <a 
              href="#about" 
              className="btn btn-outline btn-lg"
              onClick={(e) => scrollToSection(e, 'about')}
            >
              {t('learnMore') || 'Learn More'}
            </a>
          </div>

          {/* Stats */}
          {stats.totalItems > 0 && (
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.totalItems}+</span>
                <span className="stat-label">
                  {t('artworks') || 'Artworks'}
                </span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{stats.categories}</span>
                <span className="stat-label">
                  {t('categories') || 'Categories'}
                </span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">
                  {t('handmade') || 'Handmade'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <a 
          href="#about" 
          className="scroll-indicator"
          onClick={(e) => scrollToSection(e, 'about')}
          aria-label="Scroll down"
        >
          <span></span>
        </a>
      </section>

      {/* About / Features Section */}
      <section className="features-section" id="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {t('whatIOffer') || 'What I Offer'}
            </h2>
            <p className="section-subtitle">
              {t('discoverUnique') || 'Discover unique pieces made just for you'}
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">👕</div>
              </div>
              <h3>{t('customClothing') || 'Custom Clothing'}</h3>
              <p>
                {t('customClothingDesc') || 
                'Hand-painted designs on t-shirts, hoodies, and more. Each piece is unique and made to order.'}
              </p>
            </div>

            <div className="feature-card featured">
              <div className="feature-badge">{t('popular') || 'Popular'}</div>
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎨</div>
              </div>
              <h3>{t('originalArt') || 'Original Art'}</h3>
              <p>
                {t('originalArtDesc') || 
                'Beautiful paintings on canvas. Perfect for your home or as a special gift.'}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">✨</div>
              </div>
              <h3>{t('madeToOrder') || 'Made to Order'}</h3>
              <p>
                {t('madeToOrderDesc') || 
                'Custom commissions available. Bring your vision to life with personalized artwork.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      {featuredItems.length > 0 && (
        <section className="featured-items-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {t('latestWork') || 'Latest Work'}
              </h2>
              <p className="section-subtitle">
                {t('checkOutNewest') || 'Check out my newest creations'}
              </p>
            </div>

            <div className="featured-grid">
              {featuredItems.map((item, index) => (
                <Link 
                  to={`/item/${item.id}`} 
                  key={item.id} 
                  className="featured-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="featured-image-wrapper">
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="featured-image"
                      loading="lazy"
                    />
                    <div className="featured-overlay">
                      <span className="featured-view">
                        {t('viewItem') || 'View Item'} →
                      </span>
                    </div>
                  </div>
                  <div className="featured-info">
                    <h3>{item.title}</h3>
                    <p className="featured-category">
                      {t(`categories.${item.category}`) || item.category}
                    </p>
                    <p className="featured-price">${item.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="featured-cta">
              <Link to="/gallery" className="btn btn-primary">
                {t('viewAllItems') || 'View All Items'} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Process Section (Optional - how it works) */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {t('howItWorks') || 'How It Works'}
            </h2>
            <p className="section-subtitle">
              {t('simpleProcess') || 'Simple steps to get your custom piece'}
            </p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>{t('browseSelect') || 'Browse & Select'}</h3>
              <p>
                {t('browseSelectDesc') || 
                'Explore the gallery and find a piece you love'}
              </p>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-step">
              <div className="step-number">2</div>
              <h3>{t('contactMe') || 'Contact Me'}</h3>
              <p>
                {t('contactMeDesc') || 
                'Get in touch to discuss customization and details'}
              </p>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-step">
              <div className="step-number">3</div>
              <h3>{t('receiveArt') || 'Receive Your Art'}</h3>
              <p>
                {t('receiveArtDesc') || 
                'Your custom piece is created and delivered to you'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>{t('ctaTitle') || 'Ready to Get Started?'}</h2>
              <p>
                {t('ctaDescription') || 
                'Browse the gallery and find your perfect piece of art today'}
              </p>
              <Link to="/gallery" className="btn btn-primary btn-lg">
                {t('viewGallery') || 'View Gallery'} →
              </Link>
            </div>
            <div className="cta-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-circle"></div>
              <div className="decoration-circle"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;