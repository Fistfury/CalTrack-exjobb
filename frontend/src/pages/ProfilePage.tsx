import { useUser } from "../hooks/useUser";
import { useSummary } from "../hooks/useSummary";
import styles from "./styles/profile.module.scss";
import { useState } from "react";
import { AddTodayWeight } from "../components/AddTodayWeight";
import { WeeklyWeightEditor } from "../components/WeeklyWeightEditor";
import { getFromLocalStorageWithExpiry } from "../utils/storageHelpers";
import { useTranslation } from "react-i18next";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, loading: userLoading } = useUser(); // Get user and loading state
  const token = getFromLocalStorageWithExpiry<string>("firebaseToken"); // Retrieve token

  const { entries, weeklySummary, error, refreshSummary } = useSummary(token);

  const [showTodayWeightModal, setShowTodayWeightModal] = useState(false);
  const [showWeeklyEditorModal, setShowWeeklyEditorModal] = useState(false);

  if (userLoading) {
    return <p>{t("loadingUser")}</p>;
  }

  if (!user || !token) {
    return <p>{t("pleaseLogIn")}</p>;
  }

  const refreshData = () => {
    refreshSummary();
  };

  const getWeeklyData = () => {
    const daysOfWeek = [
      t("monday"),
      t("tuesday"),
      t("wednesday"),
      t("thursday"),
      t("friday"),
      t("saturday"),
      t("sunday"),
    ];

    const todayEntry = entries.find(
      (entry) => entry.date === new Date().toISOString().split("T")[0]
    );
    const todaysWeight = todayEntry?.weight || null;

    const weeklyData: Record<
      string,
      { weight: number | string; achieved: boolean | null }
    > = {};

    daysOfWeek.forEach((day, index) => {
      const localizedDay = new Date(2023, 0, index + 1).toLocaleDateString(
        t("locale"),
        {
          weekday: "long",
        }
      );

      const entry = entries.find(
        (entry) =>
          new Date(entry.date).toLocaleDateString(t("locale"), {
            weekday: "long",
          }) === localizedDay
      );

      weeklyData[day] = entry
        ? {
            weight: entry.weight,
            achieved:
              todaysWeight !== null ? entry.weight <= todaysWeight : null,
          }
        : {
            weight: t("noData"),
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
        <p>{t("stayMotivated")}</p>
      </div>
      {/* Calorie and Macro Goals */}
      <div className={styles.targetsWrapper}>
        <h2>{t("calorieMacroGoals")}</h2>
        <div className={styles.targets}>
          <div className={styles.targetBox}>
            <h3>{t("proteins")}</h3>
            <p>
              {weeklySummary?.proteins?.toFixed(1) || t("notAvailable")} g/
              {t("day")}
            </p>
          </div>
          <div className={styles.targetBox}>
            <h3>{t("carbs")}</h3>
            <p>
              {weeklySummary?.carbs?.toFixed(1) || t("notAvailable")} g/
              {t("day")}
            </p>
          </div>
          <div className={styles.targetBox}>
            <h3>{t("fats")}</h3>
            <p>
              {weeklySummary?.fats?.toFixed(1) || t("notAvailable")} g/
              {t("day")}
            </p>
          </div>
          <div className={styles.targetBox}>
            <h3>{t("calorieTarget")}</h3>
            <p>
              {weeklySummary?.avgCalories?.toFixed(0) || t("notAvailable")}{" "}
              kcal/{t("day")}
            </p>
          </div>
        </div>
      </div>
      {/* Average weight */}
      <div className={styles.currentWeight}>
        <h2>{t("averageWeight")}</h2>
        <p>{weeklySummary?.avgWeight?.toFixed(1) || t("notAvailable")} kg</p>
        <div className={styles.buttons}>
          <button onClick={() => setShowTodayWeightModal(true)}>
            <i className="fas fa-weight"></i>
            {t("addTodaysWeight")}
          </button>
          <button onClick={() => setShowWeeklyEditorModal(true)}>
            <i className="fas fa-edit"></i>
            {t("editWeeklyWeights")}
          </button>
        </div>
      </div>
      {/* Weekly Overview */}
      <div className={styles.weeklyOverview}>
        <h2>{t("weeklyWeightOverview")}</h2>
        <table>
          <thead>
            <tr>
              <th>{t("Day")}</th>
              <th>{t("weight")}</th>
              <th>{t("status")}</th>
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
                    ? t("noData")
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
