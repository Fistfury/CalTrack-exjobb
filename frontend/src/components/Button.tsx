import React from "react";
import styles from "../styles/shared/button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
};

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size,
  fullWidth,
  disabled,
}: ButtonProps) => {
  const classNames = [
    styles.button,
    variant && styles[`button--${variant}`],
    size && styles[`button--${size}`],
    fullWidth && styles["button--full-width"],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classNames}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
