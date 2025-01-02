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
  const [appLoading, setAppLoading] = useState(true); // Tracks the app's loading state
  const [userLoading, setUserLoading] = useState(false); // Tracks user data fetching

  const isLoggedIn = () => !!user;

  const logout = async () => {
    await signOut(auth);
    removeFromLocalStorage("firebaseToken");
    removeFromLocalStorage("token");
    setUser(null);
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
          return currentToken; // Return token only if valid
        }
      }
      console.log("Refreshing token...");
      const newToken = await refreshToken();
      saveToLocalStorageWithExpiry("firebaseToken", newToken, 60 * 60 * 1000);
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token on app start:", error);
      removeFromLocalStorage("firebaseToken"); // Clear invalid token
      return null; // Return null if token is invalid
    }
  };

  const fetchUserData = useCallback(
    async (uid: string, retries: number = 5): Promise<void> => {
      if (retries <= 0) {
        console.error(
          `❌ Max retries reached. Could not fetch Firestore document for UID: ${uid}`
        );
        setUser(null);
        setUserLoading(false); // Stop user loading if retries fail
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
      } finally {
        setUserLoading(false); // Stop user loading regardless of success or failure
      }
    },
    []
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("🔑 User logged in:", currentUser.uid);

        await initializeToken();

        const userRef = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          console.log("✅ Firestore document found:", userSnapshot.data());
          await fetchUserData(currentUser.uid);
        } else {
          console.warn(
            "⚠️ User document missing. Redirecting to registration."
          );
          setUser(null);
          setAppLoading(false);
        }
      } else {
        console.log("❌ User is not logged in.");
        setUser(null);
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
      {/* Show loading screen only during initial app load */}
      {appLoading ? <p>Loading application...</p> : children}
    </UserContext.Provider>
  );
};

export { UserContext };
