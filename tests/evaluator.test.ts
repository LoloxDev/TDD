import { evaluateHand } from '../src/evaluator';
import { parseCards } from '../src/card';

describe('evaluateHand', () => {
  describe('High card', () => {
    it('should detect high card when no combination', () => {
      const cards = parseCards(['As', 'Kd', '9h', '7c', '2s']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('HighCard');
      expect(result.chosen5).toHaveLength(5);
    });

    it('should order cards by rank descending', () => {
      const cards = parseCards(['2s', '9h', 'Kd', '7c', 'As']);
      const result = evaluateHand(cards);
      expect(result.chosen5.map(c => c.rank)).toEqual(['A', 'K', '9', '7', '2']);
    });
  });

  describe('One pair', () => {
    it('should detect a pair of aces', () => {
      const cards = parseCards(['As', 'Ad', 'Kh', '9c', '2s']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('OnePair');
      expect(result.chosen5).toHaveLength(5);
    });

    it('should put the pair first then kickers descending', () => {
      const cards = parseCards(['As', 'Ad', 'Kh', '9c', '2s']);
      const result = evaluateHand(cards);
      expect(result.chosen5[0].rank).toBe('A');
      expect(result.chosen5[1].rank).toBe('A');
      expect(result.chosen5[2].rank).toBe('K');
    });
  });
});
