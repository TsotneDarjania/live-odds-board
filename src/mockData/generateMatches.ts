import type { Match } from "../types/match";

const sports = ["football", "basketball", "tennis"];
const teams = ["Lions", "Tigers", "Eagles", "Wolves", "Sharks"];

function getRandomTeam() {
  return teams[Math.floor(Math.random() * teams.length)];
}

function getRandomOdd(): number {
  return +(Math.random() * 3 + 1).toFixed(2);
}

export function generateMatches(count: number = 10000): Match[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    sport: sports[id % sports.length],
    home: getRandomTeam(),
    away: getRandomTeam(),
    startTime: new Date(Date.now() + id * 60000).toLocaleTimeString(),
    score: `${Math.floor(Math.random() * 5)} - ${Math.floor(
      Math.random() * 5
    )}`,
    odds: {
      "1": getRandomOdd(),
      X: getRandomOdd(),
      "2": getRandomOdd(),
      "1X": getRandomOdd(),
      "12": getRandomOdd(),
      X2: getRandomOdd(),
      "Over 2.5": getRandomOdd(),
      "Under 2.5": getRandomOdd(),
    },
  }));
}
