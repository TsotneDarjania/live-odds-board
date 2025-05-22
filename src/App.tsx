import { useRef } from "react";
import { VariableSizeList as List } from "react-window";

import RowRenderer from "./components/rowRenderer/RowRenderer";
import "./App.css";

import { useSelectedOdds } from "./hooks/useSelectedOdds";
import { usePreservedScroll } from "./hooks/usePreservedScroll";
import { useMatches } from "./hooks/useMatches";

const MATCH_COUNT = 10000;

function App() {
  const listRef = useRef<any>(null);
  const sizeMap = useRef<{ [index: number]: number }>({});

  const matches = useMatches(MATCH_COUNT);
  const [selectedOdds, handleSelect] = useSelectedOdds();

  usePreservedScroll(listRef);

  const setSize = (index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      listRef.current?.resetAfterIndex(index);
    }
  };

  const getSize = (index: number) => {
    return sizeMap.current[index] || 120; // fallback default height
  };

  return (
    <div className="app">
      <h1 className="custom-font-1">LIVE ODDS BOARD</h1>
      <List
        className="react-window-list"
        height={window.innerHeight - 120}
        itemCount={matches.length}
        itemSize={getSize}
        width="100%"
        ref={listRef}
        itemData={{
          matches,
          selectedOdds,
          handleSelect,
          setSize,
        }}
      >
        {RowRenderer}
      </List>
    </div>
  );
}

export default App;
