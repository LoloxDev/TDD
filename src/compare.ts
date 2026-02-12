import type { HandCategory, PlayerHand } from './types';
import { rankValue } from './rankUtils';

const CATEGORY_STRENGTH: Record<HandCategory, number> = {
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

function compareChosen5(a: PlayerHand, b: PlayerHand): number {
  for (let i = 0; i < 5; i += 1) {
    const diff = rankValue(a.chosen5[i].rank) - rankValue(b.chosen5[i].rank);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

export function compareHands(a: PlayerHand, b: PlayerHand): number {
  const categoryDiff = CATEGORY_STRENGTH[a.category] - CATEGORY_STRENGTH[b.category];
  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  return compareChosen5(a, b);
}
