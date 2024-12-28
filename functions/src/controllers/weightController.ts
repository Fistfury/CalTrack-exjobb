import { Request, Response } from "express";
import { FieldValue, db } from "../config/firebase-config";

// Fetch User Profile
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("❌ Error fetching user profile:", (error as Error).message);
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
};

// Update User Weight
export const updateUserWeight = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { weight } = req.body;

  if (!weight) {
    res.status(400).json({ message: "Weight is required." });
    return;
  }

  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      weight: parseFloat(weight),
      updatedAt: FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: "Weight updated successfully." });
  } catch (error) {
    console.error("❌ Error updating weight:", (error as any).message);
    res.status(500).json({ message: "Failed to update weight." });
  }
};
