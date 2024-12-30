import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./styles/signIn.module.scss";
import { auth } from "../config/firebaseConfig";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import { refreshToken } from "../utils/authUtils";
import { useUser } from "../hooks/useUser";
import { SignInProps, LoginResponse } from "../types/AuthTypes";

export const SignIn = ({ onSuccess }: SignInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await refreshToken();
      const firebaseUid = userCredential.user.uid;

      // Fetch user data from backend
      const loginResponse = await fetchWithFirebaseToken<LoginResponse>(
        "auth/login",
        token
      );

      const { user: userData } = loginResponse;

      console.log("✅ SignIn Response:", userData);

      // Update the user context with retrieved data
      setUser({
        id: firebaseUid,
        name: userData.name,
        weight: userData.weight,
        calorieTarget: userData.calorieTarget,
      });

      // Save token locally
      localStorage.setItem("token", token);

      onSuccess(); // Trigger success callback
    } catch (err) {
      console.error("❌ SignIn Error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className={styles.signInForm}>
      <h2>Sign In</h2>
      <Input
        name="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        name="password"
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
