# Artist Portfolio Website (URL-Based Images Version)

A colorful and artistic portfolio website for showcasing and selling hand-painted clothing and original artwork. This version uses **image URLs** instead of file uploads.

## ⚠️ Key Differences from Original Version

### What Changed:
1. **✅ No File Uploads** - Admin pastes image URLs instead of uploading files
2. **✅ No Admin Link in Navigation** - Admin panel is hidden, accessible only via direct URL
3. **✅ Simpler Backend** - No file storage, no multer dependency
4. **✅ Cloud-Ready** - Works perfectly with free hosting (Render, Vercel, etc.)

### Benefits:
- 💰 **Free Hosting Compatible** - No need for persistent file storage
- 🚀 **Faster Deployment** - No uploads folder to manage
- 🌍 **Use Any Image Host** - Imgur, Cloudinary, Google Drive, etc.
- 📦 **Smaller Backend** - Simplified code, fewer dependencies

---

## How to Use Images

### Step 1: Upload Images to Cloud

Upload your images to any free image hosting service:

**Recommended Services:**
- **Imgur** - https://imgur.com (easiest, anonymous upload)
- **Cloudinary** - https://cloudinary.com (free tier: 25GB)
- **ImgBB** - https://imgbb.com (free, no account needed)
- **Google Drive** - Make public and get shareable link

### Step 2: Get Public URL

Make sure the URL:
- ✅ Ends with `.jpg`, `.png`, `.webp`, or `.gif`
- ✅ Is publicly accessible (no login required)
- ✅ Links directly to the image file

**Example:**
```
✅ Good: https://i.imgur.com/abc123.jpg
❌ Bad: https://imgur.com/gallery/abc123 (gallery link)
```

### Step 3: Add to Admin Panel

1. Go to `https://yourdomain.com/admin/login`
2. Login with credentials
3. Click "Add New Item"
4. Paste image URLs in the form

---

## Admin Access

**The admin panel is hidden!**

Access it via: `https://yourdomain.com/admin/login`

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change these in production!**

---

## Quick Start

```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

Visit: `http://localhost:3000`

---

## Deployment (Render.com)

See `RENDER_DEPLOYMENT.md` for detailed instructions.

Quick version:
1. Push to GitHub
2. Create Web Service on Render
3. Use single service setup
4. Add your domain
5. Done! Free SSL included

---

## Sample Items Included

2 items with Unsplash images are included for demo.

---

**See full documentation in other .md files in this project!**
