import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { auth } from '../config/firebaseClient';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        console.log("ID Token:", idToken);  // Log the token for inspection
        try {
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/login`, { idToken });
          console.log(response.data);
          setUser(response.data.user);
        } catch (error) {
          console.error("Login sync error:", error);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, name, phone) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await firebaseUser.getIdToken();
    console.log("Register ID Token:", idToken);  // Log the token for inspection
    await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/signup`, {
      idToken,
      name,
      email,
      phone
    });
  };

  const login = async (email, password) => {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await firebaseUser.getIdToken();   
    console.log("Login ID Token:", idToken);  // Log the token for inspection
    console.log("Login post entering");  // Log the token for inspection
    console.log("API URL:", process.env.EXPO_PUBLIC_API_BASE_URL);
    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/login`, { idToken });
    console.log("Login post leaving");  // Log the token for inspection
    console.log("Login response:", response);  // Log the token for inspection
    setUser(response.data.user);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
