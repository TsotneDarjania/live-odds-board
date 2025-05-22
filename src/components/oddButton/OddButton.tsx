import { useEffect, useState } from "react";
import style from "./style.module.css";

type Props = {
  matchId: number;
  keyName: string;
  value: number;
  isSelected: boolean;
  onSelect?: () => void;
};

const previousOddsMap = new Map<string, number>();

export default function MatchOddButton({
  matchId,
  keyName,
  value,
  isSelected,
  onSelect,
}: Props) {
  const compoundKey = `${matchId}-${keyName}`;
  const [flashClass, setFlashClass] = useState<string | null>(null);
  const [delta, setDelta] = useState<number | null>(null);

  const prev = previousOddsMap.get(compoundKey);
  const isUp = prev !== undefined && value > prev;
  const isDown = prev !== undefined && value < prev;

  useEffect(() => {
    previousOddsMap.set(compoundKey, value);

    if (isUp || isDown) {
      const diff = +(value - (prev ?? 0)).toFixed(2);
      setDelta(diff);

      setFlashClass(isUp ? style["odds-up"] : style["odds-down"]);

      const timeout = setTimeout(() => {
        setFlashClass(null);
        setDelta(null);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [value]);

  const btnClass = [
    style.button,
    isSelected ? style.selected : "",
    flashClass || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={btnClass + " custom-font-1"} onClick={onSelect}>
      <span className={style["key-name"]}>{`(${keyName})`}</span>:{" "}
      {value.toFixed(2)}
      {delta !== null && (
        <span className={delta > 0 ? style.diffUp : style.diffDown}>
          &nbsp;({delta > 0 ? "+" : ""}
          {delta.toFixed(2)})
        </span>
      )}
    </button>
  );
}
