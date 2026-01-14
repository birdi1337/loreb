import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../LanguageContext'; // import corect
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

function Admin() {
  const { t } = useLanguage(); // hook apelat în componentă
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/check`, { withCredentials: true });
      setIsAuthenticated(response.data.isAuthenticated);
      setLoading(false);
    } catch (error) {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} t={t} />
  ) : (
    <AdminLogin onLoginSuccess={handleLoginSuccess} t={t} />
  );
}

export default Admin;
