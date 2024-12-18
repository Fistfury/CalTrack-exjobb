import { useState } from "react";
import API_URL from "../config/apiConfig";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetFields = () => {
    console.log("Resetting fields...");
    setName("");
    setEmail("");
    setPassword("");
    setAge("");
    setWeight("");
    setLength("");
    setFitnessGoals("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Send registration data to the backend
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          age,
          weight,
          length,
          fitnessGoals,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || "Failed to register user.");
      }

      const responseData = await response.json();
      console.log("User registered successfully:", responseData);
      setSuccess("User registered successfully!");
      resetFields();
    } catch (err) {
      console.error("Error registering user:", err);
      setError((err as Error).message || "An unknown error occurred.");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
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
