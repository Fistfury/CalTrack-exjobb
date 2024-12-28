import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebase-config";

export const createEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, calories, weight, date } = req.body;

  if (!userId || !calories || !weight || !date) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  try {
    const existingEntry = await db
      .collection("entries")
      .where("userId", "==", userId)
      .where("date", "==", date)
      .get();

    if (!existingEntry.empty) {
      res.status(400).json({ error: "Entry already exists for this date." });
      return;
    }

    // Create new entry
    const newEntry = await db.collection("entries").add({
      userId,
      calories: Number(calories),
      weight: Number(weight),
      date, // Use the date from the frontend
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "Entry created", id: newEntry.id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: message });
  }
};

export const getEntries = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query; // Optional date range for filtering

  try {
    let query = db.collection("entries").where("userId", "==", userId);

    if (startDate && endDate) {
      query = query.where("date", ">=", startDate).where("date", "<=", endDate);
    }

    const snapshot = await query.get();

    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate logged dates and average weight
    const loggedDates = entries.map((entry: any) => entry.date);
    const averageWeight =
      entries.reduce((sum, entry: any) => sum + entry.weight, 0) /
      (entries.length || 1);

    res.status(200).json({
      entries,
      loggedDates,
      averageWeight: averageWeight.toFixed(1),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: message });
  }
};
