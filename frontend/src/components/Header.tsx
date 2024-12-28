import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineLogout,
} from "react-icons/ai";
import { MdLanguage } from "react-icons/md";
import styles from "./styles/header.module.scss";
import { AuthModule } from "../modules/AuthModule";

export const Header = () => {
  const { logout, isLoggedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [language, setLanguage] = useState("EN");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "SV" : "EN"));
  };

  const toggleAuthModal = (registerMode: boolean) => {
    setIsRegister(registerMode);
    setShowAuthModal((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        CalTrack
      </Link>
      <nav className={styles.nav}>
        <ul>
          {/* Dashboard Icon - Only visible if logged in */}
          {isLoggedIn() && (
            <li>
              <Link to="/dashboard" className={styles.icon}>
                <AiOutlineDashboard size={24} />
              </Link>
            </li>
          )}

          {/* Profile/User Section */}
          <li className={styles.profile}>
            {isLoggedIn() ? (
              <>
                {/* Profile Icon */}
                <Link to="/profile" className={styles.icon}>
                  <AiOutlineUser size={24} />
                </Link>
                {/* Logout Icon */}
                <button onClick={() => logout()} className={styles.icon}>
                  <AiOutlineLogout size={24} />
                </button>
              </>
            ) : (
              // Profile Icon (Opens Auth Modal)
              <button
                onClick={() => toggleAuthModal(false)}
                className={styles.icon}
              >
                <AiOutlineUser size={24} />
              </button>
            )}
          </li>
          {/* Language Selector */}
          <li>
            <button onClick={toggleLanguage} className={styles.language}>
              <MdLanguage size={24} /> {language}
            </button>
          </li>
        </ul>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => toggleAuthModal(false)}
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
    </header>
  );
};
