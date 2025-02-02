import { useEffect } from "react";
import {
  requestNotificationPermission,
  handleForegroundMessages,
} from "../config/firebaseMessaging";
import { AiOutlineBell } from "react-icons/ai";
import styles from "./styles/header.module.scss";

export const NotificationButton = () => {
  // Request permission when the component mounts
  useEffect(() => {
    requestNotificationPermission();
    handleForegroundMessages();
  }, []);

  const handleClick = async () => {
    const notification = new Notification("Update weight", {
      body: "Updated your weight for today please.",
    });
    console.log("Notification triggered: ", notification);
  };

  return (
    <button
      onClick={handleClick}
      className={styles.icon}
      aria-label="Trigger a test notification"
    >
      <AiOutlineBell className={styles.icon} />
    </button>
  );
};
