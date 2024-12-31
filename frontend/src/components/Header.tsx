import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { MdLanguage } from "react-icons/md";
import styles from "./styles/header.module.scss";
import { AuthModule } from "../modules/AuthModule";
import { AddData } from "../components/AddData";
import { useUser } from "../hooks/useUser";

export const Header = () => {
  const { logout, isLoggedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [showAddDataModal, setShowAddDataModal] = useState(false);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "SV" : "EN"));
  };

  const toggleAuthModal = (registerMode: boolean) => {
    setIsRegister(registerMode);
    setShowAuthModal((prev) => !prev);
  };

  const handleDataAdded = (newEntry: unknown) => {
    console.log("New data added:", newEntry);
    // Trigger updates in the dashboard and profile page as needed
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        CalTrack
      </Link>
      <nav className={styles.nav}>
        <ul>
          {isLoggedIn() && (
            <li>
              <button
                className={styles.icon}
                onClick={() => setShowAddDataModal(true)}
              >
                <AiOutlinePlusCircle size={24} />
              </button>
            </li>
          )}
          {isLoggedIn() && (
            <li>
              <Link to="/dashboard" className={styles.icon}>
                <AiOutlineDashboard size={24} />
              </Link>
            </li>
          )}

          <li className={styles.profile}>
            {isLoggedIn() ? (
              <>
                <Link to="/profile" className={styles.icon}>
                  <AiOutlineUser size={24} />
                </Link>
                <button onClick={() => logout()} className={styles.icon}>
                  <AiOutlineLogout size={24} />
                </button>
              </>
            ) : (
              <button
                onClick={() => toggleAuthModal(false)}
                className={styles.icon}
              >
                <AiOutlineUser size={24} />
              </button>
            )}
          </li>
          <li>
            <button onClick={toggleLanguage} className={styles.language}>
              <MdLanguage size={24} /> {language}
            </button>
          </li>
        </ul>
      </nav>

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

      {showAddDataModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowAddDataModal(false)}
            >
              ✖
            </button>
            <AddData
              onClose={() => setShowAddDataModal(false)}
              onDataAdded={handleDataAdded}
            />
          </div>
        </div>
      )}
    </header>
  );
};
