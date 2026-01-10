import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './Header.css';

function Header() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">{t('brandName')}</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">{t('home')}</Link>
          <Link to="/gallery" className="nav-link">{t('gallery')}</Link>
          <button onClick={toggleLanguage} className="nav-link language-toggle">
            {language === 'ro' ? '🇬🇧 EN' : '🇷🇴 RO'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
