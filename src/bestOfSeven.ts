import type { Card, PlayerHand } from './types';
import { evaluateHand } from './evaluator';
import { compareHands } from './compare';

export function bestHandFromSeven(cards: Card[]): PlayerHand {
  if (cards.length !== 7) {
    throw new Error(`bestHandFromSeven expects 7 cards, got ${cards.length}`);
  }

  let best: PlayerHand | null = null;

  for (let i = 0; i < cards.length - 4; i += 1) {
    for (let j = i + 1; j < cards.length - 3; j += 1) {
      for (let k = j + 1; k < cards.length - 2; k += 1) {
        for (let l = k + 1; l < cards.length - 1; l += 1) {
          for (let m = l + 1; m < cards.length; m += 1) {
            const currentCards = [cards[i], cards[j], cards[k], cards[l], cards[m]];
            const currentHand = evaluateHand(currentCards);

            if (!best || compareHands(currentHand, best) > 0) {
              best = currentHand;
            }
          }
        }
      }
    }
  }

  return best as PlayerHand;
}
