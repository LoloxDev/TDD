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

  describe('Two pair', () => {
    it('detects two pair', () => {
      const cards = parseCards(['As', 'Ad', 'Kh', 'Kc', '2s']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('TwoPair');
    });

    it('orders higher pair first, then lower pair, then kicker', () => {
      const cards = parseCards(['As', 'Ad', '5h', '5c', 'Ks']);
      const result = evaluateHand(cards);
      const ranks = result.chosen5.map(c => c.rank);
      expect(ranks[0]).toBe('A');
      expect(ranks[1]).toBe('A');
      expect(ranks[2]).toBe('5');
      expect(ranks[3]).toBe('5');
      expect(ranks[4]).toBe('K');
    });
  });

  describe('Three of a kind', () => {
    it('detects three of a kind', () => {
      const cards = parseCards(['7s', '7d', '7h', 'Kc', '2s']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('ThreeOfAKind');
    });

    it('puts triplet first then kickers descending', () => {
      const cards = parseCards(['7s', '7d', '7h', 'Ac', '2s']);
      const result = evaluateHand(cards);
      const ranks = result.chosen5.map(c => c.rank);
      expect(ranks[0]).toBe('7');
      expect(ranks[1]).toBe('7');
      expect(ranks[2]).toBe('7');
      expect(ranks[3]).toBe('A');
      expect(ranks[4]).toBe('2');
    });
  });

  describe('Straight', () => {
    it('detects a basic straight', () => {
      const cards = parseCards(['5s', '6d', '7h', '8c', '9s']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('Straight');
    });

    it('orders straight from high to low', () => {
      const cards = parseCards(['5s', '6d', '7h', '8c', '9s']);
      const result = evaluateHand(cards);
      expect(result.chosen5.map(c => c.rank)).toEqual(['9', '8', '7', '6', '5']);
    });

    it('detects ace-high straight', () => {
      const cards = parseCards(['Ts', 'Jd', 'Qh', 'Kc', 'As']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('Straight');
      expect(result.chosen5[0].rank).toBe('A');
    });

    it('detects wheel (A-2-3-4-5)', () => {
      const cards = parseCards(['As', '2d', '3h', '4c', '5s']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('Straight');
      expect(result.chosen5[0].rank).toBe('5');
      expect(result.chosen5[4].rank).toBe('A');
    });
  });

  describe('Flush', () => {
    it('detects a flush (5 same suit)', () => {
      const cards = parseCards(['Ah', 'Jh', '9h', '6h', '4h']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('Flush');
    });

    it('orders flush cards descending by rank', () => {
      const cards = parseCards(['4h', 'Ah', '6h', '9h', 'Jh']);
      const result = evaluateHand(cards);
      expect(result.chosen5.map(c => c.rank)).toEqual(['A', 'J', '9', '6', '4']);
    });

    it('does not detect flush with mixed suits', () => {
      const cards = parseCards(['Ah', 'Jh', '9h', '6h', '4s']);
      const result = evaluateHand(cards);
      expect(result.category).not.toBe('Flush');
    });
  });

  describe('Full house', () => {
    it('detects full house (three + pair)', () => {
      const cards = parseCards(['7s', '7d', '7h', 'Kc', 'Ks']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('FullHouse');
    });

    it('orders triplet first, then pair', () => {
      const cards = parseCards(['7s', '7d', '7h', 'Ac', 'As']);
      const result = evaluateHand(cards);
      const ranks = result.chosen5.map(c => c.rank);
      expect(ranks.slice(0, 3)).toEqual(['7', '7', '7']);
      expect(ranks.slice(3)).toEqual(['A', 'A']);
    });
  });

  describe('Four of a kind', () => {
    it('detects four of a kind', () => {
      const cards = parseCards(['7s', '7d', '7h', '7c', 'As']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('FourOfAKind');
    });

    it('puts quad first then kicker', () => {
      const cards = parseCards(['7s', '7d', '7h', '7c', 'As']);
      const result = evaluateHand(cards);
      const ranks = result.chosen5.map(c => c.rank);
      expect(ranks.slice(0, 4)).toEqual(['7', '7', '7', '7']);
      expect(ranks[4]).toBe('A');
    });
  });

  describe('Straight flush', () => {
    it('detects straight flush', () => {
      const cards = parseCards(['5h', '6h', '7h', '8h', '9h']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('StraightFlush');
    });

    it('detects royal flush as straight flush', () => {
      const cards = parseCards(['Ts', 'Js', 'Qs', 'Ks', 'As']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('StraightFlush');
      expect(result.chosen5[0].rank).toBe('A');
    });

    it('detects wheel straight flush', () => {
      const cards = parseCards(['Ad', '2d', '3d', '4d', '5d']);
      const result = evaluateHand(cards);
      expect(result.category).toBe('StraightFlush');
      expect(result.chosen5[0].rank).toBe('5');
    });
  });
});
