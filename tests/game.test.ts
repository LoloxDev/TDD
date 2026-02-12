import { parseCards } from '../src/card';
import { evaluateGame } from '../src/game';

describe('evaluateGame', () => {
  it('evaluates a single player game', () => {
    const board = parseCards(['Ah', 'Jh', '9h', '4h', '2c']);
    const holeCardsPerPlayer = [parseCards(['6h', 'Kd'])];

    const result = evaluateGame(board, holeCardsPerPlayer);

    expect(result.winners).toEqual([0]);
    expect(result.hands[0].category).toBe('Flush');
    expect(result.hands[0].chosen5).toEqual(parseCards(['Ah', 'Jh', '9h', '6h', '4h']));
  });

  it('supports ties (split pot) - example D', () => {
    const board = parseCards(['5c', '6d', '7h', '8s', '9d']);
    const holeCardsPerPlayer = [parseCards(['Ac', 'Ad']), parseCards(['Kc', 'Qd'])];

    const result = evaluateGame(board, holeCardsPerPlayer);

    expect(result.winners).toEqual([0, 1]);
    expect(result.hands[0].category).toBe('Straight');
    expect(result.hands[1].category).toBe('Straight');
    expect(result.hands[0].chosen5).toEqual(parseCards(['9d', '8s', '7h', '6d', '5c']));
    expect(result.hands[1].chosen5).toEqual(parseCards(['9d', '8s', '7h', '6d', '5c']));
  });

  it('uses kicker for FourOfAKind - example E', () => {
    const board = parseCards(['7c', '7d', '7h', '7s', '2d']);
    const holeCardsPerPlayer = [parseCards(['Ac', 'Kc']), parseCards(['Qc', 'Jc'])];

    const result = evaluateGame(board, holeCardsPerPlayer);

    expect(result.winners).toEqual([0]);
    expect(result.hands[0].category).toBe('FourOfAKind');
    expect(result.hands[1].category).toBe('FourOfAKind');
    expect(result.hands[0].chosen5).toEqual(parseCards(['7c', '7d', '7h', '7s', 'Ac']));
    expect(result.hands[1].chosen5).toEqual(parseCards(['7c', '7d', '7h', '7s', 'Qc']));
  });
});
