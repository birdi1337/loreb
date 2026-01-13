const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Folosește promises pentru async/await
const fsSync = require('fs'); // Păstrează sync doar pentru setup inițial
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CONFIGURARE MIDDLEWARE
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'artist-portfolio-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 ore
  }
}));

// ============================================
// INIȚIALIZARE DIRECTOARE ȘI FIȘIERE
// ============================================
const dataDir = path.join(__dirname, 'data');
const ITEMS_FILE = path.join(dataDir, 'items.json');
const ADMIN_FILE = path.join(dataDir, 'admin.json');

// Creare director și fișiere
const initializeDatabase = () => {
  if (!fsSync.existsSync(dataDir)) {
    fsSync.mkdirSync(dataDir, { recursive: true });
  }

  if (!fsSync.existsSync(ITEMS_FILE)) {
    fsSync.writeFileSync(ITEMS_FILE, JSON.stringify([], null, 2));
  }

  if (!fsSync.existsSync(ADMIN_FILE)) {
    fsSync.writeFileSync(ADMIN_FILE, JSON.stringify({
      username: 'admin',
      password: 'admin123' // ⚠️ Schimbă în producție!
    }, null, 2));
  }
};

initializeDatabase();

// ============================================
// FUNCȚII HELPER (ASYNC)
// ============================================
const readItems = async () => {
  try {
    const data = await fs.readFile(ITEMS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading items:', error);
    return [];
  }
};

const writeItems = async (items) => {
  try {
    await fs.writeFile(ITEMS_FILE, JSON.stringify(items, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing items:', error);
    return false;
  }
};

const readAdmin = async () => {
  try {
    const data = await fs.readFile(ADMIN_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading admin:', error);
    return null;
  }
};

// Middleware pentru autentificare
const isAuthenticated = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
};

// Middleware pentru validare date
const validateItemData = (req, res, next) => {
  const { title, description, price, category } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  if (!description || description.trim().length === 0) {
    return res.status(400).json({ error: 'Description is required' });
  }
  
  if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }
  
  if (!category || category.trim().length === 0) {
    return res.status(400).json({ error: 'Category is required' });
  }
  
  next();
};

// ============================================
// RUTE PUBLICE
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Obține toate articolele
app.get('/api/items', async (req, res) => {
  try {
    const items = await readItems();
    
    // Opțional: filtrare după categorie
    const { category } = req.query;
    if (category) {
      const filtered = items.filter(item => item.category === category);
      return res.json(filtered);
    }
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Obține un articol după ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const items = await readItems();
    const item = items.find(i => i.id === req.params.id);
    
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Obține categorii disponibile
app.get('/api/categories', async (req, res) => {
  try {
    const items = await readItems();
    const categories = [...new Set(items.map(item => item.category))];
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ============================================
// RUTE ADMIN - AUTENTIFICARE
// ============================================

// Login admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const admin = await readAdmin();
    
    if (!admin) {
      return res.status(500).json({ error: 'Admin configuration error' });
    }
    
    if (username === admin.username && password === admin.password) {
      req.session.isAdmin = true;
      res.json({ 
        success: true, 
        message: 'Login successful' 
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout admin
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Verifică status autentificare
app.get('/api/admin/check', (req, res) => {
  res.json({ 
    isAuthenticated: !!req.session.isAdmin,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// RUTE ADMIN - GESTIONARE ARTICOLE
// ============================================

// Creează articol nou
app.post('/api/admin/items', isAuthenticated, validateItemData, async (req, res) => {
  try {
    const items = await readItems();
    const { title, description, price, category, size, images } = req.body;
    
    // Parse images array
    let imageUrls = [];
    if (images) {
      imageUrls = typeof images === 'string' ? JSON.parse(images) : images;
    }
    
    const newItem = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      size: size ? size.trim() : null,
      images: imageUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    const success = await writeItems(items);
    
    if (success) {
      res.status(201).json(newItem);
    } else {
      res.status(500).json({ error: 'Failed to save item' });
    }
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Actualizează articol existent
app.put('/api/admin/items/:id', isAuthenticated, validateItemData, async (req, res) => {
  try {
    const items = await readItems();
    const itemIndex = items.findIndex(i => i.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const { title, description, price, category, size, images } = req.body;
    
    // Parse images array
    let imageUrls = [];
    if (images) {
      imageUrls = typeof images === 'string' ? JSON.parse(images) : images;
    }
    
    items[itemIndex] = {
      ...items[itemIndex],
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      size: size ? size.trim() : null,
      images: imageUrls,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writeItems(items);
    
    if (success) {
      res.json(items[itemIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update item' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Șterge articol
app.delete('/api/admin/items/:id', isAuthenticated, async (req, res) => {
  try {
    const items = await readItems();
    const itemIndex = items.findIndex(i => i.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    items.splice(itemIndex, 1);
    const success = await writeItems(items);
    
    if (success) {
      res.json({ success: true, message: 'Item deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ============================================
// SERVIRE FRONTEND (PRODUCȚIE)
// ============================================
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  
  // Verifică dacă directorul există
  if (fsSync.existsSync(frontendBuildPath)) {
    app.use(express.static(frontendBuildPath));
    
    // Toate rutele non-API servesc index.html (React Router)
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
  } else {
    console.warn('⚠️ Frontend build folder not found!');
  }
}

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// PORNIRE SERVER
// ============================================
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`💾 Data directory: ${dataDir}`);
  console.log('=================================');
});