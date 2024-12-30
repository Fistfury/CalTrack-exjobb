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

  let attempts = 3; // Retry attempts for transient failures
  while (attempts > 0) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log("✅ Decoded Token:", decodedToken);

      const { uid } = decodedToken;

      // Verify the user exists in Firebase Authentication
      const userRecord = await admin.auth().getUser(uid);
      if (!userRecord) {
        throw new Error("User record not found in Firebase Authentication");
      }

      res.locals.user = decodedToken; // Attach the token payload
      return next(); // Proceed to the next middleware
    } catch (error: any) {
      console.warn(
        `❌ Error verifying token (attempts left: ${attempts - 1}):`,
        error.message
      );

      // Retry for transient errors
      if (--attempts > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      } else {
        res
          .status(401)
          .json({ message: "Unauthorized: Invalid or expired token" });
        return;
      }
    }
  }
};
