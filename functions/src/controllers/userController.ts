import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebase-config";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { uid: firebaseUid } = res.locals.user; // Extract UID from decoded token

  // Trim any whitespace or newline characters
  const sanitizedUserId = userId.trim();
  const sanitizedFirebaseUid = firebaseUid.trim();

  console.log("🔍 Trimmed userId:", sanitizedUserId);
  console.log("🔍 Trimmed firebaseUid:", sanitizedFirebaseUid);

  // Check if the userId matches the firebaseUid
  if (sanitizedUserId !== sanitizedFirebaseUid) {
    console.error(
      `❌ Unauthorized access. Trimmed UserId: ${sanitizedUserId}, FirebaseUid: ${sanitizedFirebaseUid}`
    );
    res.status(403).json({ message: "Unauthorized access." });
    return;
  }

  try {
    // Fetch user document from Firestore
    const userDoc = await db.collection("users").doc(sanitizedUserId).get();

    if (!userDoc.exists) {
      console.log(`❌ User with ID ${sanitizedUserId} not found.`);
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Respond with user data
    res.status(200).json(userDoc.data());
  } catch (error: any) {
    console.error("❌ Error fetching user:", error.message);
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { uid: firebaseUid } = res.locals.user;
  const sanitizedUserId = userId.trim();
  const sanitizedFirebaseUid = firebaseUid.trim();

  if (sanitizedUserId !== sanitizedFirebaseUid) {
    console.error(
      `❌ Unauthorized update attempt. Trimmed UserId: ${sanitizedUserId}, FirebaseUid: ${sanitizedFirebaseUid}`
    );
    res.status(403).json({ message: "Unauthorized access." });
    return;
  }

  try {
    const userRef = db.collection("users").doc(sanitizedUserId);
    await userRef.update(req.body);

    res.status(200).json({ message: "User updated successfully." });
  } catch (error: any) {
    console.error("❌ Error updating user:", error.message);
    res.status(500).json({ message: "Failed to update user." });
  }
};
