import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebase-config";

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
    const userRef = db.collection("users").doc(firebaseUid);

    await userRef.update({
      weight,
      updatedAt: FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Weight updated successfully." });
  } catch (error: any) {
    console.error("Error updating weight:", error.message);
    res.status(500).json({ message: "Failed to update weight." });
  }
};
