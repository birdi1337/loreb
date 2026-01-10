import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './Home.css';

function Home() {
  const { t } = useLanguage();

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{t('heroTitle')}</h1>
          <p className="hero-subtitle">
            {t('heroSubtitle')}
          </p>
          <p className="hero-description">
            {t('heroDescription')}
          </p>
          <div className="hero-buttons">
            <Link to="/gallery" className="btn btn-primary">
              {t('browseGallery')}
            </Link>
            <a href="#about" className="btn btn-secondary">
              {t('learnMore')}
            </a>
          </div>
        </div>
      </div>

      <div className="features-section" id="about">
        <div className="container">
          <h2 className="section-title">{t('whatIOffer')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👕</div>
              <h3>{t('customClothing')}</h3>
              <p>{t('customClothingDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>{t('originalArt')}</h3>
              <p>{t('originalArtDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>{t('madeToOrder')}</h3>
              <p>{t('madeToOrderDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>{t('ctaTitle')}</h2>
            <p>{t('ctaDescription')}</p>
            <Link to="/gallery" className="btn btn-primary">
              {t('viewGallery')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
