import React from "react";
import styles from "../styles/shared/input.module.scss";

type InputProps = {
  placeholder: string;
  value: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  size?: "small" | "large";
};

export const Input = ({
  placeholder,
  value,
  name, // Ensure `name` is forwarded
  onChange,
  type = "text",
  required = false,
  hasError = false,
  disabled = false,
  size = "small", // Default to "small" size
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
      name={name} // Forward `name` to the <input>
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    />
  );
};
