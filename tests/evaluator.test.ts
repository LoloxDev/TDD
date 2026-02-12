import { parseCards } from '../src/card';
import { evaluateHand } from '../src/evaluator';

describe('evaluateHand', () => {
  it('detects HighCard and sorts chosen5 by rank desc', () => {
    const cards = parseCards(['2d', 'Ks', '8c', 'Ah', '4h']);

    const result = evaluateHand(cards);

    expect(result.category).toBe('HighCard');
    expect(result.chosen5).toEqual(parseCards(['Ah', 'Ks', '8c', '4h', '2d']));
  });

  it('detects OnePair and keeps pair first', () => {
    const cards = parseCards(['Ah', 'Ad', '9c', '4h', '2d']);

    const result = evaluateHand(cards);

    expect(result.category).toBe('OnePair');
    expect(result.chosen5).toEqual(parseCards(['Ah', 'Ad', '9c', '4h', '2d']));
  });

  it('detects TwoPair and orders high pair then low pair then kicker', () => {
    const cards = parseCards(['Ah', 'Ad', 'Kc', 'Kd', '2d']);

    const result = evaluateHand(cards);

    expect(result.category).toBe('TwoPair');
    expect(result.chosen5).toEqual(parseCards(['Ah', 'Ad', 'Kc', 'Kd', '2d']));
  });

  it('detects ThreeOfAKind and keeps kickers in descending order', () => {
    const cards = parseCards(['Qh', 'Qd', 'Qs', '2d', '9c']);

    const result = evaluateHand(cards);

    expect(result.category).toBe('ThreeOfAKind');
    expect(result.chosen5).toEqual(parseCards(['Qh', 'Qd', 'Qs', '9c', '2d']));
  });

  it('detects Straight with high card first in chosen5', () => {
    const cards = parseCards(['6h', '5d', '9c', '8s', '7h']);

    const result = evaluateHand(cards);

    expect(result.category).toBe('Straight');
    expect(result.chosen5).toEqual(parseCards(['9c', '8s', '7h', '6h', '5d']));
  });

  it('detects wheel Straight (A-2-3-4-5)', () => {
    const cards = parseCards(['Ah', '2d', '3c', '4s', '5h']);

    const result = evaluateHand(cards);

    expect(result.category).toBe('Straight');
    expect(result.chosen5).toEqual(parseCards(['5h', '4s', '3c', '2d', 'Ah']));
  });

  it('detects Flush when all cards have same suit', () => {
    const cards = parseCards(['Ah', 'Jh', '9h', '4h', '2h']);

    const result = evaluateHand(cards);

    expect(result.category).toBe('Flush');
    expect(result.chosen5).toHaveLength(5);
  });
});
