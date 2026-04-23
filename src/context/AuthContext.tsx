"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
          const userRef = doc(db, "users", user.uid);
          
          // BOOTSTRAP BYPASS: Enable admin status immediately for the provided UID
          const BOOTSTRAP_ADMIN_UID = "JFfgcLKDtTPDsHUxrmi5L7sLIom2";
          if (user.uid === BOOTSTRAP_ADMIN_UID) {
            setIsAdmin(true);
            // We still try to fetch/create profile, but admin is guaranteed
          }
          
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            setProfile(data);
            // Bootstrap UID always stays admin regardless of DB value
            const isAdminFromDB = data.role === "admin";
            setIsAdmin(isAdminFromDB || user.uid === BOOTSTRAP_ADMIN_UID);
          } else {
            // Create a default profile for new users (e.g. Google Sign-in)
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || "Artist",
              role: "customer",
              points: 0,
              storeCredit: 0,
              createdAt: Date.now()
            };
            
            try {
              await setDoc(userRef, newProfile);
              setProfile(newProfile);
              setIsAdmin(false);
            } catch (createError: any) {
              if (!createError.message?.includes("permissions")) {
                console.warn("Profile creation pending: User document not yet initialized.");
              }
              setProfile(null);
              // Keep isAdmin if bootstrap bypass was set
              if (user.uid !== BOOTSTRAP_ADMIN_UID) setIsAdmin(false);
            }
          }
        } catch (error: any) {
          if (error.message?.includes("permissions")) {
             // Non-obtrusive warning for developers/admins regarding rules
             console.warn("🔐 PMU SUPPLY SYSTEM: Firestore access is currently restricted by Security Rules. Please update your rules in the Firebase Console to enable profile synchronization.");
          } else {
             console.error("Firestore Profile Fetch Error:", error.message);
          }
          setProfile(null);
          // Don't reset isAdmin here if it was already set by the bypass above
          if (user.uid !== "JFfgcLKDtTPDsHUxrmi5L7sLIom2") {
            setIsAdmin(false);
          }
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // Profile creation is handled automatically in the onAuthStateChanged effect above
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
