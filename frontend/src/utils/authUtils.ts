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

  return await currentUser.getIdToken(true); // Force token refresh
};

// Verify and decode the token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);

    return decodedToken;
  } catch (error) {
    console.error("❌ Invalid or expired token:", error);
    return null;
  }
};
// Retrieve the userId from the current token
export const getUserIdFromToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("❌ No user is logged in.");
    return null;
  }

  try {
    const token = await currentUser.getIdToken();
    const decodedToken = verifyToken(token); // Decode the token
    return decodedToken?.sub || null; // Return the userId (sub)
  } catch (error) {
    console.error("❌ Failed to retrieve userId from token:", error);
    return null;
  }
};
