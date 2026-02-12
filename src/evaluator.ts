import type { Card, PlayerHand, Rank } from './types';
import { rankValue } from './rankUtils';

function sortByRankDesc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => rankValue(b.rank) - rankValue(a.rank));
}

function emptyRankGroups(): Record<Rank, Card[]> {
  return {
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
    '7': [],
    '8': [],
    '9': [],
    T: [],
    J: [],
    Q: [],
    K: [],
    A: [],
  };
}

function groupByRank(cards: Card[]): Record<Rank, Card[]> {
  const groups = emptyRankGroups();
  for (const card of cards) {
    groups[card.rank].push(card);
  }
  return groups;
}

function ranksWithCount(groups: Record<Rank, Card[]>, target: number): Rank[] {
  return (Object.keys(groups) as Rank[])
    .filter((rank) => groups[rank].length === target)
    .sort((a, b) => rankValue(b) - rankValue(a));
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
  const normalStraight = values.every((value, index) => index === 0 || value === values[index - 1] - 1);
  if (normalStraight) {
    return uniqueRanks.map((rank) => sorted.find((card) => card.rank === rank) as Card);
  }

  const wheel = uniqueRanks.join('') === 'A5432';
  if (wheel) {
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
  const groups = groupByRank(sorted);
  const fourRanks = ranksWithCount(groups, 4);
  const tripRanks = ranksWithCount(groups, 3);
  const pairRanks = ranksWithCount(groups, 2);
  const flush = isFlush(sorted);
  const straight = straightChosen5(sorted);

  if (flush && straight) {
    return {
      category: 'StraightFlush',
      chosen5: straight,
    };
  }

  if (fourRanks.length === 1) {
    const fourRank = fourRanks[0];
    const fourCards = sorted.filter((card) => card.rank === fourRank);
    const kicker = sorted.filter((card) => card.rank !== fourRank);
    return {
      category: 'FourOfAKind',
      chosen5: [...fourCards, ...kicker],
    };
  }

  if (tripRanks.length === 1 && pairRanks.length === 1) {
    const tripCards = sorted.filter((card) => card.rank === tripRanks[0]);
    const pairCards = sorted.filter((card) => card.rank === pairRanks[0]);
    return {
      category: 'FullHouse',
      chosen5: [...tripCards, ...pairCards],
    };
  }

  if (flush) {
    return {
      category: 'Flush',
      chosen5: sorted,
    };
  }

  if (straight) {
    return {
      category: 'Straight',
      chosen5: straight,
    };
  }

  if (tripRanks.length === 1) {
    const tripCards = sorted.filter((card) => card.rank === tripRanks[0]);
    const kickers = sorted.filter((card) => card.rank !== tripRanks[0]);
    return {
      category: 'ThreeOfAKind',
      chosen5: [...tripCards, ...kickers],
    };
  }

  if (pairRanks.length === 2) {
    const highPairCards = sorted.filter((card) => card.rank === pairRanks[0]);
    const lowPairCards = sorted.filter((card) => card.rank === pairRanks[1]);
    const kicker = sorted.filter((card) => card.rank !== pairRanks[0] && card.rank !== pairRanks[1]);
    return {
      category: 'TwoPair',
      chosen5: [...highPairCards, ...lowPairCards, ...kicker],
    };
  }

  if (pairRanks.length === 1) {
    const pairCards = sorted.filter((card) => card.rank === pairRanks[0]);
    const kickers = sorted.filter((card) => card.rank !== pairRanks[0]);
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
