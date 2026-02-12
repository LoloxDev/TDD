import { parseCards } from '../src/card';
import { evaluateHand } from '../src/evaluator';

describe('evaluateHand', () => {
  it('detects HighCard and sorts chosen5 by rank desc', () => {
    const cards = parseCards(['2d', 'Ks', '8c', 'Ah', '4h']);

    const result = evaluateHand(cards);

    expect(result.category).toBe('HighCard');
    expect(result.chosen5).toEqual(parseCards(['Ah', 'Ks', '8c', '4h', '2d']));
  });
});
