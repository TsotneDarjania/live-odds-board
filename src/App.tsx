import { useEffect, useMemo, useRef, useState } from "react";
import type { Match } from "./types/match";
import { generateMatches } from "./mockData/generateMatches";
import { startMockWebSocket } from "./mockData/mockWebSocket";
import { FixedSizeList as List } from "react-window";

import { useOddsHighlight } from "./hooks/useOddsHighlight";
import { isSameMatch } from "./helper";
import "./App.css";
import RowRenderer from "./components/RowRenderer";

const MATCH_COUNT = 10000;
const ROW_HEIGHT = 60;

function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedOdds, setSelectedOdds] = useState<{ [key: string]: boolean }>(
    {}
  );
  const listRef = useRef<any>(null);
  const matchRef = useRef<Match[]>([]);

  const oddsHighlight = useOddsHighlight(matches);

  useEffect(() => {
    const savedSelections = localStorage.getItem("selectedOdds");
    const savedScroll = localStorage.getItem("scrollOffset");
    const data = generateMatches(MATCH_COUNT);
    setMatches(data);
    matchRef.current = data;

    if (savedSelections) {
      setSelectedOdds(JSON.parse(savedSelections));
    }

    setTimeout(() => {
      if (savedScroll && listRef.current) {
        listRef.current.scrollTo(parseInt(savedScroll));
      }
    }, 100);
  }, []);

  useEffect(() => {
    matchRef.current = matches;
  }, [matches]);

  useEffect(() => {
    startMockWebSocket(
      () => matchRef.current,
      (updatedMatches) => {
        setMatches((prevMatches) =>
          prevMatches.map((match, i) =>
            isSameMatch(match, updatedMatches[i]) ? match : updatedMatches[i]
          )
        );
      }
    );
  }, []);

  useEffect(() => {
    const saveScroll = () => {
      if (listRef.current) {
        localStorage.setItem(
          "scrollOffset",
          listRef.current.state.scrollOffset.toString()
        );
      }
    };
    window.addEventListener("beforeunload", saveScroll);
    return () => window.removeEventListener("beforeunload", saveScroll);
  }, []);

  const handleSelect = (matchId: number, betKey: keyof Match["odds"]) => {
    const key = `${matchId}-${betKey}`;
    setSelectedOdds((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("selectedOdds", JSON.stringify(updated));
      return updated;
    });
  };

  const itemData = useMemo(
    () => ({
      matches,
      selectedOdds,
      handleSelect,
    }),
    [matches, selectedOdds, oddsHighlight]
  );

  return (
    <div className="app">
      <h1>Live Odds Board</h1>
      <List
        className="react-window-list"
        height={window.innerHeight - 60}
        itemCount={matches.length}
        itemSize={ROW_HEIGHT}
        width="100%"
        ref={listRef}
        itemData={itemData}
      >
        {RowRenderer}
      </List>
    </div>
  );
}

export default App;
