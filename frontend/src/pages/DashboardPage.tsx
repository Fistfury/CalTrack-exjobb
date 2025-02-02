import { useUser } from "../hooks/useUser";
import { useSummary } from "../hooks/useSummary";
import { Calendar } from "react-calendar";

import styles from "./styles/dashboard.module.scss";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { WeeklyWeightEditor } from "../components/WeeklyWeightEditor";
import { useTranslation } from "react-i18next";

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { entries, weeklySummary, error, refreshSummary } = useSummary("token");

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
    return <p>{t("loadingUserData")}</p>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>{t("welcomeUser", { name: user.name })}</h1>
        <h2>{t("calorieTarget")}</h2>
        <p>
          {weeklySummary?.avgCalories?.toFixed(0) || t("notAvailable")} kcal/
          {t("day")}
        </p>
        <p>
          {t("calorieTargetMet", {
            days: entries.filter((e) => e.achieved).length,
          })}
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
                <p>
                  {weeklySummary?.avgCalories?.toFixed(0) || t("notAvailable")}{" "}
                  kcal
                </p>
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
