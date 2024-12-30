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
      setError("Authorization token missing. Please log in again.");
      setEntries([]);
      setWeeklySummary(null);
      return;
    }

    const fetchSummary = async () => {
      try {
        setError(null); // Reset error state
        const data = await fetchWithFirebaseToken<SummaryResponse>(
          "entries/summary",
          token
        );
        setEntries(data.entries);
        setWeeklySummary(data.weeklySummary);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setError("Failed to fetch summary data. Please try again.");
        setEntries([]); // Clear entries on error
        setWeeklySummary(null); // Clear weekly summary on error
      }
    };

    fetchSummary();
  }, [token]);

  return { entries, weeklySummary, error };
};
