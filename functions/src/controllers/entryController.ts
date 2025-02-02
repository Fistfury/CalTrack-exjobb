import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebase-config";
import { entrySchema } from "../schemas/entrySchema";
import {
  calculateMacros,
  calculateWeeklySummary,
} from "../utils/calculationHelpers";
import { validateUserData } from "../utils/validateUserData";

// Create or Update Entry
export const createOrUpdateEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uid: firebaseUid } = res.locals.user;

    // Validate and parse the incoming request body
    const parsedData = entrySchema.parse(req.body);
    const { weight, date, caloriesMet, achieved } = parsedData;

    // Fetch user document
    const userRef = db.collection("users").doc(firebaseUid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error(`❌ User not found for UID=${firebaseUid}`);
      res.status(404).json({ error: "User not found." });
      return;
    }

    const userData = validateUserData(userDoc.data()!);

    // Calculate macros based on weight
    const { calorieTarget, proteins, carbs, fats } = calculateMacros(
      userData,
      weight
    );

    // Use the provided `achieved` or fallback to comparing caloriesMet
    const isAchieved = achieved ?? !!caloriesMet;

    // Check if an entry for the given date already exists
    const existingEntrySnapshot = await db
      .collection("entries")
      .where("userId", "==", firebaseUid)
      .where("date", "==", date)
      .get();

    if (!existingEntrySnapshot.empty) {
      const entryId = existingEntrySnapshot.docs[0].id;

      await db.collection("entries").doc(entryId).update({
        weight,
        calories: calorieTarget,
        proteins,
        carbs,
        fats,
        achieved: isAchieved,
        updatedAt: FieldValue.serverTimestamp(),
      });

      res.status(200).json({ message: "Entry updated successfully" });
      return;
    }

    // Create a new entry

    const newEntry = await db.collection("entries").add({
      userId: firebaseUid,
      weight,
      date,
      calories: calorieTarget,
      proteins,
      carbs,
      fats,
      achieved: isAchieved,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: "Entry created successfully",
      id: newEntry.id,
    });
  } catch (error) {
    console.error("❌ Error in createOrUpdateEntry:", error);
    res.status(500).json({ error: "Failed to create or update entry." });
  }
};

// Fetch Weekly Summary
export const getEntriesSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid: firebaseUid } = res.locals.user;

  try {
    const snapshot = await db
      .collection("entries")
      .where("userId", "==", firebaseUid)
      .get();

    if (snapshot.empty) {
      console.warn("⚠️ No entries found for the user.");
      res.status(200).json({ entries: [], weeklySummary: null });
      return;
    }

    const entries = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId || "",
        date: data.date || "",
        weight: data.weight || 0,
        calories: data.calories || 0,
        achieved: data.achieved || false,
      };
    });

    // Use the helper function to calculate the weekly summary
    const weeklySummary = calculateWeeklySummary(entries);

    res.status(200).json({ entries, weeklySummary });
  } catch (error) {
    console.error("❌ Error in getEntriesSummary:", error);
    res.status(500).json({ error: "Failed to fetch weekly summary." });
  }
};
