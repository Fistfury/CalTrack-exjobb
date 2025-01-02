import { jwtDecode } from "jwt-decode";
import { auth } from "../config/firebaseConfig";
import { JwtPayload } from "../types/UtilsTypes";

// Refresh the current token
export const refreshToken = async (): Promise<string> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No user is logged in. Cannot refresh token.");
    throw new Error("No user is logged in");
  }

  console.log("Refreshing token...");
  return await currentUser.getIdToken(true); // Force token refresh
};

// Verify and decode the token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    console.log("✅ Token verified and decoded:", decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("❌ Invalid or expired token:", error);
    return null;
  }
};
