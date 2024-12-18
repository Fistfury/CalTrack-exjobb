// import * as admin from "firebase-admin";
// import { readFileSync } from "fs";
// import * as path from "path";

// const serviceAccountPath = path.resolve(
//   __dirname,
//   "../config/serviceAccountKey.json"
// );

// try {
//   const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });

//   console.log("🔥 Firebase Admin initialized successfully.");

//   // Connect to Emulators if running locally
//   if (process.env.FUNCTIONS_EMULATOR === "true") {
//     console.log("🔌 Connecting Firebase Admin to Firestore Emulator...");
//     admin.firestore().settings({
//       host: "localhost:8080",
//       ssl: false,
//     });

//     console.log("🔌 Connecting Firebase Admin to Auth Emulator...");
//     (admin.auth() as any).useEmulator("http://localhost:9099");
//   }
// } catch (error: any) {
//   console.error("❌ Error initializing Firebase Admin:", error.message);
//   process.exit(1);
// }

// export const db = admin.firestore();
// export const auth = admin.auth();
