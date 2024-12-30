import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebase-config";
import { entrySchema, querySchema } from "../schemas/entrySchema";

// Create a new entry
export const createEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body using entrySchema
    const parsedData = entrySchema.parse(req.body);
    const { userId, calories, weight, date } = parsedData;

    // Check if entry for the same date already exists
    const existingEntry = await db
      .collection("entries")
      .where("userId", "==", userId)
      .where("date", "==", date)
      .get();

    if (!existingEntry.empty) {
      res.status(400).json({ error: "Entry already exists for this date." });
      return;
    }

    // Add the new entry
    const newEntry = await db.collection("entries").add({
      userId,
      calories,
      weight,
      date,
      createdAt: FieldValue.serverTimestamp(),
    });

    res
      .status(201)
      .json({ message: "Entry created successfully", id: newEntry.id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "ZodError") {
        res
          .status(400)
          .json({ error: "Validation failed", details: error.message });
      } else {
        console.error("Error creating entry:", error.message);
        res.status(500).json({ error: "Failed to create entry" });
      }
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Fetch entries for a specific user
export const getEntries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = querySchema.parse(req.query); // Validate query params

    let query = db.collection("entries").where("userId", "==", userId);

    if (startDate && endDate) {
      query = query.where("date", ">=", startDate).where("date", "<=", endDate);
    }

    const snapshot = await query.get();

    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate average weight
    const totalWeight = entries.reduce(
      (sum, entry: any) => sum + entry.weight,
      0
    );
    const averageWeight = entries.length
      ? (totalWeight / entries.length).toFixed(1)
      : 0;

    res.status(200).json({ entries, averageWeight });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch entries.";
    res.status(500).json({ error: message });
  }
};

// Fetch weekly summary and entries
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
      res.status(200).json({ entries: [], weeklySummary: null });
      return;
    }

    const entries = snapshot.docs.map((doc) => doc.data());
    const totalCalories = entries.reduce(
      (sum, entry) => sum + entry.calories,
      0
    );
    const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);

    const weeklySummary = {
      avgCalories: totalCalories / entries.length,
      avgWeight: totalWeight / entries.length,
      proteins: (totalCalories * 0.25) / 4, // 25% from proteins
      carbs: (totalCalories * 0.5) / 4, // 50% from carbs
      fats: (totalCalories * 0.25) / 9, // 25% from fats
    };

    res.status(200).json({ entries, weeklySummary });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch weekly summary.";
    res.status(500).json({ error: message });
  }
};
