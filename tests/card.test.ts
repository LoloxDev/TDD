import { parseCard } from '../src/card';
import type { Card } from '../src/types';

describe('parseCard', () => {
  it('parses Ace of spades', () => {
    const result = parseCard('As');
    expect(result).toEqual<Card>({ rank: 'A', suit: 's' });
  });

  it('parses 2 of diamonds', () => {
    const result = parseCard('2d');
    expect(result).toEqual<Card>({ rank: '2', suit: 'd' });
  });

  it('parses 10 of hearts', () => {
    const result = parseCard('Th');
    expect(result).toEqual<Card>({ rank: 'T', suit: 'h' });
  });

  it('parses King of clubs', () => {
    const result = parseCard('Kc');
    expect(result).toEqual<Card>({ rank: 'K', suit: 'c' });
  });
});
