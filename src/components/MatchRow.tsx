import type { Match } from "../types/match";
import MatchOddButton from "./oddButton/OddButton";
import style from "./style.module.css";

type Props = {
  match: Match;
  onSelect?: (matchId: number, bet: keyof Match["odds"]) => void;
  selectedOdds?: { [key: string]: boolean };
  isOddRow: boolean;
};

export default function MatchRow({
  match,
  onSelect,
  selectedOdds,
  isOddRow,
}: Props) {
  return (
    <div
      style={{
        backgroundColor: isOddRow ? "#202020" : "#2a2a2a", // alternating colors
        padding: "16px",
        borderBottom: "1px solid #333",
      }}
      className={style["match-row"]}
    >
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

      <div className={style["odds-group"]}>
        {Object.entries(match.odds).map(([key, value]) => {
          const compoundKey = `${match.id}-${key}`;
          const isSelected = selectedOdds?.[compoundKey] ?? false;

          return (
            <MatchOddButton
              key={compoundKey}
              matchId={match.id}
              keyName={key}
              value={value}
              isSelected={isSelected}
              onSelect={() => onSelect?.(match.id, key as keyof Match["odds"])}
            />
          );
        })}
      </div>
    </div>
  );
}
