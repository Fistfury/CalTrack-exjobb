import { useUser } from "../hooks/useUser";
import { useSummary } from "../hooks/useSummary";
import { WeeklyOverview } from "../components/WeeklyOverview";
import { AddData } from "../components/AddData";
import styles from "./styles/profile.module.scss";
import { useState } from "react";

export const ProfilePage = () => {
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const { entries, weeklySummary, error } = useSummary(token);
  const [showAddDataModal, setShowAddDataModal] = useState(false);

  console.log("👤 User Data:", user);
  console.log("📦 Weekly Summary Data:", weeklySummary);
  console.log("📅 Weekly Entries:", entries);

  if (!user) {
    console.warn("⚠️ User not loaded, rendering fallback...");
    return <p>Loading...</p>;
  }

  const getWeeklyData = () => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const weeklyData: Record<string, number | "No data"> = {};

    daysOfWeek.forEach((day) => {
      const entry = entries.find(
        (entry) =>
          new Date(entry.date).toLocaleDateString("en-US", {
            weekday: "long",
          }) === day
      );
      weeklyData[day] = entry ? entry.weight : "No data";
    });

    return weeklyData;
  };

  return (
    <div className={styles.profilePage}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>{user.name}</h1>
        <p>Stay focused and motivated!</p>
      </div>

      {/* Calorie and Macronutrient Target */}
      <div className={styles.targets}>
        <div className={styles.targetBox}>
          <h3>Proteins</h3>
          <p>{weeklySummary?.proteins?.toFixed(1) || "N/A"} g/day</p>
        </div>
        <div className={styles.targetBox}>
          <h3>Carbs</h3>
          <p>{weeklySummary?.carbs?.toFixed(1) || "N/A"} g/day</p>
        </div>
        <div className={styles.targetBox}>
          <h3>Fats</h3>
          <p>{weeklySummary?.fats?.toFixed(1) || "N/A"} g/day</p>
        </div>
        <div className={styles.targetBox}>
          <h3>Calorie Target</h3>
          <p>{weeklySummary?.avgCalories?.toFixed(1) || "N/A"} kcal/day</p>
        </div>
      </div>

      {/* Current Weight */}
      <div className={styles.currentWeight}>
        <h2>Current Weight</h2>
        <p>{user.weight || "N/A"} kg</p>
        <button
          onClick={() => setShowAddDataModal(true)}
          className={styles.addWeightButton}
        >
          Update Weight
        </button>
      </div>

      {/* Weekly Overview */}
      <div className={styles.weeklyOverview}>
        <h2>Weekly Weight Overview</h2>
        <WeeklyOverview weeklyData={getWeeklyData()} />
        <p className={styles.averageWeight}>
          Average Weight:{" "}
          {weeklySummary?.avgWeight
            ? `${weeklySummary.avgWeight.toFixed(1)} kg`
            : "No data"}
        </p>
      </div>

      {/* Add Data Modal */}
      {showAddDataModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowAddDataModal(false)}
            >
              ✖
            </button>
            <AddData
              onClose={() => setShowAddDataModal(false)}
              onDataAdded={(newEntry) => {
                console.log("New entry added:", newEntry);
                window.location.reload(); // Temporary fix to refresh state
              }}
            />
          </div>
        </div>
      )}

      {/* Error Handling */}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
