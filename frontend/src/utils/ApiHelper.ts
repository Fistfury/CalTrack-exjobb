import API_URL from "../config/apiConfig";

export const fetchWithFirebaseToken = async <T>(
  endpoint: string,
  token: string,
  payload?: unknown,
  method: "POST" | "PUT" | "GET" = "POST"
): Promise<T> => {
  const url = `${API_URL}/${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body:
      payload && (method === "POST" || method === "PUT")
        ? JSON.stringify(payload)
        : undefined,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred.");
  }

  return response.json() as Promise<T>;
};
