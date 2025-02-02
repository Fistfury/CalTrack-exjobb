import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebaseConfig";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";

const messaging = getMessaging(app);

// Request Notification Permission
export const requestNotificationPermission = async () => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");

      const token = await getToken(messaging, {
        vapidKey:
          "BELUP77xG4Q6rrk7GYfKpxTElwLsWDRmw6duwrgZPCaXgzsxuDyEyinjGRTph7LjakpGucqAMbGSsKB1R2R0PyA",
      });
      console.log("FCM Token:", token);

      // Send FCM token to backend
      await fetchWithFirebaseToken(
        "messaging/save-fcm-token", // Adjust based on your backend API
        { fcmToken: token },
        "POST"
      );
      console.log("FCM token sent to backend.");
    } else {
      console.warn("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

// Handle Foreground Notifications
export const handleForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Foreground notification received:", payload);

    const { title, body } = payload.notification || {};
    if (title && body) {
      new Notification(title, { body });
    }
  });
};
