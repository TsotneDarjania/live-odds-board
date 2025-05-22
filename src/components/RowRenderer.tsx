import React, { useEffect, useRef } from "react";
import MatchRow from "./MatchRow";
import type { Match } from "../types/match";

type Props = {
  index: number;
  style: React.CSSProperties;
  data: {
    matches: Match[];
    selectedOdds: { [key: string]: boolean };
    handleSelect: (id: number, key: keyof Match["odds"]) => void;
    setSize: (index: number, size: number) => void;
  };
};

function RowRenderer({ index, style, data }: Props) {
  const match = data.matches[index];
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rowRef.current) return;

    const observer = new ResizeObserver(() => {
      const height = rowRef.current?.getBoundingClientRect().height;
      if (height) data.setSize(index, height);
    });

    observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, [index]);

  if (!match) return null;

  return (
    <div style={style} key={match.id}>
      <div ref={rowRef}>
        <MatchRow
          match={match}
          onSelect={data.handleSelect}
          selectedOdds={data.selectedOdds}
          isOddRow={index % 2 === 1}
        />
      </div>
    </div>
  );
}

export default RowRenderer;
