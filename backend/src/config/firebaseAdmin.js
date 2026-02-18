const admin = require('firebase-admin');
require('dotenv').config();

// Firebase Admin initialization
// You'll need to download the service account key from Firebase Console
// Firebase Console → Project Settings → Service Accounts → Generate New Private Key
// Save as firebase-service-account.json in backend/backend/src/config/

let firebaseAdmin = null;

try {
  // Try to load the service account key
  const serviceAccount = require('./firebase-service-account.json');
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseAdmin = admin;
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.log('⚠️ Firebase Admin not initialized - service account key missing');
  console.log('📝 To enable mobile OTP verification:');
  console.log('   1. Go to Firebase Console → Project Settings → Service Accounts');
  console.log('   2. Click "Generate New Private Key"');
  console.log('   3. Save as firebase-service-account.json in backend/backend/src/config/');
  console.log('   Note: Mobile OTP will work without this, but verification will be client-side only');
}

module.exports = firebaseAdmin || { auth: () => ({ verifyIdToken: async () => ({}) }) };
