import { auth } from "../config/firebaseConfig";

export const refreshToken = async (): Promise<string> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    console.log("Refreshing token...");
    return await currentUser.getIdToken(true); // Force token refresh
  }
  throw new Error("No user is logged in");
};
