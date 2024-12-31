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
    console.log(`🔍 Fetching user data for weight update: UID=${firebaseUid}`);
    const userRef = db.collection("users").doc(firebaseUid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error(`❌ User not found for UID=${firebaseUid}`);
      res.status(404).json({ message: "User not found." });
      return;
    }

    const userData = userDoc.data();
    if (!userData) {
      console.error(`❌ User data is undefined for UID=${firebaseUid}`);
      res.status(500).json({ message: "User data retrieval failed." });
      return;
    }

    const { age, height, sex, activityLevel } = userData;

    console.log(
      `📊 User Data Retrieved: ${JSON.stringify({
        age,
        height,
        sex,
        activityLevel,
      })}`
    );

    console.log("⚖️ Recalculating calorie target...");
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

    // Macros calculation
    const proteins = Math.round((calorieTarget * 0.25) / 4);
    const carbs = Math.round((calorieTarget * 0.5) / 4);
    const fats = Math.round((calorieTarget * 0.25) / 9);

    console.log(
      `📊 Updated Calorie Target and Macros: ${JSON.stringify({
        calorieTarget,
        proteins,
        carbs,
        fats,
      })}`
    );

    console.log("🗂️ Updating user weight and calorie target...");
    await userRef.update({
      weight,
      calorieTarget,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log("📦 Updating today's entry...");
    const today = new Date().toISOString().split("T")[0];
    const entrySnapshot = await db
      .collection("entries")
      .where("userId", "==", firebaseUid)
      .where("date", "==", today)
      .get();

    if (!entrySnapshot.empty) {
      const entryId = entrySnapshot.docs[0].id;
      console.log(`📝 Updating existing entry for today: EntryID=${entryId}`);
      await db.collection("entries").doc(entryId).update({
        weight,
        calories: calorieTarget,
        proteins,
        carbs,
        fats,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      console.log("📄 No entry found for today, creating a new entry...");
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
  } catch (error: any) {
    console.error("❌ Error updating weight:", error.message);
    res.status(500).json({ message: "Failed to update weight." });
  }
};
