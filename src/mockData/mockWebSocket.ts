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
      // Only 50% of matches update
      if (Math.random() > 0.05) return match;

      const [homeGoals, awayGoals] = match.score.split(" - ").map(Number);

      let newHome = homeGoals;
      let newAway = awayGoals;

      if (Math.random() < 0.5) newHome += 1;
      else newAway += 1;

      const newScore = `${newHome} - ${newAway}`;

      // ✅ Randomly update a few odds
      const updatedOdds: Match["odds"] = { ...match.odds };
      const oddKeys = Object.keys(updatedOdds) as (keyof Match["odds"])[];

      oddKeys.forEach((key) => {
        if (Math.random() < 0.3) {
          updatedOdds[key] = adjust(updatedOdds[key]);
        }
      });

      return {
        ...match,
        score: newScore,
        odds: updatedOdds,
        updatedAt: Date.now(),
      };
    });

    onUpdate(updatedMatches);
  }, 1000);
}
