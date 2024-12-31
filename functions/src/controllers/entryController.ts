import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebase-config";
import { entrySchema } from "../schemas/entrySchema";

// Create or Update Entry
export const createOrUpdateEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uid: firebaseUid } = res.locals.user;
    const parsedData = entrySchema.parse(req.body);
    const { weight, date } = parsedData;

    console.log(
      `🟢 Starting createOrUpdateEntry for UID=${firebaseUid}, Date=${date}, Weight=${weight}`
    );

    // Fetch user data
    const userRef = db.collection("users").doc(firebaseUid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error(`❌ User not found for UID=${firebaseUid}`);
      res.status(404).json({ error: "User not found." });
      return;
    }

    const userData = userDoc.data();
    if (!userData) {
      console.error(`❌ User data is undefined for UID=${firebaseUid}`);
      res.status(500).json({ error: "User data is undefined." });
      return;
    }

    console.log(`📊 User Data Retrieved for UID=${firebaseUid}:`, userData);

    const { age, height, sex, activityLevel } = userData;

    if (!age || !height || !sex || !activityLevel) {
      console.error(
        `❌ Missing required user attributes for UID=${firebaseUid}:`,
        userData
      );
      res.status(500).json({ error: "User attributes are incomplete." });
      return;
    }

    // Calculate calorie target and macros
    const activityMultiplierMap: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const multiplier = activityMultiplierMap[activityLevel];
    const bmr =
      sex === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const calorieTarget = Math.round(bmr * multiplier - 500);
    const proteins = Math.round((calorieTarget * 0.25) / 4);
    const carbs = Math.round((calorieTarget * 0.5) / 4);
    const fats = Math.round((calorieTarget * 0.25) / 9);

    console.log(
      `📊 Calculated Macros for UID=${firebaseUid}:`,
      JSON.stringify({
        calorieTarget,
        proteins,
        carbs,
        fats,
      })
    );

    // Check if an entry already exists for the specified date
    const existingEntrySnapshot = await db
      .collection("entries")
      .where("userId", "==", firebaseUid)
      .where("date", "==", date)
      .get();

    if (!existingEntrySnapshot.empty) {
      const entryId = existingEntrySnapshot.docs[0].id;
      console.log(`📦 Updating existing entry with ID=${entryId}`);
      await db.collection("entries").doc(entryId).update({
        weight,
        calories: calorieTarget,
        proteins,
        carbs,
        fats,
        updatedAt: FieldValue.serverTimestamp(),
      });

      res.status(200).json({ message: "Entry updated successfully", entryId });
      return;
    }

    console.log("📄 Creating new entry...");
    const newEntry = await db.collection("entries").add({
      userId: firebaseUid,
      weight,
      date,
      calories: calorieTarget,
      proteins,
      carbs,
      fats,
      createdAt: FieldValue.serverTimestamp(),
    });

    res
      .status(201)
      .json({ message: "Entry created successfully", id: newEntry.id });
  } catch (error) {
    console.error("❌ Error in createOrUpdateEntry:", error);
    res.status(500).json({ error: "Failed to create or update entry." });
  }
};
// Add Entry
export const addEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid: firebaseUid } = res.locals.user;
    const { day, weight } = req.body;

    console.log(
      `🟢 Adding entry for UID=${firebaseUid}, Day=${day}, Weight=${weight}`
    );

    if (!day || typeof weight !== "number") {
      console.error("❌ Day and weight are required.");
      res.status(400).json({ error: "Day and weight are required." });
      return;
    }

    // Fetch user data
    const userRef = db.collection("users").doc(firebaseUid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error(`❌ User not found for UID=${firebaseUid}`);
      res.status(404).json({ error: "User not found." });
      return;
    }

    const userData = userDoc.data();
    if (!userData) {
      console.error(`❌ User data is undefined for UID=${firebaseUid}`);
      res.status(500).json({ error: "User data is undefined." });
      return;
    }

    console.log(`📊 User Data Retrieved: ${JSON.stringify(userData)}`);

    const { age, height, sex, activityLevel } = userData;

    if (!age || !height || !sex || !activityLevel) {
      console.error(
        `❌ Missing required user attributes for UID=${firebaseUid}: ${JSON.stringify(
          userData
        )}`
      );
      res.status(500).json({ error: "User attributes are incomplete." });
      return;
    }

    // Calculate calorie target and macros
    const activityMultiplierMap: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const multiplier = activityMultiplierMap[activityLevel];
    const bmr =
      sex === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const calorieTarget = Math.round(bmr * multiplier - 500);
    const proteins = Math.round((calorieTarget * 0.25) / 4);
    const carbs = Math.round((calorieTarget * 0.5) / 4);
    const fats = Math.round((calorieTarget * 0.25) / 9);

    console.log(
      `📊 Calculated Macros for Entry: ${JSON.stringify({
        calorieTarget,
        proteins,
        carbs,
        fats,
      })}`
    );

    // Map day to a date
    const currentDate = new Date();
    const dayIndex = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].indexOf(day);
    const entryDate = new Date(
      currentDate.setDate(
        currentDate.getDate() - currentDate.getDay() + dayIndex
      )
    )
      .toISOString()
      .split("T")[0];

    console.log(`📅 Mapped Date for Day=${day}: ${entryDate}`);

    const existingEntry = await db
      .collection("entries")
      .where("userId", "==", firebaseUid)
      .where("date", "==", entryDate)
      .get();

    if (!existingEntry.empty) {
      console.warn(`⚠️ An entry for ${day} already exists.`);
      res.status(400).json({ error: `An entry for ${day} already exists.` });
      return;
    }

    console.log("📄 Creating new entry...");
    await db.collection("entries").add({
      userId: firebaseUid,
      weight,
      date: entryDate,
      calories: calorieTarget,
      proteins,
      carbs,
      fats,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: `Entry added for ${day}` });
  } catch (error: unknown) {
    console.error("❌ Error adding entry:", error);
    res.status(500).json({ error: "Failed to add entry." });
  }
};

