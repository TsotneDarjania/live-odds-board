import type { Match } from "../types/match";

export function startMockWebSocket(
  getMatches: () => Match[],
  onUpdate: (updatedMatches: Match[]) => void
) {
  setInterval(() => {
    const matches = getMatches();
    if (!matches.length) return;

    const adjust = (val: number): number => {
      const direction = Math.random() < 0.5 ? -1 : 1;
      const step = Math.random() < 0.5 ? 0.2 : 0.4;
      return +(val + direction * step).toFixed(2);
    };

    const updatedMatches = matches.map((match) => {
      // 🚫 Skip 98% of matches for performance
      if (Math.random() > 0.02) return match;

      const [homeGoals, awayGoals] = match.score.split(" - ").map(Number);

      let newHome = homeGoals;
      let newAway = awayGoals;

      const willChangeScore = Math.random() < 0.5;

      if (willChangeScore) {
        if (Math.random() < 0.5) newHome += 1;
        else newAway += 1;
      }

      const newScore = `${newHome} - ${newAway}`;

      const shouldUpdateOdds = willChangeScore;

      const newOdds = shouldUpdateOdds
        ? {
            "1": adjust(match.odds["1"]),
            X: adjust(match.odds["X"]),
            "2": adjust(match.odds["2"]),
            "1X": adjust(match.odds["1X"]),
            "12": adjust(match.odds["12"]),
            X2: adjust(match.odds["X2"]),
            "Over 2.5": adjust(match.odds["Over 2.5"]),
            "Under 2.5": adjust(match.odds["Under 2.5"]),
          }
        : match.odds;

      return {
        ...match,
        score: newScore,
        odds: newOdds,
        updatedAt: Date.now(), // optional for debugging
      };
    });

    onUpdate(updatedMatches);
  }, 1000);
}
