# Render Deployment Guide for Fluteon Backend

## 🚀 Quick Deploy Steps

### 1. Connect GitHub Repository
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub account and select `fluteon/backend` repository
4. Render will automatically detect `render.yaml` configuration

### 2. Configure Environment Variables

In Render dashboard, add these environment variables:

#### Required Variables:
```
MONGODB_NAME=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_jwt_secret_key_here
PORT=8000
NODE_ENV=production
```

#### Email OTP (Brevo):
```
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=noreply@fluteon.com
```

#### Payment Gateway (Razorpay):
```
RAZORPAY_API_KEY=your_razorpay_key_id
RAZORPAY_API_SECRET=your_razorpay_key_secret
```

#### Image Upload (Cloudinary):
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Admin Configuration:
```
ADMIN_EMAIL=admin@fluteon.com
ADMIN_PASSWORD=secure_admin_password
```

### 3. Firebase Service Account (IMPORTANT for Mobile OTP)

Since the Firebase service account JSON cannot be uploaded as a file on Render, you have two options:

#### Option A: Environment Variable (Recommended)
1. Copy the entire content of your `firebase-service-account.json` file
2. In Render, add environment variable:
   ```
   FIREBASE_SERVICE_ACCOUNT=paste_entire_json_content_here
   ```
3. Update `backend/src/config/firebaseAdmin.js` to use this environment variable

#### Option B: Use Firebase Admin with Credentials
Add individual Firebase credentials as environment variables:
```
FIREBASE_PROJECT_ID=mobileotp-990c7
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mobileotp-990c7.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### 4. Build Configuration

The `render.yaml` file already contains:
```yaml
buildCommand: cd backend && npm install
startCommand: cd backend && npm start
```

Render will:
1. Navigate to `backend/` directory
2. Run `npm install` to install dependencies
3. Start server with `npm start` (runs `node src/server.js`)

### 5. Health Check Endpoint

The backend includes a health check at:
```
GET https://your-app.onrender.com/health
```

This endpoint checks:
- Server status
- MongoDB connection
- Memory usage

### 6. CORS Configuration

Update CORS origins in `backend/src/index.js` to include your Render URL:
```javascript
origin: [
  'https://your-render-url.onrender.com',
  'https://fluteon.com',
  'https://www.fluteon.com',
  // ... other origins
]
```

### 7. MongoDB Atlas IP Whitelist

1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Access List
3. Add Render's IP or use `0.0.0.0/0` (allow all)

### 8. Deploy

1. Click **Create Web Service**
2. Render will automatically build and deploy
3. Monitor logs for any errors
4. Visit your app URL once deployed

## 🔧 Troubleshooting

### Build Fails with "Cannot find package.json"
✅ Fixed by `render.yaml` - it navigates to `backend/` directory first

### Firebase Admin SDK Initialization Failed
- Ensure `FIREBASE_SERVICE_ACCOUNT` environment variable is set
- Or add individual Firebase credentials (project_id, client_email, private_key)

### MongoDB Connection Error
- Check MongoDB Atlas connection string
- Verify IP whitelist includes Render's IPs
- Ensure database user has correct permissions

### Port Already in Use
- Don't set PORT in environment variables, Render assigns it automatically
- Or set `PORT=10000` (Render's default)

## 📝 Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Health check endpoint returns 200
- [ ] MongoDB connection working
- [ ] Firebase mobile OTP working
- [ ] Email OTP working (Brevo)
- [ ] Image upload working (Cloudinary)
- [ ] Payment gateway working (Razorpay)
- [ ] CORS allows your frontend domains
- [ ] Update frontend `REACT_APP_API_BASE_URL` to Render URL

## 🔄 Auto-Deploy

The `render.yaml` includes `autoDeploy: true`, so Render will automatically deploy when you push to the `main` branch.

## 📊 Monitoring

- Check Render logs for errors
- Monitor `/health` endpoint
- Set up alerts in Render dashboard
- Use MongoDB Atlas monitoring for database performance

---

**Need Help?**
- [Render Documentation](https://render.com/docs)
- [Deploy Node.js Apps](https://render.com/docs/deploy-node-express-app)
