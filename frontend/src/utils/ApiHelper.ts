import API_URL from "../config/apiConfig";
import { refreshToken } from "./authUtils"; // Handles token refresh
import {
  getFromLocalStorageWithExpiry,
  saveToLocalStorageWithExpiry,
} from "./storageHelpers"; // Manages localStorage token with expiry

const TOKEN_TTL = 60 * 60 * 1000; // Token TTL (1 hour)

export const fetchWithFirebaseToken = async <T>(
  endpoint: string,
  payload?: unknown,
  method: "POST" | "PUT" | "GET" | "DELETE" = "POST"
): Promise<T> => {
  const url = `${API_URL}/${endpoint}`;
  let currentToken = getFromLocalStorageWithExpiry<string>("firebaseToken");

  if (!currentToken) {
    console.warn("⏸️ No valid token found. Attempting token refresh...");
    try {
      currentToken = await refreshToken();
      saveToLocalStorageWithExpiry("firebaseToken", currentToken, TOKEN_TTL);
    } catch (error) {
      console.error("❌ Failed to refresh token. Aborting API call:", error);
      throw new Error("Unauthorized: Unable to refresh token.");
    }
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentToken}`,
    },
    body:
      payload && (method === "POST" || method === "PUT")
        ? JSON.stringify(payload)
        : undefined,
  };

  try {
    console.info(`📤 Making API call to ${url}`);
    const response = await fetch(url, options);

    if (response.ok) {
      return response.json() as Promise<T>;
    }

    if (response.status === 401) {
      console.warn("❗ Unauthorized (401). Retrying after refreshing token...");
      try {
        const refreshedToken = await refreshToken();
        saveToLocalStorageWithExpiry(
          "firebaseToken",
          refreshedToken,
          TOKEN_TTL
        );

        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${refreshedToken}`,
        };

        const retryResponse = await fetch(url, options);

        if (!retryResponse.ok) {
          const retryError = await retryResponse.json();
          throw new Error(retryError.message || "Retry request failed.");
        }

        return retryResponse.json() as Promise<T>;
      } catch (refreshError) {
        console.error("🔴 Token refresh failed during retry:", refreshError);
        throw new Error(
          "Authorization failed after retry. Please log in again."
        );
      }
    }

    const errorData = await response.json();
    console.error(`API Error (${response.status}):`, errorData);
    throw new Error(errorData.message || `Error ${response.status}`);
  } catch (err) {
    console.error("❌ Network or unexpected error:", err);
    throw new Error(
      err instanceof Error ? err.message : "Unknown error occurred."
    );
  }
};
