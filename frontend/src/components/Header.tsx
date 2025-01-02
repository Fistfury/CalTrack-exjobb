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
import logo from "../assets/CalTrack-logo.png";
import { AuthModule } from "../modules/AuthModule";
import { useUser } from "../hooks/useUser";
import { AddTodayWeight } from "../components/AddTodayWeight";
import { useSummary } from "../hooks/useSummary";

export const Header = () => {
  const { logout, isLoggedIn } = useUser();
  const token = localStorage.getItem("token");
  const { refreshSummary } = useSummary(token);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [showTodayWeightModal, setShowTodayWeightModal] = useState(false);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "SV" : "EN"));
  };

  const toggleAuthModal = (registerMode: boolean) => {
    setIsRegister(registerMode);
    setShowAuthModal((prev) => !prev);
  };

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="CalTrack Logo" className={styles.logoImage} />
          <span>CalTrack</span>
        </Link>
        <nav className={styles.nav}>
          <ul>
            {isLoggedIn() && (
              <li>
                <button
                  onClick={() => setShowTodayWeightModal(true)}
                  className={styles.icon}
                >
                  <AiOutlinePlusCircle className={styles.icon} />
                </button>
              </li>
            )}
            {isLoggedIn() && (
              <li>
                <Link to="/dashboard" className={styles.icon}>
                  <AiOutlineDashboard className={styles.icon} />
                </Link>
              </li>
            )}
            <li>
              <div className={styles.profileIcons}>
                {isLoggedIn() ? (
                  <>
                    <Link to="/profile" className={styles.icon}>
                      <AiOutlineUser className={styles.icon} />
                    </Link>
                    <button onClick={() => logout()} className={styles.icon}>
                      <AiOutlineLogout className={styles.icon} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => toggleAuthModal(false)}
                    className={styles.icon}
                  >
                    <AiOutlineUser className={styles.icon} />
                  </button>
                )}
              </div>
            </li>
            <li>
              <button onClick={toggleLanguage} className={styles.language}>
                <MdLanguage className={styles.icon} /> {language}
              </button>
            </li>
          </ul>
        </nav>
      </header>

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

      {/* Add Today Weight Modal */}
      {showTodayWeightModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <AddTodayWeight
              onSubmit={() => {
                refreshSummary();
                setShowTodayWeightModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
