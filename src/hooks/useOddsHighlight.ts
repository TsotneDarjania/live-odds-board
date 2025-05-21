import { useEffect, useRef, useState } from "react";
import type { Match } from "../types/match";

type ChangeMap = {
  [matchId: number]: {
    [key in keyof Match["odds"]]?: "odds-up" | "odds-down";
  };
};

export function useOddsHighlight(matches: Match[]) {
  const previousOddsRef = useRef<Map<number, Match["odds"]>>(new Map());
  const [changes, setChanges] = useState<ChangeMap>({});

  useEffect(() => {
    const newChanges: ChangeMap = {};

    for (const match of matches) {
      const prev = previousOddsRef.current.get(match.id);

      if (!prev) {
        previousOddsRef.current.set(match.id, { ...match.odds });
        continue;
      }

      const change: ChangeMap[number] = {};
      for (const key of Object.keys(match.odds) as (keyof Match["odds"])[]) {
        const prevVal = prev[key];
        const currVal = match.odds[key];

        if (currVal > prevVal) change[key] = "odds-up";
        else if (currVal < prevVal) change[key] = "odds-down";
      }

      if (Object.keys(change).length > 0) {
        newChanges[match.id] = change;
      }

      previousOddsRef.current.set(match.id, { ...match.odds });
    }

    setChanges(newChanges);
    const timeout = setTimeout(() => setChanges({}), 1000);
    return () => clearTimeout(timeout);
  }, [matches]);

  return changes;
}
