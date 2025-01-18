import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../assets/CalTrack-logo.png";
import styles from "./styles/footer.module.scss";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt={t("logoAlt")} className={styles.logoImage} />
          <span>{t("appName")}</span>
        </Link>
        <div className={styles.socialIcons}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("facebookAria")}
          >
            <FaFacebookF aria-hidden="true" />
            <span className={styles.visuallyHidden}>{t("facebookText")}</span>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("twitterAria")}
          >
            <FaTwitter aria-hidden="true" />
            <span className={styles.visuallyHidden}>{t("twitterText")}</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("instagramAria")}
          >
            <FaInstagram aria-hidden="true" />
            <span className={styles.visuallyHidden}>{t("instagramText")}</span>
          </a>
        </div>
        <p>
          &copy; {new Date().getFullYear()} {t("appName")}.{" "}
          {t("rightsReserved")}
        </p>
      </div>
    </footer>
  );
};
