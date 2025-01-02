import { useState } from "react";
import styles from "./styles/home.module.scss";
import workoutImage from "../assets/workout.png";
import { AuthModule } from "../modules/AuthModule";
import { useUser } from "../hooks/useUser";

export const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const { isLoggedIn } = useUser();

  const toggleAuthModal = (registerMode: boolean) => {
    setIsRegister(registerMode);
    setShowAuthModal((prev) => !prev);
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <img src={workoutImage} alt="Workout" className={styles.heroImage} />
        <div className={styles.heroContent}>
          <h1>Welcome to CalTrack!</h1>
          <p>Your personalized fitness and nutrition tracking assistant.</p>
          {!isLoggedIn() && (
            <button
              className={styles.registerButton}
              onClick={() => {
                toggleAuthModal(true);
              }} // Open in Register mode
            >
              Start now
            </button>
          )}
        </div>
      </div>
      {/* Info Section */}
      <div className={styles.infoSection}>
        <h2>Why Use CalTrack?</h2>
        <p>
          CalTrack provides you with tools to calculate your personalized daily
          calorie intake based on your gender, age, height, weight, and activity
          level. Adjust your intake to lose weight, gain weight, or maintain
          your current weight while keeping your nutrition balanced.
        </p>
        <p>
          The calculator uses proven formulas to estimate your Basal Metabolic
          Rate (BMR) and adjusts it based on your activity level:
        </p>
        <ul>
          <li>
            <strong>Sedentary:</strong> For mostly sitting work (e.g., office
            jobs).
          </li>
          <li>
            <strong>Lightly Active:</strong> For standing work (e.g., teachers,
            cashiers).
          </li>
          <li>
            <strong>Moderately Active:</strong> For walking work (e.g., sales
            reps, servers).
          </li>
          <li>
            <strong>Active:</strong> For jobs involving a lot of physical
            activity (e.g., builders).
          </li>
          <li>
            <strong>Very Active:</strong> For intense physical labor or high
            sports activity.
          </li>
        </ul>
        <p>
          Based on your goals, CalTrack predicts your daily calorie intake to:
        </p>
        <ul>
          <li>
            <strong>Lose Weight:</strong> Lose 0.5 - 1 kg per week in a healthy
            way.
          </li>
          <li>
            <strong>Maintain Weight:</strong> Stay at your current weight with
            balanced nutrition.
          </li>
          <li>
            <strong>Gain Weight:</strong> Gain 0.5 - 1 kg per week in a
            sustainable way.
          </li>
        </ul>
        <p>
          Join thousands of others achieving their goals with CalTrack. Register
          now to start tracking your fitness journey!
        </p>
        {!isLoggedIn() && (
          <button
            className={styles.registerButton}
            onClick={() => {
              toggleAuthModal(true);
            }}
          >
            Get Started for Free
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowAuthModal(false)}
            >
              ✖
            </button>
            <AuthModule
              isRegister={isRegister}
              onSuccess={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
