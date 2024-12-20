import { Request, Response } from "express";
import { FieldValue, db, auth } from "../config/firebase-config";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("🟢 Incoming request body:", req.body);
  const { firebaseUid, name, email, age, weight, length, fitnessGoals } =
    req.body;

  try {
    console.log("🟢 Starting user registration process...");

    // Validate fields
    if (!firebaseUid || !name || !email) {
      console.log("❌ Missing required fields.");
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

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
  const { email } = req.body;

  try {
    // Firebase Admin SDK cannot directly validate passwords
    // Authentication must occur client-side using Firebase Client SDK
    const user = await auth.getUserByEmail(email);

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Generate a custom token for the user
    const customToken = await auth.createCustomToken(user.uid);

    res.status(200).json({
      message: "Login successful",
      token: customToken,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
};
