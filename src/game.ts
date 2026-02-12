import type { Card, GameResult, PlayerHand } from './types';
import { bestHandFromSeven } from './bestOfSeven';
import { compareHands } from './compare';

export function evaluateGame(board: Card[], holeCardsPerPlayer: Card[][]): GameResult {
  if (board.length !== 5) {
    throw new Error(`evaluateGame expects a 5-card board, got ${board.length}`);
  }

  const hands: PlayerHand[] = holeCardsPerPlayer.map((holeCards) => {
    if (holeCards.length !== 2) {
      throw new Error(`each player must have 2 hole cards, got ${holeCards.length}`);
    }

    return bestHandFromSeven([...board, ...holeCards]);
  });

  if (hands.length === 0) {
    return { winners: [], hands: [] };
  }

  let winners = [0];
  let bestHand = hands[0];

  for (let i = 1; i < hands.length; i += 1) {
    const cmp = compareHands(hands[i], bestHand);
    if (cmp > 0) {
      winners = [i];
      bestHand = hands[i];
    } else if (cmp === 0) {
      winners.push(i);
    }
  }

  return { winners, hands };
}
