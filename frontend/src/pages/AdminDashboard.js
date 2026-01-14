import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import './AdminDashboard.css';

function AdminDashboard({ onLogout, t }) { // t primit ca prop
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'painting',
    size: ''
  });
  const [imageUrls, setImageUrls] = useState(['']);
  
  const navigate = useNavigate();

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

  const handleLogoutClick = async () => {
    try {
      await axios.post(`${API_URL}/api/admin/logout`, {}, { withCredentials: true });
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const addImageUrlField = () => {
    if (imageUrls.length < 5) setImageUrls([...imageUrls, '']);
  };

  const removeImageUrlField = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls.length > 0 ? newImageUrls : ['']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validUrls = imageUrls.filter(url => url.trim() !== '');
    if (validUrls.length === 0) {
      setError(t('addAtLeastOneImage'));
      return;
    }

    const data = { ...formData, images: validUrls };

    try {
      if (editingItem) {
        await axios.put(`${API_URL}/api/admin/items/${editingItem.id}`, data, { withCredentials: true });
        setSuccess(t('itemUpdated'));
      } else {
        await axios.post(`${API_URL}/api/admin/items`, data, { withCredentials: true });
        setSuccess(t('itemCreated'));
      }

      resetForm();
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      size: item.size || ''
    });
    setImageUrls(item.images.length > 0 ? item.images : ['']);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('deleteConfirm'))) return;

    try {
      await axios.delete(`${API_URL}/api/admin/items/${id}`, { withCredentials: true });
      setSuccess(t('itemDeleted'));
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete item');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', category: 'painting', size: '' });
    setImageUrls(['']);
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>{t('loadingDashboard')}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>{t('adminDashboard')}</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/gallery')} className="btn btn-secondary">
              {t('viewGalleryBtn')}
            </button>
            <button onClick={handleLogoutClick} className="btn btn-danger">
              {t('logout')}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="dashboard-content">
          <div className="actions-section">
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn btn-primary"
            >
              {showForm ? t('cancel') : t('addNewItem')}
            </button>
          </div>

          {showForm && (
            <div className="card form-card">
              <h2>{editingItem ? t('editItem') : t('addItem')}</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="title">{t('titleRequired')}</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="description">{t('descriptionRequired')}</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="price">{t('priceRequired')}</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="category">{t('categoryRequired')}</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="painting">{t('categories.painting')}</option>
                      <option value="t-shirt">{t('categories.t-shirt')}</option>
                      <option value="hoodie">{t('categories.hoodie')}</option>
                      <option value="jacket">{t('categories.jacket')}</option>
                      <option value="other">{t('categories.other')}</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="size">{t('sizeLabel')}</label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder={t('sizePlaceholder')}
                  />
                </div>

                <div className="input-group">
                  <label>{t('imageUrls')}</label>
                  <p className="help-text">{t('imageUrlsHelp')}</p>
                  
                  {imageUrls.map((url, index) => (
                    <div key={index} className="image-url-input-group">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder={t('imageUrlPlaceholder')}
                        className="image-url-input"
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrlField(index)}
                          className="remove-url-btn"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {imageUrls.length < 5 && (
                    <button
                      type="button"
                      onClick={addImageUrlField}
                      className="btn btn-secondary add-url-btn"
                    >
                      {t('addAnotherUrl')}
                    </button>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? t('updateItem') : t('createItem')}
                  </button>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="items-section">
            <h2>{t('yourItems')} ({items.length})</h2>
            
            {items.length === 0 ? (
              <div className="card no-items-card">
                <p>{t('noItemsYet')}</p>
              </div>
            ) : (
              <div className="items-grid">
                {items.map(item => (
                  <div key={item.id} className="admin-item-card">
                    <div className="admin-item-image">
                      <img src={item.images[0]} alt={item.title} />
                    </div>
                    <div className="admin-item-info">
                      <h3>{item.title}</h3>
                      <p className="item-category">{t(`categories.${item.category}`)}</p>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="admin-item-actions">
                      <button onClick={() => handleEdit(item)} className="btn btn-secondary">
                        {t('edit')}
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
