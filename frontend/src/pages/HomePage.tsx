import { useState } from "react";
import styles from "./styles/home.module.scss";
import workoutImage from "../assets/workout.png";
import { AuthModule } from "../modules/AuthModule";

export const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(true);

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
          <button
            className={styles.registerButton}
            onClick={() => {
              toggleAuthModal(true);
            }} // Open in Register mode
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowAuthModal(false)} // Close the modal
            >
              ✖
            </button>
            <AuthModule
              isRegister={isRegister}
              onSuccess={() => setShowAuthModal(false)} // Close modal on success
            />
          </div>
        </div>
      )}
    </div>
  );
};
