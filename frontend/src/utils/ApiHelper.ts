import API_URL from "../config/apiConfig";

export const fetchWithFirebaseToken = async (
  endpoint: string, // Only provide the endpoint, not the full URL
  token: string,
  payload?: unknown, // Optional payload
  method: "POST" | "PUT" | "GET" | "DELETE" = "POST" // Add support for more HTTP methods
) => {
  const url = `${API_URL}/${endpoint}`; // Construct the full URL using API_URL

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // Attach the payload only for methods that support a body
  if (payload && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "An error occurred.");
  }

  return response.json();
};
