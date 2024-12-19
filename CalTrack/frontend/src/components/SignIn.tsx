import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import API_URL from "../config/apiConfig";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./styles/signIn.module.scss";
import { auth } from "../config/firebaseConfig";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Authenticate user with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      // Send token to backend for verification
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || "Login failed.");
      }

      console.log("Login successful!");
      localStorage.setItem("token", token); // Save token for authenticated requests
    } catch (err) {
      console.error("Error signing in:", err);
      setError((err as Error).message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className={styles.signInForm}>
      <h2>Sign In</h2>
      <Input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};
