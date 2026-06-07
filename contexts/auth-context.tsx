"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserRole, setUserRole, UserRole, ROLE_REDIRECTS } from "@/lib/roles";
import { useRouter } from "next/navigation";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (role: UserRole) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userRole = await getUserRole(firebaseUser.uid);
        setRoleState(userRole);
      } else {
        setRoleState(null);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user already has a role
    const existingRole = await getUserRole(user.uid);
    
    if (!existingRole) {
      // New user - they'll need to select a role on the next screen
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      // Existing user - redirect based on role
      router.push(ROLE_REDIRECTS[existingRole]);
    }
  }

  async function setRole(role: UserRole) {
    if (!user) return;
    await setUserRole(user.uid, role);
    setRoleState(role);
    router.push(ROLE_REDIRECTS[role]);
  }

  async function signOut() {
    await firebaseSignOut(auth);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, role, signInWithGoogle, signOut, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}