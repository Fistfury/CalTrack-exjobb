import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

export const sendDailyReminder = functions.pubsub
  .schedule("every day 08:00")
  .timeZone("Europe/Stockholm")
  .onRun(async () => {
    try {
      // Fetch all users from Firestore
      const usersSnapshot = await admin.firestore().collection("users").get();

      // Prepare FCM messages for users with notifications enabled
      const messages: admin.messaging.TokenMessage[] = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.acceptNotifications && userData.fcmToken) {
          messages.push({
            token: userData.fcmToken,
            notification: {
              title: "Daily Weight Reminder",
              body: "Don't forget to log your weight today!",
            },
            data: {
              userId: doc.id,
            },
          });
        }
      });

      if (messages.length > 0) {
        const response = await admin.messaging().sendAll(messages);

        if (response.failureCount > 0) {
          console.warn(
            `⚠️ Failed to send ${response.failureCount} notifications.`
          );
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              console.error(
                `❌ Error sending to token [${messages[idx].token}]:`,
                resp.error
              );
            }
          });
        }
      } else {
      }
    } catch (error) {
      console.error(
        "❌ Error occurred while sending daily reminders:",
        error instanceof Error ? error.message : error
      );
    }
  });
