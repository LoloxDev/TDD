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

  const onePair = findOnePair(cards);
  if (onePair) return onePair;

  return { category: 'HighCard', chosen5: sortByRankDesc(cards) };
}
