import type { Card, PlayerHand, Rank } from './types';
import { rankValue } from './rankUtils';

function sortByRankDesc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => rankValue(b.rank) - rankValue(a.rank));
}

function sortByRankAsc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => rankValue(a.rank) - rankValue(b.rank));
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

function ranksWithCount(counts: Record<Rank, number>, target: number): Rank[] {
  const ranks = (Object.keys(counts) as Rank[]).filter((rank) => counts[rank] === target);
  return ranks.sort((a, b) => rankValue(b) - rankValue(a));
}

function isFlush(cards: Card[]): boolean {
  return cards.every((card) => card.suit === cards[0].suit);
}

function straightChosen5(sorted: Card[]): Card[] | null {
  const uniqueRanks = [...new Set(sorted.map((card) => card.rank))] as Rank[];

  if (uniqueRanks.length !== 5) {
    return null;
  }

  const values = uniqueRanks.map(rankValue);
  const isNormalStraight = values.every((value, index) => index === 0 || value === values[index - 1] - 1);

  if (isNormalStraight) {
    return uniqueRanks.map((rank) => sorted.find((card) => card.rank === rank) as Card);
  }

  const isWheel = uniqueRanks.join('') === 'A5432';

  if (isWheel) {
    const wheelOrder: Rank[] = ['5', '4', '3', '2', 'A'];
    return wheelOrder.map((rank) => sorted.find((card) => card.rank === rank) as Card);
  }

  return null;
}

export function evaluateHand(cards: Card[]): PlayerHand {
  if (cards.length !== 5) {
    throw new Error(`evaluateHand expects 5 cards, got ${cards.length}`);
  }

  const sorted = sortByRankDesc(cards);
  const counts = countByRank(sorted);

  if (isFlush(sorted)) {
    return {
      category: 'Flush',
      chosen5: sortByRankAsc(sorted),
    };
  }

  const straightCards = straightChosen5(sorted);
  if (straightCards) {
    return {
      category: 'Straight',
      chosen5: straightCards,
    };
  }

  const tripRank = highestRankWithCount(counts, 3);
  if (tripRank) {
    const tripCards = sorted.filter((card) => card.rank === tripRank);
    const kickers = sorted.filter((card) => card.rank !== tripRank);

    return {
      category: 'ThreeOfAKind',
      chosen5: [...tripCards, ...kickers],
    };
  }

  const pairRanks = ranksWithCount(counts, 2);
  if (pairRanks.length === 2) {
    const highPair = sorted.filter((card) => card.rank === pairRanks[0]);
    const lowPair = sorted.filter((card) => card.rank === pairRanks[1]);
    const kicker = sorted.filter((card) => card.rank !== pairRanks[0] && card.rank !== pairRanks[1]);

    return {
      category: 'TwoPair',
      chosen5: [...highPair, ...lowPair, ...kicker],
    };
  }

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
