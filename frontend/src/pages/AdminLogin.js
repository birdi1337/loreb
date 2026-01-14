import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './AdminLogin.css';

function AdminLogin({ onLoginSuccess, t }) { // t primit ca prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/admin/login`,
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        onLoginSuccess();
      } else {
        setError(t('loginFailed'));
      }
    } catch (err) {
      setError(err.response?.data?.error || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="container">
        <div className="login-card">
          <div className="login-header">
            <h1>{t('adminLogin')}</h1>
            <p>{t('adminLoginSubtitle')}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">{t('username')}</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={t('enterUsername')}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">{t('password')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('enterPassword')}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? t('loggingIn') : t('login')}
            </button>
          </form>

          <div className="login-info">
            <p><strong>{t('defaultCredentials')}</strong></p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
            <p className="warning">{t('warningChangeCredentials')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
