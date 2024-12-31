import { useState } from "react";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AddDataProps } from "../types/ComponentTypes";

export const AddData = ({ onClose, onDataAdded }: AddDataProps) => {
  const [weight, setWeight] = useState("");
  const [caloriesMet, setCaloriesMet] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!weight) {
      setError("Weight is required.");
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0];
      const newEntry = {
        date: today,
        weight: parseFloat(weight),
        caloriesMet,
      };

      // Call backend API
      interface ApiResponse {
        entry?: {
          date: string;
          weight: number;
          calories: number;
          calorieTarget: number;
        };
      }

      const response: ApiResponse = await fetchWithFirebaseToken(
        "entries",
        token || "",
        newEntry,
        "POST"
      );

      if (response && response.entry) {
        onDataAdded(response.entry); // Use entry if it exists
      } else {
        console.warn("Unexpected response structure:", response);
        setError("Unexpected response from the server.");
      }
      onClose();
    } catch (err) {
      console.error("Error adding data:", err);
      setError("Failed to add data. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log Daily Data</h2>
      <Input
        placeholder="Enter weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        type="number"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={caloriesMet}
          onChange={(e) => setCaloriesMet(e.target.checked)}
        />
        Consumed today's calories
      </label>
      <Button type="submit">Submit</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
