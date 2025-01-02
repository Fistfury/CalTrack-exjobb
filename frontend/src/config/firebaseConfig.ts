import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const messaging = getMessaging(app);

if (
  import.meta.env.VITE_FIREBASE_USE_EMULATOR === "true" ||
  window.location.hostname === "localhost"
) {
  console.log("Connecting to Firestore, Auth, and Functions Emulator...");
  connectFirestoreEmulator(db, "localhost", 8080); // Firestore Emulator Port
  connectAuthEmulator(auth, "http://localhost:9099"); // Auth Emulator Port
  connectFunctionsEmulator(functions, "localhost", 5001); // Functions Emulator Port
}

export { app, db, auth, functions, messaging };
