import * as admin from "firebase-admin";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import * as path from "path";

const serviceAccountPath = path.resolve(
  __dirname,
  "../config/serviceAccountKey.json"
);

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("🔥 Firebase Admin initialized successfully.");

  if (process.env.FUNCTIONS_EMULATOR === "true") {
    console.log("🔌 Connecting to Firestore Emulator...");
    admin.firestore().settings({ host: "localhost:8080", ssl: false });

    console.log("🔌 Connecting to Auth Emulator...");
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    console.log("✅ Auth Emulator environment variable set!");
  }
}

export const db = getFirestore();
export const auth = admin.auth();
export { FieldValue };
