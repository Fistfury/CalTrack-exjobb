import { useState } from "react";
import { SignIn } from "../components/SignIn";
import { RegisterUser } from "../components/RegisterUser";
import styles from "./styles/authModule.module.scss";

export const AuthModule = () => {
  const [isRegister, setIsRegister] = useState(false);

  const toggleAuthMode = () => {
    setIsRegister((prev) => !prev);
  };

  return (
    <div className={styles.authModule}>
      {isRegister ? <RegisterUser /> : <SignIn />}
      <p className={styles.toggleText}>
        {isRegister ? "Already have an account?" : "New to CalTrack?"}{" "}
        <button onClick={toggleAuthMode} className={styles.toggleButton}>
          {isRegister ? "Sign In" : "Register"}
        </button>
      </p>
    </div>
  );
};
