import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ Missing or malformed Authorization header");
    res.status(401).json({ message: "Unauthorized: Missing token" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Extract token from header
  console.log("🔑 Received Authorization Token:", token);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Decoded Token:", decodedToken);

    const currentTime = Math.floor(Date.now() / 1000);
    console.log("⏱️ Current Time:", currentTime);
    console.log("⏳ Token Expiration Time:", decodedToken.exp);

    if (decodedToken.exp < currentTime) {
      console.error("❌ Token has expired");
      res.status(401).json({ message: "Unauthorized: Token expired" });
      return;
    }

    res.locals.user = decodedToken; // Attach decoded token to res.locals
    next();
  } catch (error: any) {
    console.error("❌ Error verifying token:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
