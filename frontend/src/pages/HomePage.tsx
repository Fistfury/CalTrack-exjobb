import { useState } from "react";
import styles from "./styles/home.module.scss";
import workoutImage from "../assets/workout.png";
import { AuthModule } from "../modules/AuthModule";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "react-i18next";

export const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const { isLoggedIn } = useUser();
  const { t } = useTranslation();

  const toggleAuthModal = (registerMode: boolean) => {
    setIsRegister(registerMode);
    setShowAuthModal((prev) => !prev);
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <img
          src={workoutImage}
          alt={t("workoutImageAlt")}
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1>{t("welcome")}</h1>
          <p>{t("personalizedAssistant")}</p>
          {!isLoggedIn() && (
            <button
              className={styles.registerButton}
              onClick={() => {
                toggleAuthModal(true);
              }}
            >
              {t("startNow")}
            </button>
          )}
        </div>
      </div>
      {/* Info Section */}
      <div className={styles.infoSection}>
        <h2>{t("whyUseCalTrack")}</h2>
        <p>{t("calTrackDescription")}</p>
        <p>{t("bmrExplanation")}</p>
        <ul>
          <li>
            <strong>{t("sedentary")}</strong> {t("sedentaryDescription")}
          </li>
          <li>
            <strong>{t("lightlyActive")}</strong>{" "}
            {t("lightlyActiveDescription")}
          </li>
          <li>
            <strong>{t("moderatelyActive")}</strong>{" "}
            {t("moderatelyActiveDescription")}
          </li>
          <li>
            <strong>{t("active")}</strong> {t("activeDescription")}
          </li>
          <li>
            <strong>{t("veryActive")}</strong> {t("veryActiveDescription")}
          </li>
        </ul>
        <p>{t("calorieGoalsDescription")}</p>
        <ul>
          <li>
            <strong>{t("loseWeight")}</strong> {t("loseWeightDescription")}
          </li>
          <li>
            <strong>{t("maintainWeight")}</strong>{" "}
            {t("maintainWeightDescription")}
          </li>
          <li>
            <strong>{t("gainWeight")}</strong> {t("gainWeightDescription")}
          </li>
        </ul>
        <p>{t("joinCalTrack")}</p>
        {!isLoggedIn() && (
          <button
            className={styles.registerButton}
            onClick={() => {
              toggleAuthModal(true);
            }}
          >
            {t("getStarted")}
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
