import { useEffect, useState } from "react";
import type { Match } from "../types/match";
import style from "./style.module.css";

type Props = {
  match: Match;
  onSelect?: (matchId: number, bet: keyof Match["odds"]) => void;
  selectedOdds?: { [key: string]: boolean };
};

const previousOddsMap = new Map<number, Match["odds"]>();

export default function MatchRow({ match, onSelect, selectedOdds }: Props) {
  const currentOdds = match.odds;
  const prevOdds = (previousOddsMap.get(match.id) || {}) as Partial<
    Match["odds"]
  >;

  const [flashMap, setFlashMap] = useState<Record<string, string>>({});

  // Update after render
  useEffect(() => {
    previousOddsMap.set(match.id, { ...currentOdds });
  }, [currentOdds, match.id]);

  const oddsButtons = Object.entries(currentOdds).map(([key, value]) => {
    const compoundKey = `${match.id}-${key}`;
    const isSelected = selectedOdds?.[compoundKey];
    const prev = prevOdds[key as keyof Match["odds"]];
    const isUp = prev !== undefined && value > prev;
    const isDown = prev !== undefined && value < prev;
    const flashKey = `${match.id}-${key}`;

    // Trigger flash effect on odds change
    useEffect(() => {
      if (isUp || isDown) {
        const classToApply = isUp ? style["odds-up"] : style["odds-down"];

        setFlashMap((prev) => ({
          ...prev,
          [flashKey]: classToApply,
        }));

        const timeout = setTimeout(() => {
          setFlashMap((prev) => {
            const updated = { ...prev };
            delete updated[flashKey];
            return updated;
          });
        }, 500); // Match animation duration

        return () => clearTimeout(timeout);
      }
    }, [value]);

    const btnClass = [
      style.button,
      isSelected ? style.selected : "",
      flashMap[flashKey] || "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        key={compoundKey}
        onClick={() => onSelect?.(match.id, key as keyof Match["odds"])}
        className={btnClass}
      >
        {key}: {value.toFixed(2)}
      </button>
    );
  });

  return (
    <div className={style["match-row"]}>
      <div className={style["teams"]}>
        <img
          src={`/icons/${match.sport.toLowerCase()}.svg`}
          alt={match.sport}
        />
        <span>
          {match.home} vs {match.away}
        </span>
      </div>

      <div className={style["match-info"]}>
        <div>{match.startTime}</div>
        <div>{match.score}</div>
      </div>

      <div className={style["odds-group"]}>{oddsButtons}</div>
    </div>
  );
}
