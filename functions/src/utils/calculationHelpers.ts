export interface UserData {
  activityLevel: string; // e.g., "sedentary", "moderate", etc.
  sex: "male" | "female";
  age: number;
  height: number;
  weight?: number; // Optional, as weight might be updated dynamically
  calorieTarget?: number; // Optional, might not exist initially
  proteins?: number; // Optional, derived field
  carbs?: number; // Optional, derived field
  fats?: number; // Optional, derived field
  caloriesMet?: boolean; // Optional, derived field
}

export const calculateMacros = (
  userData: UserData,
  weight: number | undefined = userData.weight
) => {
  if (!weight) {
    throw new Error("Weight is required for macro calculations.");
  }

  const activityMultiplierMap: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const multiplier = activityMultiplierMap[userData.activityLevel];
  const bmr =
    userData.sex === "male"
      ? 10 * weight + 6.25 * userData.height - 5 * userData.age + 5
      : 10 * weight + 6.25 * userData.height - 5 * userData.age - 161;

  const calorieTarget = Math.round(bmr * multiplier - 500); // Adjust calorie deficit
  const proteins = Math.round((calorieTarget * 0.25) / 4);
  const carbs = Math.round((calorieTarget * 0.5) / 4);
  const fats = Math.round((calorieTarget * 0.25) / 9);

  return { calorieTarget, proteins, carbs, fats };
};

// Helper: Calculate Weekly Summary
export const calculateWeeklySummary = (entries: any[]) => {
  if (!entries.length) {
    return {
      avgCalories: 0,
      avgWeight: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
    };
  }

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);

  const avgCalories = totalCalories / entries.length;
  const avgWeight = totalWeight / entries.length;

  const proteins = Math.round((avgCalories * 0.25) / 4);
  const carbs = Math.round((avgCalories * 0.5) / 4);
  const fats = Math.round((avgCalories * 0.25) / 9);

  return {
    avgCalories,
    avgWeight,
    proteins,
    carbs,
    fats,
  };
};
