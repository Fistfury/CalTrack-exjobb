import { Request, Response } from "express";
import admin from "firebase-admin";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    let existingUser;
    try {
      existingUser = await admin.auth().getUserByEmail(email);
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: error.message });
        return;
      }
    }

    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(400).json({
      message: error.message || "Failed to register user",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const customToken = await admin.auth().createCustomToken(user.uid);
    res.status(200).json({
      message: "Login successful",
      token: customToken,
    });
  } catch (error: any) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
