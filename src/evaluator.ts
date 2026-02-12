import type { Card, PlayerHand } from './types';
import { rankValue } from './rankUtils';

function sortByRankDesc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => rankValue(b.rank) - rankValue(a.rank));
}

export function evaluateHand(cards: Card[]): PlayerHand {
  if (cards.length !== 5) {
    throw new Error(`evaluateHand expects 5 cards, got ${cards.length}`);
  }

  return {
    category: 'HighCard',
    chosen5: sortByRankDesc(cards),
  };
}
