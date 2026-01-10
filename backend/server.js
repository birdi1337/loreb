const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Create necessary directories
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// File-based database paths
const ITEMS_FILE = path.join(dataDir, 'items.json');
const ADMIN_FILE = path.join(dataDir, 'admin.json');

// Initialize files if they don't exist
if (!fs.existsSync(ITEMS_FILE)) {
  fs.writeFileSync(ITEMS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(ADMIN_FILE)) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({
    username: 'admin',
    password: 'admin123'
  }));
}

// Helper functions
const readItems = () => {
  const data = fs.readFileSync(ITEMS_FILE, 'utf8');
  return JSON.parse(data);
};

const writeItems = (items) => {
  fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2));
};

const readAdmin = () => {
  const data = fs.readFileSync(ADMIN_FILE, 'utf8');
  return JSON.parse(data);
};

const isAuthenticated = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// PUBLIC ROUTES
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/items', (req, res) => {
  try {
    const items = readItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.get('/api/items/:id', (req, res) => {
  try {
    const items = readItems();
    const item = items.find(i => i.id === req.params.id);
    
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// ADMIN ROUTES
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = readAdmin();
  
  if (username === admin.username && password === admin.password) {
    req.session.isAdmin = true;
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out' });
});

app.get('/api/admin/check', (req, res) => {
  res.json({ isAuthenticated: !!req.session.isAdmin });
});

app.post('/api/admin/items', isAuthenticated, (req, res) => {
  try {
    const items = readItems();
    const { title, description, price, category, size, images } = req.body;
    
    // Parse images array (should be array of URLs)
    const imageUrls = typeof images === 'string' ? JSON.parse(images) : images;
    
    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      price: parseFloat(price),
      category,
      size,
      images: imageUrls || [],
      createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    writeItems(items);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.put('/api/admin/items/:id', isAuthenticated, (req, res) => {
  try {
    const items = readItems();
    const itemIndex = items.findIndex(i => i.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const { title, description, price, category, size, images } = req.body;
    
    // Parse images array (should be array of URLs)
    const imageUrls = typeof images === 'string' ? JSON.parse(images) : images;
    
    items[itemIndex] = {
      ...items[itemIndex],
      title,
      description,
      price: parseFloat(price),
      category,
      size,
      images: imageUrls || [],
      updatedAt: new Date().toISOString()
    };
    
    writeItems(items);
    res.json(items[itemIndex]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/admin/items/:id', isAuthenticated, (req, res) => {
  try {
    const items = readItems();
    const itemIndex = items.findIndex(i => i.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    items.splice(itemIndex, 1);
    writeItems(items);
    
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  
  // Serve static files from React build
  app.use(express.static(frontendBuildPath));
  
  // All non-API routes serve index.html (for React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
