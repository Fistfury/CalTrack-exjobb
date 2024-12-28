import { useState } from "react";
import { SignIn } from "../components/SignIn";
import { RegisterUser } from "../components/RegisterUser";
import styles from "./styles/authModule.module.scss";
import { useNavigate } from "react-router-dom";

interface AuthModuleProps {
  isRegister: boolean; // Prop to determine initial mode
  onSuccess: () => void;
}

export const AuthModule = ({ isRegister, onSuccess }: AuthModuleProps) => {
  const [isRegisterMode, setIsRegisterMode] = useState(isRegister);
  const navigate = useNavigate();

  const handleSuccess = () => {
    setTimeout(() => {
      onSuccess(); // Close modal
      console.log("➡️ AuthModule: Navigating to /profile");
      navigate("/profile"); // Navigate to profile after ensuring context is updated
    }, 100); // Add a small delay to ensure `UserContext` is updated
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
        {isRegisterMode ? "Already have an account?" : "New to CalTrack?"}{" "}
        <button onClick={toggleAuthMode} className={styles.toggleButton}>
          {isRegisterMode ? "Sign In" : "Register"}
        </button>
      </p>
    </div>
  );
};
