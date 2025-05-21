import type { Match } from "./types/match";

export function isSameMatch(a: Match, b: Match): boolean {
  if (a.score !== b.score) return false;
  for (const key of Object.keys(a.odds) as (keyof Match["odds"])[]) {
    if (a.odds[key] !== b.odds[key]) return false;
  }
  return true;
}
