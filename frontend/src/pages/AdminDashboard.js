import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import './AdminDashboard.css';

function AdminDashboard() {
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
    checkAuth();
    fetchItems();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/check`, { withCredentials: true });
      if (!response.data.isAuthenticated) {
        navigate('/admin/login');
      }
    } catch (error) {
      navigate('/admin/login');
    }
  };

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

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/admin/logout`, {}, { withCredentials: true });
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const addImageUrlField = () => {
    if (imageUrls.length < 5) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImageUrlField = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls.length > 0 ? newImageUrls : ['']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Filter out empty URLs
    const validUrls = imageUrls.filter(url => url.trim() !== '');
    
    if (validUrls.length === 0) {
      setError('Please add at least one image URL');
      return;
    }

    const data = {
      ...formData,
      images: validUrls
    };

    try {
      if (editingItem) {
        await axios.put(`${API_URL}/api/admin/items/${editingItem.id}`, data, {
          withCredentials: true
        });
        setSuccess('Item updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/admin/items`, data, {
          withCredentials: true
        });
        setSuccess('Item created successfully!');
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
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/admin/items/${id}`, { withCredentials: true });
      setSuccess('Item deleted successfully!');
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete item');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'painting',
      size: ''
    });
    setImageUrls(['']);
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/gallery')} className="btn btn-secondary">
              View Gallery
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
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
              {showForm ? 'Cancel' : '+ Add New Item'}
            </button>
          </div>

          {showForm && (
            <div className="card form-card">
              <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="title">Title *</label>
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
                  <label htmlFor="description">Description *</label>
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
                    <label htmlFor="price">Price ($) *</label>
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
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="painting">Painting</option>
                      <option value="t-shirt">T-Shirt</option>
                      <option value="hoodie">Hoodie</option>
                      <option value="jacket">Jacket</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="size">Size (optional)</label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="e.g., S, M, L, XL or dimensions"
                  />
                </div>

                <div className="input-group">
                  <label>Image URLs * (Max 5)</label>
                  <p className="help-text">
                    Upload your images to a cloud service (Imgur, Cloudinary, Google Drive, etc.) 
                    and paste the public URLs here. Make sure the links end with .jpg, .png, or .webp
                  </p>
                  
                  {imageUrls.map((url, index) => (
                    <div key={index} className="image-url-input-group">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
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
                      + Add Another Image URL
                    </button>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Update Item' : 'Create Item'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="items-section">
            <h2>Your Items ({items.length})</h2>
            
            {items.length === 0 ? (
              <div className="card no-items-card">
                <p>No items yet. Add your first item!</p>
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
                      <p className="item-category">{item.category}</p>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="admin-item-actions">
                      <button onClick={() => handleEdit(item)} className="btn btn-secondary">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
                        Delete
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
