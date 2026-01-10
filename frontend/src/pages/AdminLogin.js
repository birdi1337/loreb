import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/check`, { withCredentials: true });
      if (response.data.isAuthenticated) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.log('Not authenticated');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, 
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="container">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Login</h1>
            <p>Enter your credentials to manage the portfolio</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-info">
            <p><strong>Default credentials:</strong></p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
            <p className="warning">⚠️ Change these credentials in production!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
