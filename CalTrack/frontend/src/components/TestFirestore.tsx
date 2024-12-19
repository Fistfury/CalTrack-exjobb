import { useEffect } from "react";
import { db, auth, functions } from "../config/firebaseConfig"; // Import from your firebaseConfig
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";

const TestFirebase = () => {
  useEffect(() => {
    const testFirebaseServices = async () => {
      try {
        // === Firestore Tests ===
        console.log("🔍 Testing Firestore...");
        // Add a test document
        const usersCollection = collection(db, "users");
        const userDoc = await addDoc(usersCollection, {
          name: "Test User",
          email: "testuser@example.com",
          age: 30,
          weight: 75,
        });
        console.log("✅ Document written with ID:", userDoc.id);

        // Fetch documents from Firestore
        const docsSnapshot = await getDocs(usersCollection);
        docsSnapshot.forEach((doc) => {
          console.log(`📄 Document: ${doc.id} =>`, doc.data());
        });

        // Write a document using `setDoc`
        const specificDocRef = doc(db, "users", "specificUserId");
        await setDoc(specificDocRef, {
          name: "Specific User",
          email: "specificuser@example.com",
          age: 25,
          weight: 65,
        });
        console.log("✅ Document written using setDoc");

        // === Auth Tests ===
        console.log("🔍 Testing Auth...");
        // Create a new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          "newuser@example.com",
          "password123"
        );
        console.log("✅ User created:", userCredential.user);

        // Sign in the user
        const signedInUser = await signInWithEmailAndPassword(
          auth,
          "newuser@example.com",
          "password123"
        );
        console.log("✅ User signed in:", signedInUser.user);

        // === Functions Tests ===
        console.log("🔍 Testing Functions...");
        const exampleFunction = httpsCallable(functions, "exampleFunction"); // Replace with your function name
        const result = await exampleFunction({ key: "value" });
        console.log("✅ Function result:", result.data);
      } catch (error) {
        console.error("❌ Error testing Firebase services:", error);
      }
    };

    testFirebaseServices();
  }, []);

  return (
    <div>
      <h1>Testing Firebase Services</h1>
      <p>Check the console for results.</p>
    </div>
  );
};

export default TestFirebase;
