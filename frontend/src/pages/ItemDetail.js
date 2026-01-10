import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import './ItemDetail.css';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items/${id}`);
      setItem(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching item:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading item...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: '40px', textAlign: 'center' }}>
          <h2>Item not found</h2>
          <button onClick={() => navigate('/gallery')} className="btn btn-primary">
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-detail">
      <div className="container">
        <button onClick={() => navigate('/gallery')} className="back-button">
          ← Back to Gallery
        </button>

        <div className="detail-card">
          <div className="detail-images">
            <div className="main-image-container">
              <img 
                src={item.images[selectedImage]} 
                alt={item.title}
                className="main-image"
              />
            </div>
            {item.images.length > 1 && (
              <div className="thumbnail-container">
                {item.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="detail-info">
            <div className="category-badge">{item.category}</div>
            <h1 className="detail-title">{item.title}</h1>
            <p className="detail-price">${item.price.toFixed(2)}</p>
            
            {item.size && (
              <div className="detail-section">
                <h3>Size</h3>
                <p>{item.size}</p>
              </div>
            )}

            <div className="detail-section">
              <h3>Description</h3>
              <p className="detail-description">{item.description}</p>
            </div>

            <div className="contact-section">
              <h3>Interested in this piece?</h3>
              <p>Contact me to purchase or discuss custom orders:</p>
              <div className="contact-buttons">
                <a 
                  href={`mailto:artist@example.com?subject=Interest in ${item.title}&body=Hi, I'm interested in purchasing "${item.title}".`}
                  className="btn btn-primary"
                >
                  📧 Email Me
                </a>
                <a 
                  href={`https://wa.me/1234567890?text=Hi, I'm interested in "${item.title}"`}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
