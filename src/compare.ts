import type { PlayerHand } from './types';
import { rankValue } from './rankUtils';

const CATEGORY_RANK: Record<string, number> = {
  StraightFlush: 9,
  FourOfAKind: 8,
  FullHouse: 7,
  Flush: 6,
  Straight: 5,
  ThreeOfAKind: 4,
  TwoPair: 3,
  OnePair: 2,
  HighCard: 1,
};

/**
 * Compare two PlayerHands.
 * Returns > 0 if a wins, < 0 if b wins, 0 if tie.
 */
export function compareHands(a: PlayerHand, b: PlayerHand): number {
  const catA = CATEGORY_RANK[a.category];
  const catB = CATEGORY_RANK[b.category];

  if (catA !== catB) return catA - catB;

  // same category => compare chosen5 card by card
  for (let i = 0; i < 5; i++) {
    const diff = rankValue(a.chosen5[i].rank) - rankValue(b.chosen5[i].rank);
    if (diff !== 0) return diff;
  }

  return 0;
}
