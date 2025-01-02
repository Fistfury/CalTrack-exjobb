import React, { createContext, useState, useEffect, useCallback } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { refreshToken, verifyToken } from "../utils/authUtils";
import {
  saveToLocalStorageWithExpiry,
  getFromLocalStorageWithExpiry,
  removeFromLocalStorage,
} from "../utils/storageHelpers";
import { UserContextType, User } from "../types/UserTypes";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = () => !!user;

  const logout = async () => {
    console.log("🔒 Logging out...");
    await signOut(auth);
    removeFromLocalStorage("firebaseToken");
    removeFromLocalStorage("token");
    setUser(null);
    console.log("✅ User logged out and token removed.");
  };

  const initializeToken = async () => {
    try {
      const currentToken =
        getFromLocalStorageWithExpiry<string>("firebaseToken");
      if (currentToken) {
        const decodedToken = verifyToken(currentToken);
        if (
          decodedToken &&
          decodedToken.exp &&
          decodedToken.exp * 1000 > Date.now()
        ) {
          console.log("✅ Token is still valid.");
          return;
        }
      }
      console.log("Refreshing token...");
      const newToken = await refreshToken();
      saveToLocalStorageWithExpiry("firebaseToken", newToken, 60 * 60 * 1000); // 1 hour TTL
    } catch (error) {
      console.error("Failed to refresh token on app start:", error);
    }
  };

  const fetchUserData = useCallback(
    async (uid: string, retries: number = 5): Promise<void> => {
      if (retries <= 0) {
        console.error(
          `❌ Max retries reached. Could not fetch Firestore document for UID: ${uid}`
        );
        setUser(null);
        setLoading(false); // Ensure loading is set to false on failure
        return;
      }

      try {
        const userRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as User;
          console.log("✅ Firestore document found:", userData);
          setUser({
            id: uid,
            name: userData.name || "No Name",
            weight: userData.weight || 0,
            calorieTarget: userData.calorieTarget || 0,
          });
          setLoading(false); // Successfully fetched data, stop loading
        } else {
          console.warn(
            `⚠️ Firestore document not found for UID=${uid}. Retrying... (${
              retries - 1
            } retries left)`
          );
          setTimeout(() => fetchUserData(uid, retries - 1), 3000);
        }
      } catch (error) {
        console.error(
          "❌ Error fetching user data from Firestore:",
          (error as Error).message
        );
        setUser(null);
        setLoading(false); // Stop loading even if there's an error
      }
    },
    []
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("🔑 User logged in:", currentUser.uid);
        await initializeToken();
        await fetchUserData(currentUser.uid);
      } else {
        console.log("❌ User is not logged in.");
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoggedIn, logout, loading }}
    >
      {loading ? <p>Loading user data...</p> : children}
    </UserContext.Provider>
  );
};

export { UserContext };
