# Deployment Guide - Artist Portfolio

This guide covers multiple deployment options for your React + Node.js application.

## Table of Contents
1. [Option 1: Deploy on VPS (DigitalOcean, Linode, AWS EC2)](#option-1-vps-deployment)
2. [Option 2: Deploy on Render (Easiest)](#option-2-render-easiest)
3. [Option 3: Deploy on Vercel + Railway](#option-3-vercel--railway)
4. [SSL/HTTPS Setup](#ssl-https-setup)
5. [Domain Configuration](#domain-configuration)

---

## Option 1: VPS Deployment (Full Control)

**Best for:** Complete control, custom configuration
**Providers:** DigitalOcean ($6/mo), Linode, AWS EC2, Vultr, Hetzner

### Step 1: Prepare Your Server

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx (web server)
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Upload Your Code

**Option A: Using Git (Recommended)**
```bash
# On your server
cd /var/www
sudo git clone https://github.com/your-username/artist-portfolio.git
cd artist-portfolio
```

**Option B: Using SCP/SFTP**
```bash
# On your local machine
scp -r artist-portfolio root@your-server-ip:/var/www/
```

### Step 3: Setup Backend

```bash
cd /var/www/artist-portfolio/backend

# Install dependencies
npm install --production

# Create environment file
sudo nano .env
```

Add this to `.env`:
```env
PORT=5000
NODE_ENV=production
SESSION_SECRET=your-super-secret-key-change-this
FRONTEND_URL=https://yourdomain.com
```

**Important:** Update `backend/server.js` CORS settings:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true
}));
```

**Start backend with PM2:**
```bash
pm2 start server.js --name artist-backend
pm2 startup
pm2 save
```

### Step 4: Build Frontend

```bash
cd /var/www/artist-portfolio/frontend

# Install dependencies
npm install

# Update API URL - Create .env.production file
echo "REACT_APP_API_URL=https://yourdomain.com" > .env.production

# Build for production
npm run build
```

**Update frontend API calls** - Edit `frontend/src/pages/*.js`:
```javascript
// Change from:
const response = await axios.get('/api/items');

// To:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const response = await axios.get(`${API_URL}/api/items`);
```

### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/artist-portfolio
```

Add this configuration:
```nginx
# Backend API Server
upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend - React build files
    root /var/www/artist-portfolio/frontend/build;
    index index.html;

    # Serve uploaded images from backend
    location /uploads {
        alias /var/www/artist-portfolio/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API requests go to backend
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # React Router - redirect all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/artist-portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Setup SSL/HTTPS with Let's Encrypt

```bash
# Get SSL certificate (free from Let's Encrypt)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)
```

Certbot will automatically:
- Generate SSL certificates
- Update Nginx configuration
- Setup auto-renewal

**Test auto-renewal:**
```bash
sudo certbot renew --dry-run
```

### Step 7: Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Step 8: Set Correct Permissions

```bash
# Create uploads directory if it doesn't exist
mkdir -p /var/www/artist-portfolio/backend/uploads
mkdir -p /var/www/artist-portfolio/backend/data

# Set proper ownership
sudo chown -R www-data:www-data /var/www/artist-portfolio/backend/uploads
sudo chown -R www-data:www-data /var/www/artist-portfolio/backend/data

# Set proper permissions
sudo chmod -R 755 /var/www/artist-portfolio/backend/uploads
sudo chmod -R 755 /var/www/artist-portfolio/backend/data
```

### Maintenance Commands

```bash
# View backend logs
pm2 logs artist-backend

# Restart backend
pm2 restart artist-backend

# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# Renew SSL certificate manually
sudo certbot renew
```

---

## Option 2: Render (Easiest - Free Tier Available)

**Best for:** Quick deployment, no server management
**Cost:** Free tier available

### Step 1: Prepare Your Code

1. Create two separate Git repositories or use one with both folders
2. Push to GitHub/GitLab

### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure:
   - **Name:** artist-portfolio-backend
   - **Root Directory:** `backend` (if in same repo)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   SESSION_SECRET=your-secret-key
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

6. Deploy!

**Important:** Update CORS in `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Step 3: Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name:** artist-portfolio
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

### Step 4: Update Frontend Code

Create `frontend/src/config.js`:
```javascript
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

Update all API calls:
```javascript
import { API_URL } from '../config';

// Use API_URL in requests
const response = await axios.get(`${API_URL}/api/items`);
```

### Step 5: Custom Domain on Render

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `www.yourdomain.com`)
4. Follow DNS configuration instructions
5. SSL is automatically provided!

---

## Option 3: Vercel + Railway

**Best for:** Modern serverless deployment
**Cost:** Free tier available

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

5. Deploy!

### Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `node server.js`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   SESSION_SECRET=your-secret-key
   FRONTEND_URL=https://your-site.vercel.app
   PORT=5000
   ```

6. Deploy!

### Custom Domain

**Vercel (Frontend):**
- Go to Project Settings → Domains
- Add your domain
- Update DNS records as instructed

**Railway (Backend):**
- Go to Settings → Domains
- Add custom domain or use Railway's subdomain

---

## Domain Configuration

### Buy a Domain
- **Namecheap:** $8-12/year
- **Google Domains:** $12/year
- **Cloudflare:** At cost (~$8-10/year)

### DNS Configuration

**For VPS Deployment:**
```
Type    Name    Value               TTL
A       @       your-server-ip      3600
A       www     your-server-ip      3600
```

**For Render/Vercel/Railway:**
Follow their specific DNS instructions (usually CNAME or A records)

### Using Cloudflare (Recommended)

1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Add DNS records
4. Enable:
   - SSL/TLS (Full or Full Strict)
   - Auto HTTPS Rewrites
   - Always Use HTTPS
   - Brotli compression

---

## SSL/HTTPS Setup

### VPS (Let's Encrypt - FREE)
Already covered in Option 1 above using Certbot

### Render/Vercel/Railway
SSL is automatic - just add your custom domain!

### Cloudflare (Additional Layer)
Provides free SSL and CDN benefits

---

## Production Checklist

Before going live, make sure to:

- [ ] Change admin password in `backend/data/admin.json`
- [ ] Implement password hashing (use bcrypt)
- [ ] Set strong `SESSION_SECRET` in environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly for your domain
- [ ] Set up automatic backups for uploads and data
- [ ] Add rate limiting to prevent abuse
- [ ] Set up monitoring (PM2, UptimeRobot, etc.)
- [ ] Test all functionality on production
- [ ] Set up error logging (e.g., Sentry)
- [ ] Configure environment variables properly
- [ ] Test image uploads work correctly
- [ ] Verify admin panel is secure

---

## Recommended: Upgrade to Production Database

For production, consider replacing JSON files with a real database:

**MongoDB Atlas (Free tier available):**
```bash
npm install mongoose
```

**PostgreSQL (Render/Railway have free tiers):**
```bash
npm install pg
```

---

## Cost Comparison

| Option | Monthly Cost | Pros | Cons |
|--------|-------------|------|------|
| VPS (DigitalOcean) | $6 | Full control, better performance | Requires setup & maintenance |
| Render | Free/$7 | Easy, auto-scaling | Free tier sleeps after inactivity |
| Vercel + Railway | Free/$5 | Modern, fast deploys | Learning curve for splitting services |

---

## My Recommendation

**For Beginners:** Start with **Render** (both frontend + backend) - easiest setup, free tier

**For Best Performance:** Use **VPS with Nginx** - full control, best for production

**For Modern Stack:** **Vercel (frontend) + Railway (backend)** - scalable, fast

---

## Need Help?

Common issues and solutions:

**CORS errors:** Update `FRONTEND_URL` in backend environment variables
**Images not loading:** Check `/uploads` path in Nginx or update API URL
**Admin not logging in:** Clear cookies, check session configuration
**SSL not working:** Wait 5-10 minutes after setup, check DNS propagation

---

Good luck with your deployment! 🚀
