import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { db } from "./firebase-config";

export const sendDailyReminder = functions.pubsub
  .schedule("every day 08:00")
  .timeZone("Europe/Stockholm")
  .onRun(async () => {
    try {
      const usersSnapshot = await db.collection("users").get();

      const messages: admin.messaging.Message[] = usersSnapshot.docs
        .map((doc) => {
          const userData = doc.data();
          if (userData.acceptNotifications && userData.fcmToken) {
            return {
              token: userData.fcmToken,
              notification: {
                title: "Daily Weight Reminder",
                body: "Don't forget to log your weight today!",
              },
            } as admin.messaging.Message;
          }
          return null; // Explicitly return null for non-notifiable users
        })
        .filter((msg): msg is admin.messaging.Message => msg !== null); // Type predicate for filtering non-null messages

      if (messages.length > 0) {
        const response = await admin.messaging().sendAll(messages);
        console.log(`✅ Messages sent: ${response.successCount}`);
        if (response.failureCount > 0) {
          console.warn("⚠️ Some messages failed to send:", response.responses);
        }
      } else {
        console.log("ℹ️ No users opted in for notifications.");
      }
    } catch (error) {
      console.error(
        "❌ Error sending daily reminders:",
        error instanceof Error ? error.message : error
      );
    }
  });
