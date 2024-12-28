import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebase-config";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const userData = userDoc.data();
    res.status(200).json(userData);
  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { weight, averageWeight } = req.body;

  try {
    const userRef = db.collection("users").doc(userId);

    await userRef.update({
      weight,
      averageWeight,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "User updated successfully." });
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Failed to update user." });
  }
};

export const updateWeight = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid: firebaseUid } = res.locals.user;
  const { weight } = req.body;

  if (!weight || typeof weight !== "number") {
    res.status(400).json({ message: "Weight must be a valid number." });
    return;
  }

  try {
    console.log("🔍 Fetching user from Firestore with UID:", firebaseUid);
    const userRef = db.collection("users").doc(firebaseUid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    console.log("⚖️ Updating user weight...");
    await userRef.update({
      weight,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log("✅ Weight updated successfully!");
    res.status(200).json({ message: "Weight updated successfully." });
  } catch (error: any) {
    console.error("❌ Error updating weight:", error.message);
    res.status(500).json({ message: "Failed to update weight." });
  }
};
