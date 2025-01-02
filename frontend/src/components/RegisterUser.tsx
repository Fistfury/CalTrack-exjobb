import { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./styles/registerUser.module.scss";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import { refreshToken } from "../utils/authUtils";
import { useUser } from "../hooks/useUser";
import {
  RegisterUserProps,
  RegisterResponse,
  RegisterFormState,
} from "../types/AuthTypes";

export const RegisterUser = ({ onSuccess }: RegisterUserProps) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    sex: "",
    weight: "",
    age: "",
    height: "",
    activityLevel: "sedentary",
    acceptNotifications: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["weight", "age", "height"].includes(name)
          ? parseFloat(value) || "" // Convert to number, fallback to empty string
          : value,
    }));
  };

  const validateForm = (): string | null => {
    const { name, email, password, sex, weight, age, height } = form;

    if (step === 1) {
      if (!name || !email || !password) {
        return "Please fill in all fields in Step 1.";
      }
    }

    if (step === 2) {
      if (!sex || !weight || !age || !height) {
        return "Please fill in all fields in Step 2.";
      }

      // Convert string values to numbers and validate
      const parsedWeight = parseFloat(weight);
      const parsedAge = parseInt(age, 10);
      const parsedHeight = parseFloat(height);

      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        return "Please provide a valid positive number for weight.";
      }
      if (isNaN(parsedAge) || parsedAge <= 0) {
        return "Please provide a valid positive number for age.";
      }
      if (isNaN(parsedHeight) || parsedHeight <= 0) {
        return "Please provide a valid positive number for height.";
      }
    }

    return null;
  };

  const handleNextStep = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const token = await refreshToken();
      const firebaseUid = userCredential.user.uid;
      localStorage.setItem("token", token);

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        sex: form.sex,
        weight: parseFloat(form.weight),
        age: parseInt(form.age, 10),
        height: parseFloat(form.height),
        activityLevel: form.activityLevel,
        acceptNotifications: form.acceptNotifications,
      };

      console.log("✅ Data being sent to backend:", payload);

      const userData = await fetchWithFirebaseToken<RegisterResponse>(
        `auth/register`,
        payload
      );

      console.log("✅ Backend response:", userData);

      // Update user context
      setUser({
        id: firebaseUid,
        name: form.name,
        weight: parseFloat(form.weight),
        calorieTarget: userData.calorieTarget,
      });

      onSuccess(); // Handle successful registration (e.g., navigate or close modal)
    } catch (err) {
      localStorage.removeItem("token");
      console.error("❌ Registration error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerForm}>
      {step === 1 ? (
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <h2>Step 1: Account Details</h2>
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label>
            <Input
              type="checkbox"
              name="acceptNotifications"
              checked={form.acceptNotifications}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  acceptNotifications: e.target.checked,
                }))
              }
            />
            Accept Notifications
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <Button type="button" onClick={handleNextStep}>
            Next
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className={styles.form}>
          <h2>Step 2: Personal Details</h2>
          <select name="sex" value={form.sex} onChange={handleChange} required>
            <option value="">Select Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <Input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={handleChange}
            required
          />
          <Input
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
          />
          <Input
            name="height"
            type="number"
            placeholder="Height (cm)"
            value={form.height}
            onChange={handleChange}
            required
          />
          <select
            name="activityLevel"
            value={form.activityLevel}
            onChange={handleChange}
            required
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Active</option>
            <option value="veryActive">Very Active</option>
          </select>
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Calculate & Register"}
          </Button>
        </form>
      )}
    </div>
  );
};
