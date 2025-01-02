import { Request, Response } from "express";
import { FieldValue, db } from "../config/firebase-config";
import bcrypt from "bcryptjs";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("🟢 Incoming request body:", req.body);

  const {
    name,
    email,
    password,
    age,
    weight,
    height,
    sex,
    activityLevel,
    acceptNotifications,
  } = req.body;
  const { uid: firebaseUid } = res.locals.user; // Extract UID from decoded token

  try {
    console.log("🔍 Decoded Token UID:", firebaseUid);
    console.log("🔍 Request Body Email:", email);
    console.log("🔍 Checking if user already exists in Firestore...");
    const userDoc = db.collection("users").doc(firebaseUid);
    const existingUser = await userDoc.get();

    if (existingUser.exists) {
      console.log(
        `⚠️ User already exists in Firestore. UID=${firebaseUid}, Email=${email}`
      );
      res
        .status(400)
        .json({ message: "A user with this account already exists." });
      return;
    }

    console.log("🔒 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("⚖️ Calculating calorie target...");
    const activityMultiplierMap: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const multiplier = activityMultiplierMap[activityLevel];
    if (!multiplier) {
      res.status(400).json({ message: "Invalid activity level provided." });
      return;
    }

    const bmr =
      sex === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const calorieTarget = Math.round(bmr * multiplier - 500);

    // Macros calculation
    const proteins = Math.round((calorieTarget * 0.25) / 4);
    const carbs = Math.round((calorieTarget * 0.5) / 4);
    const fats = Math.round((calorieTarget * 0.25) / 9);

    console.log("🗂️ Saving user details to Firestore...");
    await userDoc.set({
      name,
      email,
      password: hashedPassword,
      age,
      weight,
      height,
      sex,
      activityLevel,
      calorieTarget,
      acceptNotifications,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log("✅ User details saved to Firestore!");

    console.log("📦 Creating initial entry in 'entries' collection...");
    const today = new Date().toISOString().split("T")[0];
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

    console.log("✅ Initial entry created successfully!");

    res.status(201).json({
      message: "User registered successfully.",
      calorieTarget,
      proteins,
      carbs,
      fats,
    });
  } catch (error: any) {
    console.error("❌ Error during registration:", error.message);
    res.status(500).json({ message: "Failed to register user." });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { uid: firebaseUid } = res.locals.user;

  try {
    console.log("🔍 Fetching user from Firestore with UID:", firebaseUid);
    const userDoc = await db.collection("users").doc(firebaseUid).get();

    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const userData = userDoc.data();
    if (!userData) {
      res.status(500).json({ message: "Failed to retrieve user data." });
      return;
    }

    console.log("✅ User data retrieved:", userData);

    res.status(200).json({
      message: "Login successful",
      user: {
        name: userData.name,
        weight: userData.weight,
        calorieTarget: userData.calorieTarget,
      },
    });
  } catch (error: any) {
    console.error("❌ Error during login:", error.message);
    res.status(500).json({ message: "Failed to login." });
  }
};
