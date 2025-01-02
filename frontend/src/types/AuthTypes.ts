export interface SignInProps {
  onSuccess: () => void;
}

export interface RegisterUserProps {
  onSuccess: () => void;
}

export interface RegisterResponse {
  calorieTarget: number;
  message: string;
}

export interface LoginResponse {
  user: UserData;
}

export interface UserData {
  name: string;
  weight: number;
  calorieTarget: number;
}

export interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  sex: string;
  weight: string;
  age: string;
  height: string;
  activityLevel: string;
  acceptNotifications: boolean;
}
