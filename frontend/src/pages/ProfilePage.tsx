import { useUser } from "../hooks/useUser";
import { useSummary } from "../hooks/useSummary";
import styles from "./styles/profile.module.scss";

export const ProfilePage = () => {
  const { user, setUser } = useUser();
  const token = localStorage.getItem("token");
  const { entries, weeklySummary } = useSummary(token);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleWeightUpdate = (newWeight: number) => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, weight: newWeight } : null
    );
  };

  const getWeightForDay = (day: string) => {
    const entry = entries.find(
      (entry) =>
        new Date(entry.date).toLocaleDateString("en-US", {
          weekday: "long",
        }) === day
    );
    return entry ? `${entry.weight} kg` : "No data";
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.header}>
        <h1>{user.name}</h1>
        <p>Stay focused and motivated!</p>
      </div>

      <div className={styles.statsSection}>
        <h2>Calorie Target</h2>
        <p>{user.calorieTarget} kcal/day</p>
      </div>

      <div className={styles.statsSection}>
        <h2>Current Weight</h2>
        <p className={styles.currentWeight}>{user.weight} kg</p>
      </div>

      <div className={styles.weeklyWeightSection}>
        <h2>Weekly Weight Overview</h2>
        <ul>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <li key={day}>
              {day}: <span>{getWeightForDay(day)}</span>
            </li>
          ))}
        </ul>
        <h3>
          Average Weight: {weeklySummary?.avgWeight?.toFixed(1) || "No data"} kg
        </h3>
      </div>

      <div className={styles.updateWeightSection}>
        <input
          type="number"
          placeholder="Enter new weight"
          onChange={(e) => handleWeightUpdate(Number(e.target.value))}
        />
        <button onClick={() => console.log("Update weight")}>Submit</button>
      </div>
    </div>
  );
};
