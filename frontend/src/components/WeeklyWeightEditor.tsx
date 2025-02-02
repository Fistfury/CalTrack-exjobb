import { useState, useEffect } from "react";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import modalStyles from "../styles/shared/modal.module.scss";
import { WeeklyWeightEditorProps } from "../types/ComponentTypes";
import { Button } from "./Button";
import { Input } from "./Input";
import { useTranslation } from "react-i18next";

export const WeeklyWeightEditor = ({ onSubmit }: WeeklyWeightEditorProps) => {
  const { t } = useTranslation();

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [weights, setWeights] = useState<Record<string, string>>(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: "" }), {})
  );
  const [todaysWeight, setTodaysWeight] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateDateFromDay = (day: string): string => {
    const today = new Date();
    const todayIndex = today.getDay();
    const dayIndex = daysOfWeek.indexOf(day);

    const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
    const diff = dayIndex - adjustedTodayIndex;

    const targetDate = new Date();
    targetDate.setDate(today.getDate() + diff);

    return targetDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchTodaysWeight = async () => {
      try {
        const response = await fetchWithFirebaseToken(
          "entries/summary",
          undefined,
          "GET"
        );
        const today = new Date().toISOString().split("T")[0];
        const typedResponse = response as {
          entries: { date: string; weight: number }[];
        };
        const todayEntry = typedResponse.entries.find(
          (entry) => entry.date === today
        );
        setTodaysWeight(todayEntry?.weight || null);
      } catch (err) {
        console.error(t("fetchWeightError"), err);
        setTodaysWeight(null);
      }
    };

    fetchTodaysWeight();
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      for (const [day, weight] of Object.entries(weights)) {
        if (weight) {
          const weightValue = parseFloat(weight);

          const achieved = todaysWeight !== null && weightValue <= todaysWeight;

          const date = generateDateFromDay(day);

          const payload = {
            weight: weightValue,
            date,
            achieved,
          };

          await fetchWithFirebaseToken("entries", payload, "POST");
        }
      }

      onSubmit();
      setWeights(daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: "" }), {}));
    } catch (err) {
      console.error(t("addWeightsError"), err);
      setError(t("addWeightsError"));
    }
  };

  const handleInputChange = (day: string, value: string) => {
    setWeights((prev) => ({ ...prev, [day]: value }));
  };

  return (
    <div className={modalStyles.modal}>
      <div className={modalStyles.modalContent}>
        <header className={modalStyles.modalHeader}>
          <h2>{t("editWeeklyWeights")}</h2>
          <Button
            type="button"
            onClick={onSubmit}
            className={modalStyles.closeButton}
            variant="close"
          >
            ✖
          </Button>
        </header>
        <form className={modalStyles.form} onSubmit={handleSubmit}>
          {daysOfWeek.map((day) => (
            <div key={day} className={modalStyles.inputGroup}>
              <label>{t(day)}</label>
              <Input
                type="number"
                placeholder={t("weightPlaceholder", { day: t(day) })}
                value={weights[day]}
                onChange={(e) => handleInputChange(day, e.target.value)}
              />
            </div>
          ))}
          <Button type="submit">{t("submit")}</Button>
        </form>
        {error && <p className={modalStyles.error}>{error}</p>}
      </div>
    </div>
  );
};
