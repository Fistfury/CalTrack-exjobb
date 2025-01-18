import { WeeklyOverviewProps } from "../types/ComponentTypes";
import { useTranslation } from "react-i18next";

export const WeeklyOverview = ({
  weeklyData,
}: WeeklyOverviewProps & { averageWeight: string | number }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("weeklyOverviewTitle")}</h2>
      <ul>
        {Object.entries(weeklyData).map(([day, weight]) => (
          <li key={day}>
            {t(day.toLowerCase())}:{" "}
            {typeof weight === "number"
              ? `${weight} ${t("weightUnit")}`
              : weight}
          </li>
        ))}
      </ul>
    </div>
  );
};
