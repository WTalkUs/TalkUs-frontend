// app/contexts/AuthProvider.tsx
"use client";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@lib/firebase"; // Asegúrate de exportar tu app desde aquí4

const AuthContext = createContext<{
  getIdToken(): unknown;
  user: User | null;
  loading: boolean;
}>({
  getIdToken: () => Promise.resolve(),
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getIdToken = useCallback(async () => {
    if (user) {
      return user.getIdToken();
    }
    return null;
  }, [user]);

  const value = useMemo(
    () => ({ user, loading, getIdToken }),
    [user, loading, getIdToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
