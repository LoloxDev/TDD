import { parseCards } from '../src/card';
import { bestHandFromSeven } from '../src/bestOfSeven';

describe('bestHandFromSeven', () => {
  it('picks best Flush from 6 suited cards and keeps top 5', () => {
    const cards = parseCards(['Ah', 'Jh', '9h', '4h', '2c', '6h', 'Kh']);

    const result = bestHandFromSeven(cards);

    expect(result.category).toBe('Flush');
    expect(result.chosen5).toEqual(parseCards(['Ah', 'Kh', 'Jh', '9h', '6h']));
  });

  it('picks FullHouse over lower categories', () => {
    const cards = parseCards(['Ah', 'Ad', 'Ac', 'Kh', 'Kd', '2h', '3c']);

    const result = bestHandFromSeven(cards);

    expect(result.category).toBe('FullHouse');
    expect(result.chosen5).toEqual(parseCards(['Ah', 'Ad', 'Ac', 'Kh', 'Kd']));
  });

  it('supports wheel StraightFlush as best hand', () => {
    const cards = parseCards(['Ah', '2h', '3h', '4h', '5h', 'Kd', 'Qc']);

    const result = bestHandFromSeven(cards);

    expect(result.category).toBe('StraightFlush');
    expect(result.chosen5).toEqual(parseCards(['5h', '4h', '3h', '2h', 'Ah']));
  });

  it('throws when card count is not 7', () => {
    const cards = parseCards(['Ah', 'Kh', 'Qh', 'Jh', 'Th', '2d']);

    expect(() => bestHandFromSeven(cards)).toThrow('bestHandFromSeven expects 7 cards');
  });
});
