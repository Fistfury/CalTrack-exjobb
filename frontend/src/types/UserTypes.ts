import { StateSetter } from "./UtilsTypes";

export interface User {
  id: string;
  name: string;
  weight: number;
  calorieTarget: number;
}

export interface WeeklySummary {
  avgWeight: number;
  avgCalories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

export interface Entry {
  date: string;
  calories: number;
  weight: number;
  achieved: boolean;
  userId: string;
}

export interface SummaryResponse {
  userId(arg0: Entry[], userId: unknown): unknown;
  entries: Entry[];
  weeklySummary: WeeklySummary;
}

export interface UserContextType {
  user: User | null;
  setUser: StateSetter<User | null>;
  isLoggedIn: () => boolean;
  logout: () => void;
  loading: boolean;
}
