import React, { useRef } from "react";
import type { Match } from "../types/match";
import style from "./style.module.css";

type Props = {
  match: Match;
  onSelect?: (matchId: number, bet: keyof Match["odds"]) => void;
  selectedOdds?: { [key: string]: boolean };
};

function MatchRow({ match, onSelect, selectedOdds }: Props) {
  const prevOddsRef = useRef<Partial<Match["odds"]>>({});
  const prevOdds = prevOddsRef.current;
  const currentOdds = match.odds;

  const oddsButtons = Object.entries(currentOdds).map(([key, value]) => {
    const compoundKey = `${match.id}-${key}`;
    const isSelected = selectedOdds?.[compoundKey];

    const prev = prevOdds?.[key as keyof Match["odds"]];
    const isUp = prev !== undefined && value > prev;
    const isDown = prev !== undefined && value < prev;

    const btnClass = [
      style.button,
      isSelected ? style.selected : "",
      isUp ? style["odds-up"] : "",
      isDown ? style["odds-down"] : "",
    ]
      .filter(Boolean)
      .join(" ");

    console.log(
      key,
      "prev:",
      prev,
      "current:",
      value,
      "isUp:",
      isUp,
      "isDown:",
      isDown
    );

    return (
      <button
        key={`${key}-${value}`} // <- this forces re-creation so CSS animation can trigger
        onClick={() => onSelect?.(match.id, key as keyof Match["odds"])}
        className={btnClass}
      >
        {key}: {value.toFixed(2)}
      </button>
    );
  });

  // update after render
  prevOddsRef.current = currentOdds;

  return (
    <div className={style["match-row"]}>
      <div className={style["teams"]}>
        <img
          src={`/icons/${match.sport.toLowerCase()}.svg`}
          alt={match.sport}
          title={match.sport}
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

export default MatchRow;
