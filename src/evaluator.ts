import type { Card, PlayerHand, Rank } from './types';
import { rankValue } from './rankUtils';

function sortByRankDesc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => rankValue(b.rank) - rankValue(a.rank));
}

function countByRank(cards: Card[]): Record<Rank, number> {
  const counts = {
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    T: 0,
    J: 0,
    Q: 0,
    K: 0,
    A: 0,
  } as Record<Rank, number>;

  for (const card of cards) {
    counts[card.rank] += 1;
  }

  return counts;
}

function highestRankWithCount(counts: Record<Rank, number>, target: number): Rank | null {
  const ranks = Object.keys(counts) as Rank[];
  const matching = ranks.filter((rank) => counts[rank] === target);

  if (matching.length === 0) {
    return null;
  }

  matching.sort((a, b) => rankValue(b) - rankValue(a));
  return matching[0];
}

export function evaluateHand(cards: Card[]): PlayerHand {
  if (cards.length !== 5) {
    throw new Error(`evaluateHand expects 5 cards, got ${cards.length}`);
  }

  const sorted = sortByRankDesc(cards);
  const counts = countByRank(sorted);
  const pairRank = highestRankWithCount(counts, 2);

  if (pairRank) {
    const pairCards = sorted.filter((card) => card.rank === pairRank);
    const kickers = sorted.filter((card) => card.rank !== pairRank);
    return {
      category: 'OnePair',
      chosen5: [...pairCards, ...kickers],
    };
  }

  return {
    category: 'HighCard',
    chosen5: sorted,
  };
}
