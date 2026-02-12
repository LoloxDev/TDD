import type { Card, Rank, Suit } from './types';

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS: Suit[] = ['s', 'h', 'd', 'c'];

export function parseCard(str: string): Card {
  if (str.length < 2) {
    throw new Error(`Invalid card: ${str}`);
  }
  const rank = str[0] as Rank;
  const suit = str[1] as Suit;
  if (!RANKS.includes(rank) || !SUITS.includes(suit)) {
    throw new Error(`Invalid card: ${str}`);
  }
  return { rank, suit };
}

export function parseCards(strs: string[]): Card[] {
  return strs.map(parseCard);
}
