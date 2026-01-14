// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '' // În producție pe Render, folosește același domeniu (relative path)
    : 'http://localhost:5000' // În development, backend local
  );

// Environment
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';