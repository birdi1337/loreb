import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './Header.css';

function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detectează scroll pentru a schimba stilul header-ului
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Închide meniul mobil când se schimbă ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Verifică dacă o rută este activă
  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" aria-label={t('brandName')}>
          <span className="logo-icon">🎨</span>
          <span className="logo-text">{t('brandName')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            {t('home')}
          </Link>
          <Link 
            to="/gallery" 
            className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
          >
            {t('gallery')}
          </Link>
          <button 
            onClick={toggleLanguage} 
            className="nav-link language-toggle"
            aria-label={language === 'ro' ? 'Switch to English' : 'Schimbă în Română'}
          >
            {language === 'ro' ? '🇬🇧 EN' : '🇷🇴 RO'}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Mobile Navigation */}
        <nav className={`nav mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            {t('home')}
          </Link>
          <Link 
            to="/gallery" 
            className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
          >
            <span className="nav-icon">🖼️</span>
            {t('gallery')}
          </Link>
          <button 
            onClick={toggleLanguage} 
            className="nav-link language-toggle"
          >
            <span className="nav-icon">
              {language === 'ro' ? '🇬🇧' : '🇷🇴'}
            </span>
            {language === 'ro' ? 'English' : 'Română'}
          </button>
        </nav>

        {/* Overlay pentru mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-overlay" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
}

export default Header;