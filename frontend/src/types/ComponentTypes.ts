export interface InputProps {
  placeholder: string;
  value: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  size?: "small" | "large";
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
}

export interface AddDataProps {
  onClose: () => void;
  onDataAdded: (newEntry: {
    date: string;
    weight: number;
    calories: number;
    calorieTarget: number;
  }) => void;
}

export interface UpdateWeightProps {
  token: string;
  currentWeight: number;
  onWeightUpdate: (newWeight: number) => void;
}

export interface WeeklyWeightFormProps {
  token: string;
  onWeightSubmit: (day: string, weight: number) => void;
}

export interface WeeklyOverviewProps {
  weeklyData: Record<string, number | "No data">;
}
