import { Request, Response } from "express";
import { db } from "../config/firebase-config";

export const createEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, calories, weight, date } = req.body;

  // Simple validation
  if (!userId || !calories || !weight || !date) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  try {
    const newEntry = await db.collection("entries").add({
      userId,
      calories: Number(calories),
      weight: Number(weight),
      date,
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

  if (!userId) {
    res.status(400).json({ error: "Missing userId parameter." });
    return;
  }

  try {
    const snapshot = await db
      .collection("entries")
      .where("userId", "==", userId)
      .get();
    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(entries);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: message });
  }
};
