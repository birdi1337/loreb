// Folosim variabilă de mediu dacă există (pentru Render/producție)
// Dacă nu, folosim localhost pentru dezvoltare locală
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';