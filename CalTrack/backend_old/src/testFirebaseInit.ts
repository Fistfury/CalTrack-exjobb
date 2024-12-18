import { db, auth } from "./config/firebase-config";

async function testFirebase() {
  try {
    const users = await auth.listUsers();
    console.log(`Successfully fetched ${users.users.length} users.`);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

testFirebase();
