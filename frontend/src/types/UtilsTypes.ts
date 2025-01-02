export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface JwtPayload {
  exp?: number;
  iat?: number;
  aud?: string;
  iss?: string;
  sub?: string;
  email?: string;
  [key: string]: string | number | undefined;
}
