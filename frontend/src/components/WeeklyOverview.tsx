import { WeeklyOverviewProps } from "../types/ComponentTypes";

export const WeeklyOverview = ({ weeklyData }: WeeklyOverviewProps) => {
  const calculateAverageWeight = () => {
    const weights = Object.values(weeklyData).filter(
      (weight) => typeof weight === "number"
    ) as number[];
    if (!weights.length) return "No data";

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    return (totalWeight / weights.length).toFixed(1);
  };

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
      <p>Average Weight: {calculateAverageWeight()} kg</p>
    </div>
  );
};
