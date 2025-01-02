import { useState } from "react";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import modalStyles from "../styles/shared/modal.module.scss";
import { AddTodayWeightProps } from "../types/ComponentTypes";
import { Button } from "./Button";
import { Input } from "./Input";

export const AddTodayWeight = ({ onSubmit }: AddTodayWeightProps) => {
  const [weight, setWeight] = useState("");
  const [caloriesMet, setCaloriesMet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!weight) {
      setError("Weight is required.");
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0];
      const payload = {
        weight: parseFloat(weight),
        date: today,
        caloriesMet, // Checkbox value
        achieved: caloriesMet, // Match backend logic
      };

      await fetchWithFirebaseToken("entries", payload, "POST");
      onSubmit(); // Notify parent to refresh
      setWeight("");
      setCaloriesMet(false);
    } catch (err) {
      console.error("Error adding today's weight:", err);
      setError("Failed to add weight. Please try again.");
    }
  };

  return (
    <div className={modalStyles.modal}>
      <div className={modalStyles.modalContent}>
        <header className={modalStyles.modalHeader}>
          <h2>Add Today's Weight</h2>
          <Button
            type="button"
            onClick={onSubmit}
            className={modalStyles.closeButton}
            variant="close"
          >
            ✖
          </Button>
        </header>
        <form className={modalStyles.form} onSubmit={handleSubmit}>
          <Input
            type="number"
            placeholder="Enter weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <label>
            <Input
              type="checkbox"
              checked={caloriesMet}
              onChange={(e) => setCaloriesMet(e.target.checked)}
            />
            Calories met today
          </label>
          <Button type="submit" className={modalStyles.submitButton}>
            Submit
          </Button>
        </form>
        {error && <p className={modalStyles.error}>{error}</p>}
      </div>
    </div>
  );
};
