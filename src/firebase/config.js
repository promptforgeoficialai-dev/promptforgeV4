import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsohm8pMZ8AosW6JNnfYERGvh40qHCkvk",
  authDomain: "promptforgeoficial-92478.firebaseapp.com",
  projectId: "promptforgeoficial-92478",
  storageBucket: "promptforgeoficial-92478.firebasestorage.app",
  messagingSenderId: "639060004391",
  appId: "1:639060004391:web:533a54161ef62601238802",
  measurementId: "G-Y643D25EY7"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();