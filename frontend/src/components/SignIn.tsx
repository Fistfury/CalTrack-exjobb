import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./styles/signIn.module.scss";
import { auth } from "../config/firebaseConfig";
import { useUser } from "../context/UserContext";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";

interface SignInProps {
  onSuccess: () => void;
}

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
      const token = await userCredential.user.getIdToken();
      const firebaseUid = userCredential.user.uid;

      const responseData = await fetchWithFirebaseToken(`auth/login`, token, {
        firebaseUid,
      });
      setUser({
        id: firebaseUid,
        name: responseData.name,
        weight: responseData.weight,
      });
      localStorage.setItem("token", token);
      onSuccess();
      console.log(
        "✅ SignIn: User signed in and context updated:",
        userCredential.user
      );
    } catch (err) {
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
