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
      className={`${style["match-row"]} ${
        isOddRow ? style["odd"] : style["even"]
      }`}
    >
      <div className={style["teams"] + " custom-font-1"}>
        <img
          src={`/icons/${match.sport.toLowerCase()}.svg`}
          alt={match.sport}
        />
        <span>
          {match.home} vs {match.away}
        </span>
      </div>

      <div className={style["match-info"] + " custom-font-1"}>
        <div className={style["match-time"]}>{match.startTime}</div>
        <div className={style["match-score"]}>{match.score}</div>
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
