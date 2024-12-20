import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import "./config/firebase-config";
import routes from "./routes";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

exports.exampleFunction = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send(""); // Handle preflight requests
    return;
  }

  console.log("Function called with data:", req.body);
  res.status(200).json({
    message: "Hello from Firebase Functions!",
    received: req.body,
  });
});

// Test Firestore Endpoint
app.get("/test-firestore", async (req, res) => {
  try {
    // Write to Firestore
    await admin.firestore().collection("test").doc("testDoc").set({
      message: "Testing Firestore connection",
      timestamp: FieldValue.serverTimestamp(),
    });

    // Read the document to verify
    const doc = await admin.firestore().collection("test").doc("testDoc").get();
    const data = doc.data();

    res.status(200).json({
      message: "Successfully wrote to Firestore Emulator!",
      data,
    });
  } catch (error: any) {
    console.error("Error writing to Firestore:", error.message);
    res.status(500).send("Failed to write to Firestore Emulator.");
  }
});

app.get("/test-auth", async (req, res) => {
  try {
    const user = await admin.auth().createUser({
      email: "testuser@example.com",
      password: "testpassword123",
      displayName: "Test User",
    });
    res.status(200).send(`Test user created successfully: ${user.uid}`);
  } catch (error: any) {
    console.error("Error creating test user:", error.message);
    res.status(500).send("Failed to connect to Auth Emulator.");
  }
});

// Mount routes
app.use("/", routes);

// Export the app
export const api = functions.https.onRequest(app);
