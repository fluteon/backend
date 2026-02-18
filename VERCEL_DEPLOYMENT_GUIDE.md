# Vercel Deployment Guide for Fluteon AdminFront

## 🚀 Quick Deploy Steps

### 1. Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import `fluteon/backend` repository
4. Vercel will detect the React app in `AdminFront/` folder

### 2. Configure Build Settings

Vercel should auto-detect these from `vercel.json`, but verify:

**Root Directory:** `AdminFront`  
**Build Command:** `npm run build`  
**Output Directory:** `build`  
**Install Command:** `npm install`

### 3. Environment Variables

Add these in Vercel project settings:

#### Firebase Configuration (for Google Sign-in):
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### Backend API URL:
```
REACT_APP_API_BASE_URL=https://your-backend.onrender.com
```

**Note:** Replace with your actual Render backend URL once deployed.

### 4. Firebase Console Setup

For Google Sign-in in AdminFront:
1. Firebase Console → Authentication → Sign-in method
2. Enable **Google** provider
3. Add your Vercel domain to **Authorized domains**:
   - `your-app.vercel.app`
   - `your-custom-domain.com` (if using custom domain)

### 5. Deploy

1. Click **Deploy**
2. Vercel will build and deploy
3. Visit your app URL once deployed

## 🔧 Troubleshooting

### Build Fails with "Cannot read package.json"
- Ensure `Root Directory` is set to `AdminFront`
- Check `vercel.json` configuration is correct

### Google Sign-in Not Working
- Verify Firebase config environment variables
- Check authorized domains in Firebase Console
- Ensure `ALLOWED_EMAIL` in `AdminLogin.jsx` matches your admin email

### API Calls Failing
- Verify `REACT_APP_API_BASE_URL` points to correct backend URL
- Check CORS configuration in backend allows Vercel domain
- Ensure backend is deployed and running

### Static Files Not Loading
- Check `public/` folder has all required assets
- Verify `homepage` in `package.json` (should be `/` or your domain)

## 📝 Post-Deployment Checklist

- [ ] AdminFront loads successfully
- [ ] Google Sign-in works
- [ ] Only authorized email can access (fluteoncompany@gmail.com)
- [ ] API calls to backend work
- [ ] Dashboard displays data correctly
- [ ] Product management works
- [ ] Order management works
- [ ] All admin features functional

## 🔄 Auto-Deploy

Vercel automatically deploys when you push to the `main` branch.

## 🌐 Custom Domain (Optional)

1. Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Add domain to Firebase authorized domains

## 📊 Monitoring

- Check Vercel deployment logs
- Monitor function logs for errors
- Set up alerts in Vercel dashboard

---

**Need Help?**
- [Vercel Documentation](https://vercel.com/docs)
- [Deploy React Apps](https://vercel.com/docs/frameworks/react)
