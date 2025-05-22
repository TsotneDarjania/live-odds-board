import { useEffect, useRef, useState } from "react";
import { generateMatches } from "../mockData/generateMatches";
import { startMockWebSocket } from "../mockData/mockWebSocket";
import { isSameMatch } from "../helper";
import type { Match } from "../types/match";

export function useMatches(count: number): Match[] {
  const [matches, setMatches] = useState<Match[]>([]);
  const matchRef = useRef<Match[]>([]);

  useEffect(() => {
    const data = generateMatches(count);
    setMatches(data);
    matchRef.current = data;
  }, [count]);

  useEffect(() => {
    matchRef.current = matches;
  }, [matches]);

  useEffect(() => {
    startMockWebSocket(
      () => matchRef.current,
      (updated) => {
        setMatches((prev) =>
          prev.map((match, i) =>
            isSameMatch(match, updated[i]) ? match : updated[i]
          )
        );
      }
    );
  }, []);

  return matches;
}
