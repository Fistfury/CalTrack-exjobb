import { useUser } from "../hooks/useUser";
import { useSummary } from "../hooks/useSummary";
import { Calendar } from "react-calendar";

import styles from "./styles/dashboard.module.scss";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { WeeklyWeightEditor } from "../components/WeeklyWeightEditor";

export const DashboardPage = () => {
  const { user } = useUser();
  const { entries, error, refreshSummary } = useSummary("token");

  const [showWeightEditor, setShowWeightEditor] = useState(false);

  const handleWeightSubmit = () => {
    setShowWeightEditor(false);
    refreshSummary(); // Refresh the summary after adding weights
  };

  const getTileClass = (date: Date) => {
    const entry = entries.find(
      (entry) => entry.date === date.toISOString().split("T")[0]
    );
    if (!entry) return null;

    const calorieTarget = user?.calorieTarget || 0;
    const isAchieved = entry.calories <= calorieTarget; // Compare entry calories with user's calorie target

    if (entry.date === new Date().toISOString().split("T")[0] && isAchieved) {
      return styles.greenTile; // Today's weight met the target
    }

    const diff = Math.abs(entry.calories - calorieTarget);
    if (diff <= calorieTarget * 0.1) return styles.greenTile;
    if (diff <= calorieTarget * 0.2) return styles.yellowTile;
    return styles.redTile;
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome, {user.name}</h1>
        <p>Your calorie target: {user.calorieTarget} kcal</p>
        <p>
          You've met your calorie target on{" "}
          {entries.filter((e) => e.achieved).length} out of 7 days this week.
        </p>
      </header>

      {showWeightEditor && <WeeklyWeightEditor onSubmit={handleWeightSubmit} />}

      <div className={styles.calendarContainer}>
        <Calendar
          tileClassName={({ date }) => getTileClass(date)}
          tileContent={({ date }) => {
            const entry = entries.find(
              (entry) => entry.date === date.toISOString().split("T")[0]
            );
            return entry ? (
              <div className={styles.tileContent}>
                <p>{entry.calories || 0} kcal</p>
                <p>{entry.achieved ? "✅" : "❌"}</p>
              </div>
            ) : null;
          }}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
