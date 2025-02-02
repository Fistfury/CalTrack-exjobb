import { useState } from "react";
import { SignIn } from "../components/SignIn";
import { RegisterUser } from "../components/RegisterUser";
import styles from "./styles/authModule.module.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AuthModuleProps {
  isRegister: boolean; // Prop to determine initial mode
  onSuccess: () => void;
}

export const AuthModule = ({ isRegister, onSuccess }: AuthModuleProps) => {
  const [isRegisterMode, setIsRegisterMode] = useState(isRegister);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSuccess = () => {
    setTimeout(() => {
      onSuccess(); // Close modal
      navigate("/profile"); // Navigate to profile after ensuring context is updated
    }, 100);
  };

  const toggleAuthMode = () => {
    setIsRegisterMode((prev) => !prev);
  };

  return (
    <div className={styles.authModule}>
      {isRegisterMode ? (
        <RegisterUser onSuccess={handleSuccess} />
      ) : (
        <SignIn onSuccess={handleSuccess} />
      )}
      <p className={styles.toggleText}>
        {isRegisterMode ? t("alreadyHaveAccount") : t("newToCalTrack")}{" "}
        <button onClick={toggleAuthMode} className={styles.toggleButton}>
          {isRegisterMode ? t("signIn") : t("register")}
        </button>
      </p>
    </div>
  );
};
