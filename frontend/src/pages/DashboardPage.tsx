import { useUser } from "../hooks/useUser";
import { useSummary } from "../hooks/useSummary";
import { Calendar } from "react-calendar";
import styles from "./styles/dashboard.module.scss";
import "react-calendar/dist/Calendar.css";

export const DashboardPage = () => {
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const { entries, weeklySummary, error } = useSummary(token);

  const getTileClass = (date: Date) => {
    const entry = entries.find(
      (entry) => entry.date === date.toISOString().split("T")[0]
    );
    if (!entry) return null;
    const diff = Math.abs(entry.calories - (user?.calorieTarget || 0));
    if (diff <= (user?.calorieTarget || 0) * 0.1) return styles.green; // Within 10%
    if (diff <= (user?.calorieTarget || 0) * 0.2) return styles.yellow; // Within 20%
    return styles.red; // Outside 20%
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>CalTrack Dashboard</h1>
      </header>

      <Calendar
        tileClassName={({ date }) => getTileClass(date)}
        tileContent={({ date }) => {
          const entry = entries.find(
            (entry) => entry.date === date.toISOString().split("T")[0]
          );
          return entry ? (
            <div className={styles.tileContent}>
              <p>{entry.calories} kcal</p>
              <p>{entry.achieved ? "✅" : "❌"}</p>
            </div>
          ) : null;
        }}
      />

      {error && <p className={styles.error}>{error}</p>}

      {weeklySummary && (
        <div className={styles.weeklySummary}>
          <h2>Weekly Summary</h2>
          <p>Average Weight: {weeklySummary.avgWeight.toFixed(1)} kg</p>
          <p>Calories: {weeklySummary.avgCalories.toFixed(1)} kcal</p>
          <p>Proteins: {weeklySummary.proteins.toFixed(1)} g</p>
          <p>Carbs: {weeklySummary.carbs.toFixed(1)} g</p>
          <p>Fats: {weeklySummary.fats.toFixed(1)} g</p>
        </div>
      )}
    </div>
  );
};
