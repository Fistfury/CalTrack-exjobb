import { Request, Response } from "express";
import { auth, FieldValue, db } from "../config/firebase-config";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, age, weight, length, fitnessGoals } = req.body;

  console.log("🟢 Incoming request body:", {
    name,
    email,
    password,
    age,
    weight,
    length,
    fitnessGoals,
  });

  try {
    console.log("🟢 Starting user registration process...");

    // Validate fields
    if (!name || !email || !password) {
      console.log("❌ Missing required fields.");
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    console.log("🔍 Checking if user already exists...");
    let existingUser;
    try {
      existingUser = await auth.getUserByEmail(email);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        console.log("✅ User does not exist. Proceeding...");
      } else {
        console.error("❌ Error checking user:", err.message);
        res.status(500).json({ message: "Error checking user." });
        return;
      }
    }

    if (existingUser) {
      console.log("❌ User already exists:", email);
      res.status(400).json({ message: "User already exists." });
      return;
    }

    console.log("🛠️ Creating user in Firebase Authentication...");
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });
    console.log("✅ User created successfully:", userRecord.uid);

    console.log("🗂️ Saving user details to Firestore...");
    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      age,
      weight,
      length,
      fitnessGoals,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log("✅ User details saved to Firestore!");

    res
      .status(201)
      .json({ message: "User registered successfully.", uid: userRecord.uid });
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
