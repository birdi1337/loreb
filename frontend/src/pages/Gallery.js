import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import './Gallery.css';

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  const categories = ['all', ...new Set(items.map(item => item.category))];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="container">
        <h1 className="gallery-title">Gallery</h1>
        <p className="gallery-subtitle">Browse my collection of unique artwork and painted clothing</p>

        <div className="filter-section">
          <span className="filter-label">Filter by:</span>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="no-items">
            <p>No items found in this category.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredItems.map(item => (
              <Link to={`/item/${item.id}`} key={item.id} className="gallery-item">
                <div className="item-image-container">
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="item-image"
                  />
                  <div className="item-overlay">
                    <span className="view-details">View Details</span>
                  </div>
                </div>
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
