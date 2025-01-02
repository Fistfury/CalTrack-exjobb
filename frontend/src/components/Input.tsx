import styles from "../styles/shared/input.module.scss";
import { InputProps } from "../types/ComponentTypes";

export const Input = ({
  placeholder,
  value,
  name,
  checked, // Add checked prop
  onChange,
  type = "text",
  required = false,
  hasError = false,
  disabled = false,
  size = "small",
  ...rest
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
      checked={checked} // Pass checked prop
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      {...rest} // Pass other props like onClick
    />
  );
};
