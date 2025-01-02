import { UserData } from "./calculationHelpers";

export const validateUserData = (data: any): UserData => {
  if (
    !data.activityLevel ||
    !data.sex ||
    data.age === undefined ||
    !data.height
  ) {
    throw new Error("Invalid user data: Missing required fields.");
  }

  return {
    activityLevel: data.activityLevel,
    sex: data.sex,
    age: data.age,
    height: data.height,
    weight: data.weight || 0,
    calorieTarget: data.calorieTarget || 0,
    proteins: data.proteins || 0,
    carbs: data.carbs || 0,
    fats: data.fats || 0,
  };
};
