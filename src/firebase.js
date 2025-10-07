// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // ✅ import Auth
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC2OiGBNFytOG-F3JmNGwW9Q37BeCP_uNE",
  authDomain: "senior-design-c9318.firebaseapp.com",
  projectId: "senior-design-c9318",
  storageBucket: "senior-design-c9318.firebasestorage.app",
  messagingSenderId: "335588012358",
  appId: "1:335588012358:web:f4c14d2ef559713f40b547",
  measurementId: "G-HYGRMZH1PC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth
export const auth = getAuth(app);
export default app;
