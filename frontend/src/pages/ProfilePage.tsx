import { useState } from "react";
import { useUser } from "../context/UserContext";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import styles from "./styles/profile.module.scss";

export const ProfilePage = () => {
  const { user, setUser } = useUser(); // Access setUser from UserContext
  const [newWeight, setNewWeight] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleWeightUpdate = async () => {
    if (!newWeight) {
      setMessage("Weight cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get token from storage
      if (!token) throw new Error("Token not found.");

      // Update weight in the backend
      await fetchWithFirebaseToken(
        `users/weight`,
        token,
        { weight: parseFloat(newWeight) },
        "PUT"
      );

      // Update the context with the new weight
      setUser((prevUser) =>
        prevUser ? { ...prevUser, weight: parseFloat(newWeight) } : null
      );

      setMessage("Weight updated successfully!");
      setNewWeight("");
    } catch (error) {
      setMessage("Failed to update weight.");
      console.error("Error updating weight:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.header}>
        <h1>{user.name}</h1>
        <p>Stay focused and motivated!</p>
      </div>

      <div className={styles.weightSection}>
        <h2>Current Weight</h2>
        <p>{user.weight} kg</p>
      </div>

      <div className={styles.updateWeight}>
        <h2>Update Weight</h2>
        <input
          type="number"
          placeholder="Enter new weight"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
        />
        <button onClick={handleWeightUpdate}>Submit</button>
      </div>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};
