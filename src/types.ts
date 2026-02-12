/**
 * Texas Hold'em Poker Hand - Types
 * Notation: rank + suit (e.g. "As" = Ace of spades, "Th" = 10 of hearts)
 */

export type Suit = 's' | 'h' | 'd' | 'c'; // spades, hearts, diamonds, clubs

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type HandCategory =
  | 'StraightFlush'
  | 'FourOfAKind'
  | 'FullHouse'
  | 'Flush'
  | 'Straight'
  | 'ThreeOfAKind'
  | 'TwoPair'
  | 'OnePair'
  | 'HighCard';

export interface PlayerHand {
  category: HandCategory;
  chosen5: Card[];
}

export interface GameResult {
  winners: number[];
  hands: PlayerHand[];
}
