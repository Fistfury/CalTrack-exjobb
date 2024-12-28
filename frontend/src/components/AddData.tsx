import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

interface AddDataProps {
  onClose: () => void;
  onDataAdded: (newEntry: {
    date: string;
    weight: number;
    calories: number;
    calorieTarget: number;
  }) => void;
}

export const AddData = ({ onClose, onDataAdded }: AddDataProps) => {
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!weight || !calories) {
      setError("Both weight and calories are required.");
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0]; // Get today's date
      const newEntry = {
        date: today,
        weight: parseFloat(weight),
        calories: parseFloat(calories),
        calorieTarget: 2000, // Default calorie target
      };

      await addDoc(collection(db, "entries"), newEntry);
      onDataAdded(newEntry); // Trigger the callback
      onClose(); // Close the modal
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
      <Input
        placeholder="Enter calories (kcal)"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        type="number"
        required
      />
      <Button type="submit">Submit</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
