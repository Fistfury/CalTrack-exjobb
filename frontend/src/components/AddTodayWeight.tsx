import { useState } from "react";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import modalStyles from "../styles/shared/modal.module.scss";
import { AddTodayWeightProps } from "../types/ComponentTypes";
import { Button } from "./Button";
import { Input } from "./Input";

/**
 * Component to add today's weight and optionally mark if calorie goals were met.
 * This component handles user input, submits the data to the backend, and displays
 * any relevant errors or feedback.
 */
export const AddTodayWeight = ({ onSubmit }: AddTodayWeightProps) => {
  // State to track weight input
  const [weight, setWeight] = useState("");

  // State to track checkbox for whether calorie goals were met
  const [caloriesMet, setCaloriesMet] = useState(false);

  // State to handle error messages
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the form submission for adding today's weight.
   * - Validates the input.
   * - Sends the data to the backend via API.
   * - Notifies the parent component when successful.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!weight) {
      setError("Weight is required.");
      return;
    }

    try {
      // Prepare the payload with the user's weight and calorie tracking info
      const today = new Date().toISOString().split("T")[0];
      const payload = {
        weight: parseFloat(weight),
        date: today,
        caloriesMet, // Checkbox value indicating if calorie goal was met
        achieved: caloriesMet, // Backend logic requires this field
      };

      // Send the payload to the API
      await fetchWithFirebaseToken("entries", payload, "POST");

      // Notify the parent to refresh data and reset local state
      onSubmit();
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
        {/* Modal header with a title and close button */}
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

        {/* Form for entering weight and marking calorie goals */}
        <form className={modalStyles.form} onSubmit={handleSubmit}>
          {/* Weight input field */}
          <Input
            type="number"
            placeholder="Enter weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />

          {/* Checkbox to mark if calorie goals were met */}
          <label>
            <Input
              type="checkbox"
              checked={caloriesMet}
              onChange={(e) => setCaloriesMet(e.target.checked)}
            />
            Calories met today
          </label>

          {/* Submit button */}
          <Button type="submit" className={modalStyles.submitButton}>
            Submit
          </Button>
        </form>

        {/* Display error message if any */}
        {error && <p className={modalStyles.error}>{error}</p>}
      </div>
    </div>
  );
};
