import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '../firebase/config';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === "promptforge.oficial.ia@gmail.com";

  // Sincronización Automática con Firestore
  const syncUserToFirestore = async (firebaseUser) => {
    if (!firebaseUser) return;
    const userRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || "Usuario de Forja",
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL || "https://via.placeholder.com/150",
      lastAccess: serverTimestamp(),
    }, { merge: true });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        syncUserToFirestore(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginGoogle = () => signInWithPopup(auth, googleProvider);
  const loginEmail = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
  const registerEmail = (email, pass) => createUserWithEmailAndPassword(auth, email, pass);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, loginGoogle, loginEmail, registerEmail, resetPassword, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);