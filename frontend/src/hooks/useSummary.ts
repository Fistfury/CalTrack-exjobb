import { useState, useEffect } from "react";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import { SummaryResponse } from "../types/UserTypes";

export const useSummary = (token: string | null) => {
  const [entries, setEntries] = useState<SummaryResponse["entries"]>([]);
  const [weeklySummary, setWeeklySummary] = useState<
    SummaryResponse["weeklySummary"] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      console.error("🚨 Missing token, cannot fetch summary.");
      setError("Authorization token missing. Please log in again.");
      return;
    }

    const fetchSummary = async () => {
      console.log("Fetching summary with token:", token);

      try {
        const response: SummaryResponse = await fetchWithFirebaseToken(
          "entries/summary",
          token,
          undefined,
          "GET"
        );

        console.log("Summary response received:", response);

        // Debugging response validation
        if (!response.entries || !Array.isArray(response.entries)) {
          console.warn("⚠️ Response entries are missing or invalid.");
        }

        if (!response.weeklySummary) {
          console.warn("⚠️ Weekly summary is missing from the response.");
        }

        // Validate and set data
        setEntries(response.entries || []);
        setWeeklySummary(response.weeklySummary || null);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        setError("Failed to fetch summary. Please try again.");
      }
    };

    fetchSummary();
  }, [token]);

  return { entries, weeklySummary, error };
};
