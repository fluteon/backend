# Render Deployment Fix Guide

## ❌ Current Error
```
npm error path /opt/render/project/src/backend/package.json
npm error errno -2
npm error enoent Could not read package.json
```

## 🔍 Root Cause
Render is looking for `package.json` in the wrong location because:
1. Your GitHub repo is: `https://github.com/fluteon/backend`
2. Inside this repo, the structure is:
   ```
   backend/           (GitHub repo root)
   ├── backend/       (Node.js backend folder)
   │   ├── package.json  ← Correct location
   │   └── src/
   └── AdminFront/    (React admin panel)
       ├── package.json
       └── src/
   ```

## ✅ Solution: Fix Render Settings

### Step 1: Check GitHub Repository Access
1. Go to Render Dashboard
2. Navigate to **Account Settings** → **GitHub**
3. Click **Connect to GitHub** or **Configure GitHub App**
4. Make sure `fluteon/backend` repository has access granted

### Step 2: Fix Root Directory Setting

**For Backend API Service:**
1. Go to Render Dashboard → Your Backend Service
2. Click **Settings** (in left sidebar)
3. Scroll to **Build & Deploy** section
4. Find **Root Directory** field
5. Set it to: `backend` (NOT "backend/backend")
6. Click **Save Changes**

**Build Settings Should Be:**
```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### Step 3: Environment Variables
Make sure these are set in Render Dashboard → Environment:
```
MONGODB_NAME=your_mongodb_connection_string
NODE_ENV=production
PORT=8000
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_API_KEY=your_razorpay_key
RAZORPAY_API_SECRET=your_razorpay_secret
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=noreply@fluteon.com
```

### Step 4: Deploy
1. Click **Manual Deploy** → **Deploy latest commit**
2. Monitor the logs for success

---

## 🎯 Expected Success Output
```
==> Cloning from https://github.com/fluteon/backend
==> Using Node.js version 22.16.0
==> Running build command 'npm install'
added 150 packages, and audited 151 packages in 5s
==> Running 'npm start'
🔗 Mongoose connected to Atlas
✅ MongoDB connected successfully
📊 Connection pool: min=10, max=50
ecommerce api listing on port 8000
==> Your service is live 🎉
```

---

## 🔧 Alternative: If Repository Structure Needs Change

If you want to separate repositories:

### Option 1: Keep current structure (Recommended)
- Deploy `backend/backend/` as one service (Root Directory: `backend`)
- Deploy `backend/AdminFront/` as separate service (Root Directory: `AdminFront`)

### Option 2: Separate repositories
- Create `fluteon/backend-api` repository with just backend code
- Create `fluteon/admin-panel` repository with just AdminFront code
- No Root Directory needed (deploy from root)

---

## 📝 Verification Checklist
- [ ] GitHub repository access granted in Render
- [ ] Root Directory set to `backend` (not `backend/backend`)
- [ ] Environment variables configured
- [ ] Build command is `npm install`
- [ ] Start command is `npm start`
- [ ] Manual deploy triggered
- [ ] Check logs show successful connection to MongoDB
- [ ] Health check endpoint working: `https://your-app.onrender.com/health`
