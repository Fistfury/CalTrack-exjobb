import { useUser } from "../hooks/useUser";
import { useSummary } from "../hooks/useSummary";
import styles from "./styles/profile.module.scss";
import { useState } from "react";
import { AddTodayWeight } from "../components/AddTodayWeight";
import { WeeklyWeightEditor } from "../components/WeeklyWeightEditor";
import { Button } from "../components/Button";
import { getFromLocalStorageWithExpiry } from "../utils/storageHelpers";

export const ProfilePage = () => {
  const { user, loading: userLoading } = useUser(); // Get user and loading state
  const token = getFromLocalStorageWithExpiry<string>("firebaseToken"); // Retrieve token

  const { entries, weeklySummary, error, refreshSummary } = useSummary(token);

  const [showTodayWeightModal, setShowTodayWeightModal] = useState(false);
  const [showWeeklyEditorModal, setShowWeeklyEditorModal] = useState(false);

  if (userLoading) {
    return <p>Loading user data...</p>;
  }

  if (!user || !token) {
    return <p>Please log in to view your profile.</p>;
  }

  const refreshData = () => {
    refreshSummary();
  };

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

    const todayEntry = entries.find(
      (entry) => entry.date === new Date().toISOString().split("T")[0]
    );
    const todaysWeight = todayEntry?.weight || null;

    const weeklyData: Record<
      string,
      { weight: number | "No data"; achieved: boolean | null }
    > = {};

    daysOfWeek.forEach((day) => {
      const entry = entries.find(
        (entry) =>
          new Date(entry.date).toLocaleDateString("en-US", {
            weekday: "long",
          }) === day
      );

      weeklyData[day] = entry
        ? {
            weight: entry.weight,
            achieved:
              todaysWeight !== null ? entry.weight <= todaysWeight : null,
          }
        : {
            weight: "No data",
            achieved: null,
          };
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
      {/* Calorie and Macro Goals */}
      <div className={styles.targetsWrapper}>
        <h2>Calorie and macro goals</h2>
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
            <p>{weeklySummary?.avgCalories?.toFixed(0) || "N/A"} kcal/day</p>
          </div>
        </div>
      </div>
      {/* Avarage weight*/}
      <div className={styles.currentWeight}>
        <h2>Avarage weight</h2>
        <p>{weeklySummary?.avgWeight?.toFixed(1) || "N/A"} kg</p>
        <div className={styles.buttons}>
          <button onClick={() => setShowTodayWeightModal(true)}>
            <i className="fas fa-weight"></i>
            Add Today's Weight
          </button>
          <button onClick={() => setShowWeeklyEditorModal(true)}>
            <i className="fas fa-edit"></i>
            Edit Weekly Weights
          </button>
        </div>
      </div>
      {/* Weekly Overview */}
      <div className={styles.weeklyOverview}>
        <h2>Weekly Weight Overview</h2>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Weight</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(getWeeklyData()).map(([day, data]) => (
              <tr key={day}>
                <td>{day}</td>
                <td>
                  {typeof data.weight === "number"
                    ? `${data.weight} kg`
                    : data.weight}
                </td>
                <td>
                  {data.achieved === null
                    ? "No data"
                    : data.achieved
                    ? "✅"
                    : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showTodayWeightModal && (
        <div className={styles.modal} tabIndex={-1}>
          <div className={styles.modalContent}>
            <Button
              type="button"
              onClick={() => setShowTodayWeightModal(false)}
            >
              ✖
            </Button>
            <AddTodayWeight
              onSubmit={() => {
                refreshData();
                setShowTodayWeightModal(false);
              }}
            />
          </div>
        </div>
      )}
      {showWeeklyEditorModal && (
        <div className={styles.modal} tabIndex={-1}>
          <div className={styles.modalContent}>
            <Button
              type="button"
              onClick={() => setShowWeeklyEditorModal(false)}
            >
              ✖
            </Button>
            <WeeklyWeightEditor
              onSubmit={() => {
                refreshData();
                setShowWeeklyEditorModal(false);
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
