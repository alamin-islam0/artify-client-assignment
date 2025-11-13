import { createContext, useContext, useEffect, useState } from "react";
import app from "../firebase/config";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  const googleLogin = () => signInWithPopup(auth, new GoogleAuthProvider());
  const emailLogin = (e, p) => signInWithEmailAndPassword(auth, e, p);
  const register = async ({ name, email, password, photoURL }) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL });
  };
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, loading, googleLogin, emailLogin, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
