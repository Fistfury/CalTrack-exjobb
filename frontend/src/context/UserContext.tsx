import React, { createContext, useState, useEffect, useCallback } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { verifyToken } from "../utils/authUtils";
import {
  saveToLocalStorageWithExpiry,
  removeFromLocalStorage,
} from "../utils/storageHelpers";
import { UserContextType, User } from "../types/UserTypes";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);

  const isLoggedIn = () => !!user;

  const logout = async () => {
    try {
      await signOut(auth);
      removeFromLocalStorage("firebaseToken");
      setUser(null);
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  const initializeToken = async (): Promise<string | null> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("❌ No user is logged in.");
        return null;
      }
      const token = await currentUser.getIdToken(true); // Force token refresh
      saveToLocalStorageWithExpiry("firebaseToken", token, 60 * 60 * 1000);
      return token;
    } catch (error) {
      console.error("❌ Failed to initialize token:", error);
      return null;
    }
  };

  const fetchUserData = useCallback(async (uid: string) => {
    setUserLoading(true);
    try {
      const userRef = doc(db, "users", uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as User;
        setUser({
          id: uid,
          name: userData.name || "Unknown",
          weight: userData.weight || 0,
          calorieTarget: userData.calorieTarget || 0,
        });
      } else {
        console.warn(`⚠️ User with UID ${uid} not found.`);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const token = await initializeToken();
          if (!token) {
            await logout();
            return;
          }
          const decodedToken = verifyToken(token);
          if (decodedToken?.sub) {
            await fetchUserData(decodedToken.sub);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error in onAuthStateChanged:", error);
        setUser(null);
      } finally {
        setAppLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        logout,
        loading: appLoading || userLoading,
      }}
    >
      {appLoading ? <p>Loading application...</p> : children}
    </UserContext.Provider>
  );
};

export { UserContext };
