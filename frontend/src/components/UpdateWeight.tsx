import { useState } from "react";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import styles from "./styles/updateWeight.module.scss";
import { UpdateWeightProps } from "../types/ComponentTypes";

export const UpdateWeight = ({
  token,
  currentWeight,
  onWeightUpdate,
}: UpdateWeightProps) => {
  const [newWeight, setNewWeight] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleWeightUpdate = async () => {
    if (!newWeight) {
      setMessage("Weight cannot be empty.");
      return;
    }

    try {
      // Update weight in the backend
      await fetchWithFirebaseToken(
        `weight`,
        token,
        { weight: parseFloat(newWeight) },
        "PUT"
      );

      // Notify parent of weight update
      onWeightUpdate(parseFloat(newWeight));

      setMessage("Weight updated successfully!");
      setNewWeight("");
    } catch (error) {
      setMessage("Failed to update weight.");
      console.error("Error updating weight:", error);
    }
  };

  return (
    <div className={styles.updateWeight}>
      <h2>Update Weight</h2>
      <p>Current Weight: {currentWeight} kg</p>
      <input
        type="number"
        placeholder="Enter new weight"
        value={newWeight}
        onChange={(e) => setNewWeight(e.target.value)}
      />
      <button onClick={handleWeightUpdate}>Submit</button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};
