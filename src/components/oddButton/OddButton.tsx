import { useEffect, useRef, useState } from "react";
import style from "./style.module.css";

type Props = {
  matchId: number;
  keyName: string;
  value: number;
  isSelected: boolean;
  onSelect?: () => void;
};

export default function MatchOddButton({
  keyName,
  value,
  isSelected,
  onSelect,
}: Props) {
  const [flashClass, setFlashClass] = useState<string | null>(null);
  const [delta, setDelta] = useState<number | null>(null);
  const prevValueRef = useRef<number | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const prev = prevValueRef.current;
    const isUp = prev !== null && value > prev;
    const isDown = prev !== null && value < prev;

    if (hasMountedRef.current && (isUp || isDown)) {
      const diff = +(value - prev!).toFixed(2);
      setDelta(diff);
      setFlashClass(isUp ? style["odds-up"] : style["odds-down"]);

      const timeout = setTimeout(() => {
        setFlashClass(null);
        setDelta(null);
      }, 1000);

      return () => clearTimeout(timeout);
    }

    prevValueRef.current = value;
    hasMountedRef.current = true;
  }, [value]);

  return (
    <button
      className={`${style.button} ${
        isSelected ? style.selected : ""
      } custom-font-1`}
      onClick={onSelect}
    >
      <div className={`${style.inner} ${flashClass ?? ""}`}>
        <span className={style["key-name"]}>{`(${keyName})`}</span>:{" "}
        {value.toFixed(2)}
        {delta !== null && (
          <span className={delta > 0 ? style.diffUp : style.diffDown}>
            &nbsp;({delta > 0 ? "+" : ""}
            {delta.toFixed(2)})
          </span>
        )}
      </div>
    </button>
  );
}
