import { useEffect, useState } from "react";
import { Calendar } from "react-calendar";
import { useUser } from "../context/UserContext";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import styles from "./styles/dashboard.module.scss";
import "react-calendar/dist/Calendar.css";

interface Entry {
  date: string;
  calories: number;
  weight: number;
  achieved: boolean;
  userId: string;
}

export const DashboardPage = () => {
  const { user } = useUser();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [weeklySummary, setWeeklySummary] = useState({
    avgWeight: 0,
    avgCalories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
  });

  const fetchEntries = async () => {
    if (!user) return;

    try {
      const entriesRef = collection(db, "entries");
      const querySnapshot = await getDocs(entriesRef);
      const fetchedEntries: Entry[] = querySnapshot.docs
        .map((doc) => doc.data() as Entry)
        .filter((entry) => entry.userId === user.id);

      setEntries(fetchedEntries);
      calculateWeeklySummary(fetchedEntries);
    } catch (err) {
      console.error("Error fetching entries:", err);
      setError("Failed to load entries.");
    }
  };

  const addEntry = async (date: string, weight: number) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "entries"), {
        userId: user.id,
        date,
        calories: 1500, // Default calorie value
        weight, // User-provided weight value
        achieved: true, // Default achieved value
      });
      fetchEntries();
    } catch (err) {
      console.error("Error adding entry:", err);
      setError("Failed to add entry.");
    }
  };

  const calculateWeeklySummary = (entries: Entry[]) => {
    if (!entries.length) return;

    const totalCalories = entries.reduce(
      (sum, entry) => sum + entry.calories,
      0
    );
    const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
    const avgWeight = totalWeight / entries.length;
    const avgCalories = totalCalories / entries.length;

    const proteins = (avgCalories * 0.25) / 4; // 25% calories from proteins
    const carbs = (avgCalories * 0.5) / 4; // 50% calories from carbs
    const fats = (avgCalories * 0.25) / 9; // 25% calories from fats

    setWeeklySummary({ avgWeight, avgCalories, proteins, carbs, fats });
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>CalTrack</h1>
        <nav>
          <button
            onClick={() => addEntry(new Date().toISOString().split("T")[0], 70)}
          >
            Update Weight
          </button>
        </nav>
      </header>
      <div className={styles.centeredContent}>
        <h1>Welcome, {user?.name || "Guest"}!</h1>
        <Calendar
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
        <div className={styles.weeklySummary}>
          <h2>Weekly Summary</h2>
          <p>Average Weight: {weeklySummary.avgWeight.toFixed(1)} kg</p>
          <p>Calories: {weeklySummary.avgCalories.toFixed(1)} kcal</p>
          <p>Proteins: {weeklySummary.proteins.toFixed(1)} g</p>
          <p>Carbs: {weeklySummary.carbs.toFixed(1)} g</p>
          <p>Fats: {weeklySummary.fats.toFixed(1)} g</p>
        </div>
      </div>
    </div>
  );
};
