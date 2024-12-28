import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebaseConfig"; // Import Firestore DB
import { doc, getDoc } from "firebase/firestore";

interface User {
  id: string;
  name: string;
  weight: number;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: () => boolean;
  logout: () => void;
  loading: boolean;
}

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

  const fetchUserData = async (uid: string) => {
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
        });
      } else {
        console.warn("⚠️ Retrying Firestore fetch for UID:", uid);
        setTimeout(() => fetchUserData(uid), 1000); // Retry after 1 second
      }
    } catch (error) {
      console.error(
        "❌ Error fetching user data from Firestore:",
        (error as Error).message
      );
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("🔑 User logged in:", currentUser.uid);
        fetchUserData(currentUser.uid).finally(() => setLoading(false)); // Fetch Firestore data and stop loading
      } else {
        console.log("❌ User is not logged in.");
        setUser(null); // Clear user context
        setLoading(false); // Stop loading
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoggedIn, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
