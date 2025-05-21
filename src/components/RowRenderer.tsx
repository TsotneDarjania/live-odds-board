import React from "react";
import MatchRow from "./MatchRow";
import type { Match } from "../types/match";

type Props = {
  index: number;
  style: React.CSSProperties;
  data: {
    matches: Match[];
    selectedOdds: { [key: string]: boolean };
    handleSelect: (id: number, key: keyof Match["odds"]) => void;
  };
};

function RowRenderer({ index, style, data }: Props) {
  const match = data.matches[index];

  return (
    <div style={style} key={match.id}>
      <MatchRow
        match={match}
        onSelect={data.handleSelect}
        selectedOdds={data.selectedOdds}
      />
    </div>
  );
}

export default RowRenderer;
