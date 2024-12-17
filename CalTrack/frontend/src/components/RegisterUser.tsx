import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../firebaseConfig";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const auth = getAuth(app);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), {
        name,
        email,
        age,
        weight,
        length,
        fitnessGoals,
      });

      setSuccess("User registered successfully!");
    } catch (err) {
      console.error("Error registering user:", err);
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Enter your weight in kg"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Enter your length in cm"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        required
      />
      <textarea
        placeholder="Enter your fitness goals"
        value={fitnessGoals}
        onChange={(e) => setFitnessGoals(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};
