import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASohm8pMZ8AosW6JNnfYERGvh4OqHCkvk",
  authDomain: "promptforgeoficial-92478.firebaseapp.com",
  projectId: "promptforgeoficial-92478",
  storageBucket: "promptforgeoficial-92478.firebasestorage.app",
  messagingSenderId: "639060004391",
  appId: "1:639060004391:web:c501b28306728a9d238802",
  measurementId: "G-77N1N1E82H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportaciones para el proyecto
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export { analytics };
export default app;