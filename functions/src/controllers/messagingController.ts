import { Request, Response } from "express";
import { db } from "../config/firebase-config";

export const saveFcmToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fcmToken } = req.body;
  const { uid } = res.locals.user;

  if (!fcmToken) {
    res.status(400).json({ message: "FCM token is required." });
    return;
  }

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.set({ fcmToken }, { merge: true });

    res.status(200).json({ message: "FCM token saved successfully." });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    res.status(500).json({ message: "Failed to save FCM token." });
  }
};
