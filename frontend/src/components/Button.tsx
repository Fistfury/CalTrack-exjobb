import styles from "../styles/shared/button.module.scss";
import { ButtonProps } from "../types/ComponentTypes";

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
