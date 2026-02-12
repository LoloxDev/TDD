import type { Card, PlayerHand } from './types';
import { rankValue } from './rankUtils';

// ===== Utility helpers =====

function sortByRankDesc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => rankValue(b.rank) - rankValue(a.rank));
}

function groupByRank(cards: Card[]): Map<string, Card[]> {
  const groups = new Map<string, Card[]>();
  for (const card of cards) {
    const existing = groups.get(card.rank) || [];
    existing.push(card);
    groups.set(card.rank, existing);
  }
  return groups;
}

/** Get groups sorted by group size desc, then rank desc */
function getGroupsSorted(cards: Card[]): Card[][] {
  const groups = [...groupByRank(cards).values()];
  return groups.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length;
    return rankValue(b[0].rank) - rankValue(a[0].rank);
  });
}

function isFlush(cards: Card[]): boolean {
  return new Set(cards.map(c => c.suit)).size === 1;
}

function getStraightOrder(cards: Card[]): Card[] | null {
  const sorted = sortByRankDesc(cards);
  const values = sorted.map(c => rankValue(c.rank));

  // normal straight check
  let consecutive = true;
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] - values[i + 1] !== 1) {
      consecutive = false;
      break;
    }
  }
  if (consecutive) return sorted;

  // wheel: A-2-3-4-5
  if (values.includes(14) && values.includes(5) && values.includes(4) && values.includes(3) && values.includes(2)) {
    return ['5', '4', '3', '2', 'A'].map(r => cards.find(c => c.rank === r)!);
  }

  return null;
}

// ===== Hand finders =====

function findStraightFlush(cards: Card[]): PlayerHand | null {
  if (!isFlush(cards)) return null;
  const straightOrder = getStraightOrder(cards);
  if (!straightOrder) return null;
  return { category: 'StraightFlush', chosen5: straightOrder };
}

function findFourOfAKind(cards: Card[]): PlayerHand | null {
  const groups = getGroupsSorted(cards);
  if (groups[0].length !== 4) return null;
  const quad = groups[0];
  const kicker = sortByRankDesc(cards.filter(c => c.rank !== quad[0].rank));
  return { category: 'FourOfAKind', chosen5: [...quad, kicker[0]] };
}

function findFullHouse(cards: Card[]): PlayerHand | null {
  const groups = getGroupsSorted(cards);
  if (groups.length < 2 || groups[0].length !== 3 || groups[1].length !== 2) return null;
  return { category: 'FullHouse', chosen5: [...groups[0], ...groups[1]] };
}

function findFlush(cards: Card[]): PlayerHand | null {
  if (!isFlush(cards)) return null;
  return { category: 'Flush', chosen5: sortByRankDesc(cards) };
}

function findStraight(cards: Card[]): PlayerHand | null {
  const order = getStraightOrder(cards);
  if (!order) return null;
  return { category: 'Straight', chosen5: order };
}

function findThreeOfAKind(cards: Card[]): PlayerHand | null {
  const groups = getGroupsSorted(cards);
  if (groups[0].length !== 3) return null;
  const triplet = groups[0];
  const kickers = sortByRankDesc(cards.filter(c => c.rank !== triplet[0].rank));
  return { category: 'ThreeOfAKind', chosen5: [...triplet, ...kickers.slice(0, 2)] };
}

function findTwoPair(cards: Card[]): PlayerHand | null {
  const groups = getGroupsSorted(cards);
  const pairs = groups.filter(g => g.length === 2);
  if (pairs.length < 2) return null;
  const pairCards = [...pairs[0], ...pairs[1]];
  const kicker = sortByRankDesc(cards.filter(c => !pairCards.includes(c)));
  return { category: 'TwoPair', chosen5: [...pairCards, kicker[0]] };
}

function findOnePair(cards: Card[]): PlayerHand | null {
  const groups = getGroupsSorted(cards);
  if (groups[0].length !== 2) return null;
  const pair = groups[0];
  const kickers = sortByRankDesc(cards.filter(c => c.rank !== pair[0].rank));
  return { category: 'OnePair', chosen5: [...pair, ...kickers.slice(0, 3)] };
}

// ===== Main evaluator =====

export function evaluateHand(cards: Card[]): PlayerHand {
  if (cards.length !== 5) {
    throw new Error('evaluateHand expects exactly 5 cards');
  }

  // Check in order of hand strength (highest first)
  return (
    findStraightFlush(cards) ??
    findFourOfAKind(cards) ??
    findFullHouse(cards) ??
    findFlush(cards) ??
    findStraight(cards) ??
    findThreeOfAKind(cards) ??
    findTwoPair(cards) ??
    findOnePair(cards) ??
    { category: 'HighCard', chosen5: sortByRankDesc(cards) }
  );
}
