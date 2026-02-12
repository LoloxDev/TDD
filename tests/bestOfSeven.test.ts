import { bestHandFromSeven } from '../src/bestOfSeven';
import { parseCards } from '../src/card';

describe('bestHandFromSeven', () => {
  it('finds straight from 7 cards (example D - board plays)', () => {
    const cards = parseCards(['5c', '6d', '7h', '8s', '9d', 'Ac', 'Ad']);
    const result = bestHandFromSeven(cards);
    expect(result.category).toBe('Straight');
    expect(result.chosen5.map(c => c.rank)).toEqual(['9', '8', '7', '6', '5']);
  });

  it('finds flush picking best 5 from 6 suited cards (example C)', () => {
    const cards = parseCards(['Ah', 'Jh', '9h', '4h', '2c', '6h', 'Kd']);
    const result = bestHandFromSeven(cards);
    expect(result.category).toBe('Flush');
    expect(result.chosen5.map(c => c.rank)).toEqual(['A', 'J', '9', '6', '4']);
  });

  it('finds four of a kind with best kicker (example E)', () => {
    const cards = parseCards(['7c', '7d', '7h', '7s', '2d', 'Ac', 'Kc']);
    const result = bestHandFromSeven(cards);
    expect(result.category).toBe('FourOfAKind');
    expect(result.chosen5[4].rank).toBe('A');
  });

  it('prefers full house over flush when both possible', () => {
    const cards = parseCards(['Ah', 'Ad', 'As', 'Kh', 'Kd', '3h', '5h']);
    const result = bestHandFromSeven(cards);
    expect(result.category).toBe('FullHouse');
  });

  it('finds wheel from 7 cards', () => {
    const cards = parseCards(['As', '2d', '3h', '4c', '5s', 'Kd', 'Qc']);
    const result = bestHandFromSeven(cards);
    expect(result.category).toBe('Straight');
    expect(result.chosen5[0].rank).toBe('5');
  });
});
