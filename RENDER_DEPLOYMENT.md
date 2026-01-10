# Render.com Deployment Guide - Artist Portfolio

## Quick Overview

You'll create **2 services** on Render.com:
- 1️⃣ **Backend** (Web Service) - Runs your API
- 2️⃣ **Frontend** (Static Site) - Serves your React app

Both can be in the **same GitHub repository**!

---

## Step-by-Step Deployment

### Prerequisites
1. Create account at [render.com](https://render.com)
2. Push your code to GitHub

---

### STEP 1: Deploy Backend First

#### 1.1 Create Web Service
- Go to Render Dashboard
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository

#### 1.2 Configure Backend Service
```
Name: artist-portfolio-api
Region: Choose closest to you
Branch: main (or master)
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

#### 1.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these:
```
NODE_ENV = production
SESSION_SECRET = your-random-secret-key-here-make-it-long-and-secure
FRONTEND_URL = (leave empty for now, we'll add this after frontend is deployed)
```

#### 1.4 Deploy!
- Click **"Create Web Service"**
- Wait 2-5 minutes for deployment
- You'll get a URL like: `https://artist-portfolio-api.onrender.com`
- **Copy this URL!** You'll need it for the frontend

---

### STEP 2: Deploy Frontend

#### 2.1 Create Static Site
- Click **"New +"** → **"Static Site"**
- Connect your GitHub repository (same one)

#### 2.2 Configure Frontend Service
```
Name: artist-portfolio
Region: Same as backend
Branch: main (or master)
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

#### 2.3 Add Environment Variable
Click **"Advanced"** → **"Add Environment Variable"**

Add this (use the backend URL from Step 1.4):
```
REACT_APP_API_URL = https://artist-portfolio-api.onrender.com
```
Replace with YOUR actual backend URL!

#### 2.4 Deploy!
- Click **"Create Static Site"**
- Wait 2-5 minutes
- You'll get a URL like: `https://artist-portfolio.onrender.com`

---

### STEP 3: Update Backend with Frontend URL

#### 3.1 Go Back to Backend Service
- In Render Dashboard, click on your backend service
- Go to **"Environment"** tab
- Edit the `FRONTEND_URL` variable:

```
FRONTEND_URL = https://artist-portfolio.onrender.com
```
Replace with YOUR actual frontend URL!

#### 3.2 Save and Redeploy
- Click **"Save Changes"**
- Render will automatically redeploy your backend

---

### STEP 4: Add Custom Domain (Optional)

#### For Frontend (your main site):
1. Go to frontend service → **"Settings"**
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter your domain: `www.yourdomain.com`
5. Follow DNS instructions (add CNAME record)
6. SSL is automatic and FREE! 🎉

#### For Backend (optional):
You can also add a custom domain like `api.yourdomain.com`, but it's not required since the frontend will handle all user traffic.

---

## Project Structure in GitHub

Your repository should look like this:
```
artist-portfolio/
├── backend/
│   ├── data/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── README.md
├── DEPLOYMENT.md
└── .gitignore
```

---

## Important Notes

### Free Tier Limitations:
- ⚠️ **Services sleep after 15 minutes of inactivity**
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month free (enough for 1 service running 24/7)
- For 2 services, they'll both sleep when not in use

### Solutions:
1. **Upgrade to paid tier** ($7/month per service) - no sleep
2. **Use a uptime monitor** (free services like UptimeRobot) to ping your site every 14 minutes
3. **Combine services** (see alternative approach below)

---

## Alternative: Single Service Approach

You can run both frontend and backend as ONE service on Render:

### Modify Backend to Serve Frontend

1. **Update backend/server.js** - Add at the end, before `app.listen()`:

```javascript
// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuild = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendBuild));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}
```

2. **Update Build Command on Render:**
```bash
cd frontend && npm install && npm run build && cd ../backend && npm install
```

3. **Deploy as single Web Service:**
```
Root Directory: (leave empty or use .)
Build Command: cd frontend && npm install && npm run build && cd ../backend && npm install
Start Command: cd backend && node server.js
```

4. **Environment Variables:**
```
NODE_ENV = production
SESSION_SECRET = your-secret-key
FRONTEND_URL = https://your-app.onrender.com
```

This way you only use **1 free service** instead of 2!

---

## Troubleshooting

### Issue: CORS errors
**Solution:** Make sure `FRONTEND_URL` in backend matches your actual frontend URL exactly (no trailing slash)

### Issue: Images not loading
**Solution:** Check that `REACT_APP_API_URL` in frontend points to your backend URL

### Issue: Admin login not working
**Solution:** 
- Clear browser cookies
- Check that both services are running
- Verify environment variables are set correctly

### Issue: First load is very slow
**Solution:** This is normal on free tier - service is waking up from sleep

---

## Cost Breakdown

### Free Tier:
- ✅ 2 services (but they sleep)
- ✅ Custom domain support
- ✅ Free SSL/HTTPS
- ✅ 100GB bandwidth/month
- ⚠️ Sleeps after 15 min inactivity

### Paid Tier ($7/month per service):
- ✅ No sleep
- ✅ More resources
- ✅ Better performance
- Total: $14/month for both services

### Alternative Providers:
- **Railway** - $5/month, 500 hours free
- **Vercel** (frontend only) - Free, no sleep
- **VPS** (DigitalOcean) - $6/month for everything

---

## My Recommendation

### For Testing/Demo:
Use **2 separate services** (free tier) - easiest to set up

### For Production:
Either:
1. **Single service approach** - Use 1 free/paid service
2. **Upgrade both to paid** - Best performance ($14/mo)
3. **Use VPS** - Most control, better value ($6/mo)

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Render account
3. ✅ Deploy backend first
4. ✅ Deploy frontend second
5. ✅ Update FRONTEND_URL in backend
6. ✅ Test everything
7. 🎉 Your site is live with HTTPS!

---

**Questions?** Check the main DEPLOYMENT.md file for more options!
