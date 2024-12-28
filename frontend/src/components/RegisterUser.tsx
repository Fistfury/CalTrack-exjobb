import { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./styles/registerUser.module.scss";
import { useUser } from "../context/UserContext";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";

interface RegisterUserProps {
  onSuccess: () => void;
}

export const RegisterUser = ({ onSuccess }: RegisterUserProps) => {
  interface FormState {
    name: string;
    email: string;
    password: string;
    age: string;
    weight: string;
    length: string;
    workoutFrequency: string;
    fitnessGoals: string;
  }

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    length: "",
    workoutFrequency: "1-3",
    fitnessGoals: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const {
      name,
      email,
      password,
      age,
      weight,
      length,
      workoutFrequency,
      fitnessGoals,
    } = form;
    if (
      !name ||
      !email ||
      !password ||
      !age ||
      !weight ||
      !length ||
      !workoutFrequency ||
      !fitnessGoals
    ) {
      return "All fields are required.";
    }
    if (
      parseInt(age, 10) < 0 ||
      parseFloat(weight) <= 0 ||
      parseFloat(length) <= 0
    ) {
      return "Please provide valid positive numbers for age, weight, and length.";
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
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
      const token = await userCredential.user.getIdToken();
      const firebaseUid = userCredential.user.uid;

      await fetchWithFirebaseToken(`auth/register`, token, {
        firebaseUid,
        ...form,
        age: parseInt(form.age, 10),
        weight: parseFloat(form.weight),
        length: parseFloat(form.length),
        initialWeight: parseFloat(form.weight),
        workoutFrequency: form.workoutFrequency,
      });

      setSuccess("User registered successfully!");
      setUser({
        id: firebaseUid,
        name: form.name,
        weight: parseFloat(form.weight),
      });
      localStorage.setItem("token", token);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className={styles.registerForm}>
      <h2>Register</h2>
      {["name", "email", "password", "age", "weight", "length"].map((field) => (
        <Input
          key={field}
          name={field}
          placeholder={`Enter your ${field}`}
          value={form[field as keyof FormState]}
          onChange={handleChange}
          type={
            field === "password"
              ? "password"
              : field === "age" || field === "weight" || field === "length"
              ? "number"
              : "text"
          }
          required
        />
      ))}
      <textarea
        name="fitnessGoals"
        placeholder="Enter your fitness goals"
        value={form.fitnessGoals}
        onChange={handleChange}
        required
        className={styles.textarea}
      />
      <div className={styles.formGroup}>
        <label htmlFor="workoutFrequency">Workout Frequency</label>
        <select
          name="workoutFrequency"
          value={form.workoutFrequency}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="1-3">1-3 days/week</option>
          <option value="3-7">3-7 days/week</option>
        </select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </form>
  );
};
