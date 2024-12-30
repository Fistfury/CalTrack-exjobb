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

    res.status(200).json(userDoc.data());
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
    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (weight) updates.weight = parseFloat(weight);
    if (averageWeight) updates.averageWeight = parseFloat(averageWeight);

    await userRef.update(updates);

    res.status(200).json({ message: "User updated successfully." });
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Failed to update user." });
  }
};