// Fetch Entries for a Specific User
export const getEntries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    console.log(`🟢 Fetching entries for userId=${userId}`);

    const query = db.collection("entries").where("userId", "==", userId);
    const snapshot = await query.get();

    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📦 Fetched Entries for userId=${userId}:`, entries);

    res.status(200).json({ entries });
  } catch (error: unknown) {
    console.error("❌ Error in getEntries:", error);
    res.status(500).json({ error: "Failed to fetch entries." });
  }
};

// Fetch Weekly Summary and Entries
export const getEntriesSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid: firebaseUid } = res.locals.user;

  try {
    console.log(`🟢 Fetching weekly summary for UID=${firebaseUid}`);

    const snapshot = await db
      .collection("entries")
      .where("userId", "==", firebaseUid)
      .get();

    if (snapshot.empty) {
      console.warn(`⚠️ No entries found for UID=${firebaseUid}`);
      res.status(200).json({ entries: [], weeklySummary: null });
      return;
    }

    const entries = snapshot.docs.map((doc) => doc.data());
    console.log(`📦 Retrieved Entries for UID=${firebaseUid}:`, entries);

    const validEntries = entries.filter(
      (entry: any) =>
        typeof entry.calories === "number" && typeof entry.weight === "number"
    );

    if (!validEntries.length) {
      console.warn(`⚠️ No valid entries for UID=${firebaseUid}`);
      res.status(200).json({ entries: [], weeklySummary: null });
      return;
    }

    const totalCalories = validEntries.reduce(
      (sum, entry: any) => sum + entry.calories,
      0
    );
    const totalWeight = validEntries.reduce(
      (sum, entry: any) => sum + entry.weight,
      0
    );

    const weeklySummary = {
      avgCalories: totalCalories / validEntries.length,
      avgWeight: totalWeight / validEntries.length,
      proteins: (totalCalories * 0.25) / 4,
      carbs: (totalCalories * 0.5) / 4,
      fats: (totalCalories * 0.25) / 9,
    };

    console.log(`📊 Weekly Summary for UID=${firebaseUid}:`, weeklySummary);

    res.status(200).json({ entries: validEntries, weeklySummary });
  } catch (error: unknown) {
    console.error("❌ Error in getEntriesSummary:", error);
    res.status(500).json({ error: "Failed to fetch weekly summary." });
  }
};
