import { AuthModule } from "../modules/AuthModule";
import styles from "./styles/home.module.scss";

export const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <h1>Welcome to CalTrack!</h1>
      <p>Track your progress, log your workouts, and achieve your goals.</p>
      <div className={styles.authContainer}>
        <AuthModule />
      </div>
    </div>
  );
};
