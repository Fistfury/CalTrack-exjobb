import { createContext, useState, useEffect, useCallback } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { UserContextType, User } from "../types/UserTypes";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  const isLoggedIn = () => !!user;

  const logout = async () => {
    console.log("🔒 Logging out...");
    await auth.signOut();
    window.location.href = "/";
    setUser(null);
    console.log("✅ User logged out, context cleared.");
  };

  const fetchUserData = useCallback(
    async (uid: string, retries: number = 5): Promise<void> => {
      if (retries <= 0) {
        console.error(
          `❌ Max retries reached. Could not fetch Firestore document for UID: ${uid}`
        );
        setUser(null);
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
            name: userData.name,
            weight: userData.weight,
            calorieTarget: userData.calorieTarget,
          });
        } else {
          console.warn(
            `⚠️ Firestore document not found. Retrying... Attempts left: ${
              retries - 1
            }`
          );
          setTimeout(() => fetchUserData(uid, retries - 1), 1000); // Retry after 1 second
        }
      } catch (error) {
        console.error(
          "❌ Error fetching user data from Firestore:",
          (error as Error).message
        );
        setUser(null);
      }
    },
    []
  );

  // Include fetchUserData in the dependency array
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("🔑 User logged in:", currentUser.uid);
        fetchUserData(currentUser.uid).finally(() => setLoading(false));
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
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
