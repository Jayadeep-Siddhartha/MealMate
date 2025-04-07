"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";

const AuthContext = createContext<{ user: User | null }>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase user changed:", firebaseUser); // ✅ Debug
      setUser(firebaseUser);
      setLoading(false);

      const isLoginPage = pathname === "/login";

      if (firebaseUser && isLoginPage) {
        router.push("/dashboard");
      } else if (!firebaseUser && !isLoginPage) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) return null; // Optional: spinner, skeleton, etc.

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
