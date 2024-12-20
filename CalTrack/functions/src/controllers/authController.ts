import { Request, Response } from "express";
import { FieldValue, db, auth } from "../config/firebase-config";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("🟢 Incoming request body:", req.body);
  const { name, password, email, age, weight, length, fitnessGoals } = req.body;
  const { uid: firebaseUid } = res.locals.user; // Extract UID from decoded token

  try {
    console.log("🔍 Checking if user already exists...");
    const existingUser = await db.collection("users").doc(firebaseUid).get();
    if (existingUser.exists) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    console.log("🗂️ Saving user details to Firestore...");
    // Save the user data in Firestore
    await db.collection("users").doc(firebaseUid).set({
      name,
      email,
      password,
      age,
      weight,
      length,
      fitnessGoals,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log("✅ User details saved to Firestore!");

    res.status(201).json({ message: "User registered successfully." });
  } catch (error: any) {
    console.error("❌ Error during registration:", error.message);
    res.status(500).json({ message: "Failed to register user." });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { uid: firebaseUid } = res.locals.user; // Extract UID from decoded token

  try {
    console.log("🔍 Fetching user from Firestore with UID:", firebaseUid);
    const userDoc = await db.collection("users").doc(firebaseUid).get();

    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const userData = userDoc.data();
    console.log("✅ User data retrieved:", userData);
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error: any) {
    console.error("❌ Error during login:", error.message);
    res.status(500).json({ message: "Failed to login." });
  }
};
