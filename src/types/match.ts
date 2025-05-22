export type Odds = {
  "1": number;
  X: number;
  "2": number;
};

export type Match = {
  id: number;
  sport: string;
  home: string;
  away: string;
  startTime: string;
  score: string;
  odds: {
    "1": number;
    X: number;
    "2": number;
    "1X": number;
    "12": number;
    X2: number;
    "> 2.5": number;
    "< 2.5": number;
  };
};
