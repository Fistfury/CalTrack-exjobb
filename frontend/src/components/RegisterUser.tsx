import { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./styles/registerUser.module.scss";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import { useUser } from "../hooks/useUser";
import {
  RegisterUserProps,
  RegisterResponse,
  RegisterFormState,
} from "../types/AuthTypes";
import { useTranslation } from "react-i18next";

export const RegisterUser = ({ onSuccess }: RegisterUserProps) => {
  const { t } = useTranslation();
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
          ? parseFloat(value) || ""
          : value,
    }));
  };

  const validateForm = (): string | null => {
    const { name, email, password, sex, weight, age, height } = form;

    if (step === 1) {
      if (!name || !email || !password) {
        return t("step1Validation");
      }
    }

    if (step === 2) {
      if (!sex || !weight || !age || !height) {
        return t("step2Validation");
      }

      // Validate numbers
      const parsedWeight = parseFloat(weight);
      const parsedAge = parseInt(age, 10);
      const parsedHeight = parseFloat(height);

      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        return t("invalidWeight");
      }
      if (isNaN(parsedAge) || parsedAge <= 0) {
        return t("invalidAge");
      }
      if (isNaN(parsedHeight) || parsedHeight <= 0) {
        return t("invalidHeight");
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
      // Skapa användare i Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const firebaseUid = userCredential.user.uid;

      // Hämta token från Firebase Authentication
      await userCredential.user.getIdToken();

      // Skicka payload till backend
      const payload = {
        userId: firebaseUid, // Skickar userId direkt
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

      // Anropa backend med userId och token
      const userData = await fetchWithFirebaseToken<RegisterResponse>(
        `auth/register`,
        payload
      );

      // Uppdatera användarens kontext i frontend
      setUser({
        id: firebaseUid,
        name: form.name,
        weight: parseFloat(form.weight),
        calorieTarget: userData.calorieTarget,
      });

      onSuccess(); // Navigera vidare eller stäng modal
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err instanceof Error ? err.message : t("unknownError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerForm}>
      {step === 1 ? (
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <h2>{t("step1Title")}</h2>
          <Input
            name="name"
            placeholder={t("namePlaceholder")}
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={form.password}
            onChange={handleChange}
            required
          />
          <label>
            <Input
              type="checkbox"
              name="acceptNotifications"
              checked={form.acceptNotifications}
              onChange={handleChange}
            />
            {t("acceptNotifications")}
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <Button type="button" onClick={handleNextStep}>
            {t("next")}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className={styles.form}>
          <h2>{t("step2Title")}</h2>
          <select name="sex" value={form.sex} onChange={handleChange} required>
            <option value="">{t("selectSex")}</option>
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>
          <Input
            name="weight"
            type="number"
            placeholder={t("weightPlaceholder")}
            value={form.weight}
            onChange={handleChange}
            required
          />
          <Input
            name="age"
            type="number"
            placeholder={t("agePlaceholder")}
            value={form.age}
            onChange={handleChange}
            required
          />
          <Input
            name="height"
            type="number"
            placeholder={t("heightPlaceholder")}
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
            <option value="sedentary">{t("sedentary")}</option>
            <option value="light">{t("light")}</option>
            <option value="moderate">{t("moderate")}</option>
            <option value="active">{t("active")}</option>
            <option value="veryActive">{t("veryActive")}</option>
          </select>
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? t("registering") : t("calculateAndRegister")}
          </Button>
        </form>
      )}
    </div>
  );
};
