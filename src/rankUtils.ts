import type { Rank } from './types';

export const RANK_ORDER: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
};

export function rankValue(r: Rank): number {
  return RANK_ORDER[r];
}

export function compareRanks(a: Rank, b: Rank): number {
  return rankValue(a) - rankValue(b);
}
