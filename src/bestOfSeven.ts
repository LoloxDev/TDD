import type { Card, PlayerHand } from './types';
import { evaluateHand } from './evaluator';
import { compareHands } from './compare';

/** Generate all combinations of k elements from arr */
function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map(combo => [first, ...combo]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

/**
 * Given 7 cards (board + hole), find the best possible 5-card hand.
 * Tries all C(7,5) = 21 combinations.
 */
export function bestHandFromSeven(cards: Card[]): PlayerHand {
  if (cards.length !== 7) {
    throw new Error('bestHandFromSeven expects exactly 7 cards');
  }

  const allCombos = combinations(cards, 5);
  let best = evaluateHand(allCombos[0]);

  for (let i = 1; i < allCombos.length; i++) {
    const current = evaluateHand(allCombos[i]);
    if (compareHands(current, best) > 0) {
      best = current;
    }
  }

  return best;
}
