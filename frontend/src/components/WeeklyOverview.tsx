import { WeeklyOverviewProps } from "../types/ComponentTypes";

export const WeeklyOverview = ({
  weeklyData,
}: WeeklyOverviewProps & { averageWeight: string | number }) => {
  return (
    <div>
      <h2>Weekly Weight Overview</h2>
      <ul>
        {Object.entries(weeklyData).map(([day, weight]) => (
          <li key={day}>
            {day}: {typeof weight === "number" ? `${weight} kg` : weight}
          </li>
        ))}
      </ul>
    </div>
  );
};
