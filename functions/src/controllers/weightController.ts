import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebase-config";
import { calculateMacros } from "../utils/calculationHelpers";
import { validateUserData } from "../utils/validateUserData";

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
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const rawUserData = userDoc.data();
    if (!rawUserData) {
      res.status(500).json({ message: "User data retrieval failed." });
      return;
    }

    // Validate and cast Firestore data to UserData type
    const userData = validateUserData(rawUserData);

    // Calculate macros
    const { calorieTarget, proteins, carbs, fats } = calculateMacros(
      userData,
      weight
    );

    await userRef.update({
      weight,
      calorieTarget,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const today = new Date().toISOString().split("T")[0];
    const entrySnapshot = await db
      .collection("entries")
      .where("userId", "==", firebaseUid)
      .where("date", "==", today)
      .get();

    if (!entrySnapshot.empty) {
      const entryId = entrySnapshot.docs[0].id;

      await db.collection("entries").doc(entryId).update({
        weight,
        calories: calorieTarget,
        proteins,
        carbs,
        fats,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      await db.collection("entries").add({
        userId: firebaseUid,
        date: today,
        weight,
        calories: calorieTarget,
        proteins,
        carbs,
        fats,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    res.status(200).json({
      message: "Weight updated successfully.",
      calorieTarget,
      proteins,
      carbs,
      fats,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error updating weight:", error.message);
    } else {
      console.error("❌ Error updating weight:", error);
    }
    res.status(500).json({ message: "Failed to update weight." });
  }
};
