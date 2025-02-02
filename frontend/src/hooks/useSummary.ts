import { useState, useEffect, useCallback } from "react";
import { fetchWithFirebaseToken } from "../utils/ApiHelper";
import { Entry, SummaryResponse } from "../types/UserTypes";

export const useSummary = (token: string | null) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<
    SummaryResponse["weeklySummary"] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(
    async (retries = 3) => {
      if (!token) {
        console.warn("⏸️ Skipping fetchSummary: No token available.");
        setError("Token is missing. Please log in again.");
        return;
      }

      try {
        const response: SummaryResponse = await fetchWithFirebaseToken(
          "entries/summary",
          undefined,
          "GET"
        );
        setEntries(response.entries || []);
        setWeeklySummary(response.weeklySummary || null);
      } catch (err) {
        if (retries > 0) {
          console.warn(
            `Retrying fetchSummary... (${retries - 1} retries left)`
          );
          setTimeout(() => fetchSummary(retries - 1), 1000); // Delay retries
        } else {
          console.error("❌ Failed to fetch summary after retries:", err);
          setError("Failed to fetch summary. Please try again later.");
        }
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchSummary();
    }
  }, [fetchSummary, token]);

  return { entries, weeklySummary, error, refreshSummary: fetchSummary };
};
