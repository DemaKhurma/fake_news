// Firebase initialization (shared across pages)
// Replace the placeholder values with your Firebase project config
// from Firebase Console → Project settings → General → Your apps → Web app

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";

export const firebaseConfig = {
  
    apiKey: "AIzaSyCBHUJ5VMwhQMIpNQnVgweAh10rj-bzn0A",
    authDomain: "fake-new-explorerr.firebaseapp.com",
    projectId: "fake-new-explorerr",
    storageBucket: "fake-new-explorerr.firebasestorage.app",
    messagingSenderId: "803307691171",
    appId: "1:803307691171:web:141b6d2dcb40878f603316",
    measurementId: "G-DVWJVTY8XM"
  };
// Ensure we initialize only once, even if imported on multiple pages
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Example: import and init other services where needed in page scripts
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
export const db = getFirestore(app);


