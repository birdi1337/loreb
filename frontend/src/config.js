// ============================================
// API CONFIGURATION
// ============================================

// Determină URL-ul API-ului bazat pe environment
export const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? window.location.origin  // 
    : 'http://localhost:5000' // 
  );

// ============================================
// ENVIRONMENT
// ============================================
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// ============================================
// AXIOS DEFAULT CONFIG
// ============================================
export const AXIOS_CONFIG = {
  baseURL: API_URL,
  timeout: 10000, // 
  withCredentials: true, // 
  headers: {
    'Content-Type': 'application/json',
  }
};

// ============================================
// SITE CONFIGURATION
// ============================================
export const SITE_CONFIG = {
  name: 'LoreB Art',
  description: 'Unique hand-painted art and custom clothing',
  author: 'LoreB',
  email: 'loreb.artist@gmail.com', // 
  social: {
    instagram: 'https://www.instagram.com/loredana.balus/', // 
    facebook: 'https://www.facebook.com/profile.php?id=61582596657007',  // 
    tiktok: 'https://www.tiktok.com/@lor3bart',    // 
  }
};

// ============================================
// FEATURES FLAGS
// ============================================
export const FEATURES = {
  enableAdmin: IS_DEVELOPMENT, // 
  enableAnalytics: IS_PRODUCTION, // 
  enableLazyLoading: true,
  enableImageOptimization: true,
};

// ============================================
// CACHE SETTINGS
// ============================================
export const CACHE_DURATION = {
  items: 5 * 60 * 1000, // 
  categories: 30 * 60 * 1000, // 
};

// ============================================
// PAGINATION
// ============================================
export const PAGINATION = {
  itemsPerPage: 12,
  maxPages: 10,
};

// ============================================
// IMAGE SETTINGS
// ============================================
export const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  placeholderImage: '/placeholder.jpg',
};

// ============================================
// VALIDATION RULES
// ============================================
export const VALIDATION = {
  title: {
    minLength: 3,
    maxLength: 100,
  },
  description: {
    minLength: 10,
    maxLength: 1000,
  },
  price: {
    min: 0,
    max: 10000,
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verifică dacă aplicația rulează în development
 */
export const isDevelopment = () => IS_DEVELOPMENT;

/**
 * Verifică dacă aplicația rulează în production
 */
export const isProduction = () => IS_PRODUCTION;

/**
 * Obține URL-ul complet pentru un endpoint API
 */
export const getApiUrl = (endpoint) => {
  // Asigură-te că endpoint-ul începe cu /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${path}`;
};

/**
 * Log pentru debugging (doar în development)
 */
export const debugLog = (...args) => {
  if (IS_DEVELOPMENT) {
    console.log('[DEBUG]', ...args);
  }
};

/**
 * Formatare preț
 */
export const formatPrice = (price, currency = 'RON') => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

/**
 * Formatare dată
 */
export const formatDate = (date, locale = 'ro-RO') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// ============================================
// EXPORT DEFAULT
// ============================================
export default {
  API_URL,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  AXIOS_CONFIG,
  SITE_CONFIG,
  FEATURES,
  CACHE_DURATION,
  PAGINATION,
  IMAGE_CONFIG,
  VALIDATION,
  getApiUrl,
  debugLog,
  formatPrice,
  formatDate,
};