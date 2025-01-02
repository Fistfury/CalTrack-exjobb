export interface InputProps {
  placeholder?: string;
  value?: string | number;
  name?: string;
  checked?: boolean;
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
  className?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "close";
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

export interface AddTodayWeightProps {
  onSubmit: () => void;
}

export interface WeeklyWeightEditorProps {
  onSubmit: () => void;
}

export interface UpdateWeightProps {
  currentWeight: number;
  onWeightUpdate: (newWeight: number) => void;
}

export interface WeeklyWeightFormProps {
  onWeightSubmit: (day: string, weight: number) => void;
}

export interface WeeklyOverviewProps {
  weeklyData: Record<string, number | "No data">;
}
