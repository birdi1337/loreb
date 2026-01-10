import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to My Artistic World</h1>
          <p className="hero-subtitle">
            Discover unique hand-painted clothing and original artwork
          </p>
          <p className="hero-description">
            Each piece is crafted with passion and creativity, transforming everyday items 
            into wearable art and bringing color to your life.
          </p>
          <div className="hero-buttons">
            <Link to="/gallery" className="btn btn-primary">
              Browse Gallery
            </Link>
            <a href="#about" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="features-section" id="about">
        <div className="container">
          <h2 className="section-title">What I Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👕</div>
              <h3>Custom Painted Clothing</h3>
              <p>Unique designs hand-painted on t-shirts, hoodies, jackets, and more. Each piece is one-of-a-kind.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Original Artwork</h3>
              <p>Canvas paintings, drawings, and mixed media art pieces created with love and attention to detail.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Made to Order</h3>
              <p>Contact me to discuss custom designs tailored to your preferences and style.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Own a Unique Piece?</h2>
            <p>Browse the gallery and get in touch to discuss your purchase or custom order.</p>
            <Link to="/gallery" className="btn btn-primary">
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
