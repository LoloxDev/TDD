import type { Card, PlayerHand } from './types';
import { rankValue } from './rankUtils';

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

function findThreeOfAKind(cards: Card[]): PlayerHand | null {
  const groups = groupByRank(cards);
  for (const [, group] of groups) {
    if (group.length === 3) {
      const triplet = group;
      const kickers = sortByRankDesc(cards.filter(c => c.rank !== triplet[0].rank));
      return { category: 'ThreeOfAKind', chosen5: [...triplet, ...kickers.slice(0, 2)] };
    }
  }
  return null;
}

function findTwoPair(cards: Card[]): PlayerHand | null {
  const groups = groupByRank(cards);
  const pairs: Card[][] = [];
  for (const [, group] of groups) {
    if (group.length === 2) {
      pairs.push(group);
    }
  }
  if (pairs.length < 2) return null;
  // sort pairs by rank descending
  pairs.sort((a, b) => rankValue(b[0].rank) - rankValue(a[0].rank));
  const pairCards = [...pairs[0], ...pairs[1]];
  const kicker = sortByRankDesc(cards.filter(c => !pairCards.includes(c)));
  return { category: 'TwoPair', chosen5: [...pairCards, kicker[0]] };
}

function findStraight(cards: Card[]): PlayerHand | null {
  const sorted = sortByRankDesc(cards);
  const values = sorted.map(c => rankValue(c.rank));

  // check if consecutive
  let isStraight = true;
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] - values[i + 1] !== 1) {
      isStraight = false;
      break;
    }
  }

  if (isStraight) {
    return { category: 'Straight', chosen5: sorted };
  }

  return null;
}

function findOnePair(cards: Card[]): PlayerHand | null {
  const groups = groupByRank(cards);
  for (const [, group] of groups) {
    if (group.length === 2) {
      const pair = group;
      const kickers = sortByRankDesc(cards.filter(c => c.rank !== pair[0].rank));
      return { category: 'OnePair', chosen5: [...pair, ...kickers.slice(0, 3)] };
    }
  }
  return null;
}

export function evaluateHand(cards: Card[]): PlayerHand {
  if (cards.length !== 5) {
    throw new Error('evaluateHand expects exactly 5 cards');
  }

  const straight = findStraight(cards);
  if (straight) return straight;

  const three = findThreeOfAKind(cards);
  if (three) return three;

  const twoPair = findTwoPair(cards);
  if (twoPair) return twoPair;

  const onePair = findOnePair(cards);
  if (onePair) return onePair;

  return { category: 'HighCard', chosen5: sortByRankDesc(cards) };
}
