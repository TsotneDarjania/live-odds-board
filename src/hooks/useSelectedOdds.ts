import { useState } from "react";
import type { Match } from "../types/match";

export function useSelectedOdds() {
  const [selectedOdds, setSelectedOdds] = useState<{ [key: string]: boolean }>(
    () => JSON.parse(localStorage.getItem("selectedOdds") || "{}")
  );

  const handleSelect = (matchId: number, betKey: keyof Match["odds"]) => {
    const key = `${matchId}-${betKey}`;
    setSelectedOdds((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("selectedOdds", JSON.stringify(updated));
      return updated;
    });
  };

  return [selectedOdds, handleSelect] as const;
}
