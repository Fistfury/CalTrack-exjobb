import styles from "../styles/shared/input.module.scss";
import { InputProps } from "../types/ComponentTypes";

export const Input = ({
  placeholder,
  value,
  name,
  onChange,
  type = "text",
  required = false,
  hasError = false,
  disabled = false,
  size = "small",
}: InputProps) => {
  const classNames = [
    styles.input,
    hasError && styles["input--error"],
    size && styles[`input--${size}`],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      className={classNames}
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    />
  );
};
