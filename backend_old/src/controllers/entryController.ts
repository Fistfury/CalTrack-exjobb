import { Request, Response } from "express";
import { db } from "../config/firebase-config";

export const createEntry = async (req: Request, res: Response) => {
  const { userId, calories, weight, date } = req.body;
  try {
    const newEntry = await db
      .collection("entries")
      .add({ userId, calories, weight, date });
    res.status(201).json({ message: "Entry created", id: newEntry.id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: message });
  }
};

export const getEntries = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const snapshot = await db
      .collection("entries")
      .where("userId", "==", userId)
      .get();
    const entries = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(entries);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: message });
  }
};
