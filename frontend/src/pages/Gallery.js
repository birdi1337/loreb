import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../LanguageContext';
import './Gallery.css';

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price-low, price-high
  const { t } = useLanguage();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(t('errorLoadingGallery') || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  // Generează categorii unice folosind useMemo pentru optimizare
  const categories = useMemo(() => {
    return ['all', ...new Set(items.map(item => item.category))];
  }, [items]);

  // Filtrare și sortare optimizată
  const processedItems = useMemo(() => {
    // Filtrare
    let filtered = filter === 'all' 
      ? items 
      : items.filter(item => item.category === filter);

    // Sortare
    switch (sortBy) {
      case 'oldest':
        filtered = [...filtered].sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        filtered = [...filtered].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
    }

    return filtered;
  }, [items, filter, sortBy]);

  const handleFilterChange = (category) => {
    setFilter(category);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>{t('loadingGallery') || 'Loading gallery...'}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="gallery">
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchItems} className="btn btn-primary">
              {t('tryAgain') || 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="container">
        {/* Header Section */}
        <div className="gallery-header">
          <h1 className="gallery-title">{t('galleryTitle') || 'Art Gallery'}</h1>
          <p className="gallery-subtitle">
            {t('gallerySubtitle') || 'Discover unique hand-painted pieces'}
          </p>
          <div className="gallery-stats">
            <span className="stat">
              <strong>{items.length}</strong> {t('totalItems') || 'items'}
            </span>
            {filter !== 'all' && (
              <span className="stat">
                <strong>{processedItems.length}</strong> {t('filtered') || 'filtered'}
              </span>
            )}
          </div>
        </div>

        {/* Filter and Sort Section */}
        <div className="controls-section">
          {/* Categories Filter */}
          <div className="filter-section">
            <span className="control-label">
              {t('filterBy') || 'Filter by:'}
            </span>
            <div className="filter-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${filter === category ? 'active' : ''}`}
                  onClick={() => handleFilterChange(category)}
                >
                  {t(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-section">
            <label htmlFor="sort-select" className="control-label">
              {t('sortBy') || 'Sort by:'}
            </label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="newest">{t('newest') || 'Newest First'}</option>
              <option value="oldest">{t('oldest') || 'Oldest First'}</option>
              <option value="price-low">{t('priceLowHigh') || 'Price: Low to High'}</option>
              <option value="price-high">{t('priceHighLow') || 'Price: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid or Empty State */}
        {processedItems.length === 0 ? (
          <div className="no-items">
            <div className="no-items-icon">🎨</div>
            <h3>{t('noItemsTitle') || 'No items found'}</h3>
            <p>{t('noItemsMessage') || 'Try changing your filters'}</p>
            {filter !== 'all' && (
              <button 
                onClick={() => setFilter('all')} 
                className="btn btn-secondary"
              >
                {t('clearFilters') || 'Clear Filters'}
              </button>
            )}
          </div>
        ) : (
          <div className="gallery-grid">
            {processedItems.map(item => (
              <GalleryItem key={item.id} item={item} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componentă separată pentru fiecare item (optimizare)
const GalleryItem = React.memo(({ item, t }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/item/${item.id}`} className="gallery-item">
      <div className="item-image-container">
        {!imageLoaded && !imageError && (
          <div className="image-skeleton">
            <div className="spinner-small"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="image-error">
            <span>🖼️</span>
            <p>{t('imageError') || 'Image unavailable'}</p>
          </div>
        ) : (
          <img 
            src={item.images[0]} 
            alt={item.title}
            className={`item-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        <div className="item-overlay">
          <span className="view-details">
            {t('viewDetails') || 'View Details'} →
          </span>
        </div>

        {/* Badge pentru articole noi (ultimele 7 zile) */}
        {isNewItem(item.createdAt) && (
          <span className="new-badge">{t('new') || 'New'}</span>
        )}
      </div>
      
      <div className="item-info">
        <h3 className="item-title">{item.title}</h3>
        <p className="item-category">
          {t(item.category)}
        </p>
        <div className="item-footer">
          <p className="item-price">${item.price.toFixed(2)}</p>
          {item.size && (
            <p className="item-size">{item.size}</p>
          )}
        </div>
      </div>
    </Link>
  );
});

// Helper function pentru a verifica dacă un item e nou
const isNewItem = (createdAt) => {
  const itemDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - itemDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

export default Gallery;