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

  const token = authHeader.split(" ")[1];
  console.log("🔑 Received Authorization Token:", token);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Decoded Token:", decodedToken);

    res.locals.user = decodedToken; // Attach the token payload
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error verifying token:", error.message);
    } else {
      console.error("❌ Error verifying token:", error);
    }
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
