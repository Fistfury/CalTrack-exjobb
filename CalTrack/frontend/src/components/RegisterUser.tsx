import { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import API_URL from "../config/apiConfig";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./styles/registerUser.module.scss";
import { useNavigate } from "react-router-dom";

export const RegisterUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const resetFields = () => {
  //   setName("");
  //   setEmail("");
  //   setPassword("");
  //   setAge("");
  //   setWeight("");
  //   setLength("");
  //   setFitnessGoals("");
  // };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken(); // Get Firebase Auth token
      const firebaseUid = userCredential.user.uid;

      console.log("🟢 Firebase Token:", token);
      console.log("🟢 Firebase UID:", firebaseUid);

      // Prepare the payload
      const payload = {
        firebaseUid,
        name,
        email,
        password,
        age: parseInt(age, 10),
        weight: parseFloat(weight),
        length: parseFloat(length),
        fitnessGoals,
      };

      // Send the payload to the backend
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for backend validation
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || "Failed to register user.");
      }

      console.log("✅ User registered successfully!");
      setSuccess("User registered successfully!");

      // Save token in localStorage for future authenticated requests
      localStorage.setItem("token", token);

      // Navigate to the dashboard after successful registration
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error registering user:", err);
      setError((err as Error).message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleRegister} className={styles.registerForm}>
      <h2>Register</h2>
      <Input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
      />
      <Input
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        type="number"
        required
      />
      <Input
        placeholder="Enter your weight in kg"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        type="number"
        required
      />
      <Input
        placeholder="Enter your length in cm"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        type="number"
        required
      />
      <textarea
        placeholder="Enter your fitness goals"
        value={fitnessGoals}
        onChange={(e) => setFitnessGoals(e.target.value)}
        required
        className={styles.textarea}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </form>
  );
};
