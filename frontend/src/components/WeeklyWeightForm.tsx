import { useState } from "react";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import { WeeklyWeightFormProps } from "../types/ComponentTypes";

export const WeeklyWeightForm = ({
  token,
  onWeightSubmit,
}: WeeklyWeightFormProps) => {
  const [day, setDay] = useState("Monday");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !day) {
      setError("Day and weight are required.");
      return;
    }

    try {
      const formattedDate = getFormattedDateForDay(day); // Helper to get correct date
      const entryData = { date: formattedDate, weight: parseFloat(weight) };

      await fetchWithFirebaseToken("entries", token, entryData, "POST");
      onWeightSubmit(day, parseFloat(weight));
      setWeight("");
      setError(null);
    } catch (err) {
      console.error("Failed to submit manual weight:", err);
      setError("Failed to submit weight. Please try again.");
    }
  };

  const getFormattedDateForDay = (day: string): string => {
    const today = new Date();
    const dayIndex = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].indexOf(day);
    const diff = (dayIndex - today.getDay() + 7) % 7; // Calculate the offset
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff); // Get target date
    return targetDate.toISOString().split("T")[0];
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Day:
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </label>
      <label>
        Weight (kg):
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight"
        />
      </label>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
};
