const admin = require('firebase-admin');
require('dotenv').config();

// Firebase Admin initialization
// Supports two methods:
// 1. Environment variable: FIREBASE_SERVICE_ACCOUNT (JSON string) - for Render/production
// 2. Local file: firebase-service-account.json - for local development

let firebaseAdmin = null;

try {
  let serviceAccount;

  // Method 1: Try loading from environment variable (Production/Render)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('🔑 Loaded Firebase credentials from environment variable');
    } catch (parseError) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env variable');
      throw parseError;
    }
  }
  // Method 2: Try loading from environment variables individually
  else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle escaped newlines
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };
    console.log('🔑 Loaded Firebase credentials from individual environment variables');
  }
  // Method 3: Load from local file (Development)
  else {
    serviceAccount = require('./firebase-service-account.json');
    console.log('🔑 Loaded Firebase credentials from local file');
  }
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseAdmin = admin;
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.log('⚠️ Firebase Admin not initialized - credentials missing');
  console.log('📝 To enable mobile OTP verification, use one of these methods:');
  console.log('');
  console.log('   METHOD 1 - Environment Variable (Recommended for Production):');
  console.log('   Set FIREBASE_SERVICE_ACCOUNT with the entire JSON content');
  console.log('');
  console.log('   METHOD 2 - Individual Environment Variables:');
  console.log('   FIREBASE_PROJECT_ID=your-project-id');
  console.log('   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com');
  console.log('   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n');
  console.log('');
  console.log('   METHOD 3 - Local File (Development):');
  console.log('   Download from Firebase Console → Project Settings → Service Accounts');
  console.log('   Save as: backend/backend/src/config/firebase-service-account.json');
  console.log('');
  console.log('⚠️ Note: Mobile OTP verification will NOT work without Firebase Admin');
}

module.exports = firebaseAdmin || { auth: () => ({ verifyIdToken: async () => ({}) }) };
