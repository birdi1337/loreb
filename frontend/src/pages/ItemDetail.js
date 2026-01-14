import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../LanguageContext';
import './ItemDetail.css';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
  fetchItem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <p>{t('loadingItem')}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: '40px', textAlign: 'center' }}>
          <h2>{t('itemNotFound')}</h2>
          <button onClick={() => navigate('/gallery')} className="btn btn-primary">
            {t('backToGallery')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-detail">
      <div className="container">
        <button onClick={() => navigate('/gallery')} className="back-button">
          {t('backToGallery')}
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
            <div className="category-badge">{t(`categories.${item.category}`)}</div>
            <h1 className="detail-title">{item.title}</h1>
            <p className="detail-price">${item.price.toFixed(2)}</p>
            
            {item.size && (
              <div className="detail-section">
                <h3>{t('size')}</h3>
                <p>{item.size}</p>
              </div>
            )}

            <div className="detail-section">
              <h3>{t('description')}</h3>
              <p className="detail-description">{item.description}</p>
            </div>

            <div className="contact-section">
              <h3>{t('interestedTitle')}</h3>
              <p>{t('interestedText')}</p>
              <div className="contact-buttons">
                <a 
                  href={`mailto:loreb.artist@gmail.com?subject=Interest in ${item.title}&body=Hi, I'm interested in purchasing "${item.title}".`}
                  className="btn btn-primary"
                >
                  {t('emailMe')}
                </a>
                <a 
                  href={`https://wa.me/+40735416890text=Hi, I'm interested in "${item.title}"`}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('whatsapp')}
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
