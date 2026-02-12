import { compareHands } from '../src/compare';
import { evaluateHand } from '../src/evaluator';
import { parseCards } from '../src/card';

describe('compareHands', () => {
  it('straight flush beats four of a kind', () => {
    const sf = evaluateHand(parseCards(['5h', '6h', '7h', '8h', '9h']));
    const four = evaluateHand(parseCards(['As', 'Ad', 'Ah', 'Ac', 'Ks']));
    expect(compareHands(sf, four)).toBeGreaterThan(0);
  });

  it('four of a kind beats full house', () => {
    const four = evaluateHand(parseCards(['7s', '7d', '7h', '7c', 'As']));
    const fh = evaluateHand(parseCards(['As', 'Ad', 'Ah', 'Kc', 'Ks']));
    expect(compareHands(four, fh)).toBeGreaterThan(0);
  });

  it('flush beats straight', () => {
    const flush = evaluateHand(parseCards(['Ah', 'Jh', '9h', '6h', '4h']));
    const straight = evaluateHand(parseCards(['5s', '6d', '7h', '8c', '9s']));
    expect(compareHands(flush, straight)).toBeGreaterThan(0);
  });

  it('higher straight wins', () => {
    const high = evaluateHand(parseCards(['Ts', 'Jd', 'Qh', 'Kc', 'As']));
    const low = evaluateHand(parseCards(['5s', '6d', '7h', '8c', '9s']));
    expect(compareHands(high, low)).toBeGreaterThan(0);
  });

  it('wheel loses to 6-high straight', () => {
    const wheel = evaluateHand(parseCards(['As', '2d', '3h', '4c', '5s']));
    const six = evaluateHand(parseCards(['2s', '3d', '4h', '5c', '6s']));
    expect(compareHands(six, wheel)).toBeGreaterThan(0);
  });

  it('same straights are a tie', () => {
    const a = evaluateHand(parseCards(['5s', '6d', '7h', '8c', '9s']));
    const b = evaluateHand(parseCards(['5d', '6h', '7c', '8s', '9d']));
    expect(compareHands(a, b)).toBe(0);
  });

  it('flush: higher top card wins', () => {
    const a = evaluateHand(parseCards(['Ah', 'Jh', '9h', '6h', '4h']));
    const b = evaluateHand(parseCards(['Kh', 'Jh', '9h', '6h', '4h']));
    expect(compareHands(a, b)).toBeGreaterThan(0);
  });

  it('one pair: higher pair wins', () => {
    const aces = evaluateHand(parseCards(['As', 'Ad', 'Kh', '9c', '2s']));
    const kings = evaluateHand(parseCards(['Ks', 'Kd', 'Qh', '9c', '2s']));
    expect(compareHands(aces, kings)).toBeGreaterThan(0);
  });

  it('one pair: same pair, higher kicker wins', () => {
    const a = evaluateHand(parseCards(['As', 'Ad', 'Kh', '9c', '2s']));
    const b = evaluateHand(parseCards(['As', 'Ad', 'Qh', '9c', '2s']));
    expect(compareHands(a, b)).toBeGreaterThan(0);
  });

  it('two pair: compare high pair, then low pair, then kicker', () => {
    const aaKk = evaluateHand(parseCards(['As', 'Ad', 'Kh', 'Kc', '2s']));
    const aaQq = evaluateHand(parseCards(['As', 'Ad', 'Qh', 'Qc', '2s']));
    expect(compareHands(aaKk, aaQq)).toBeGreaterThan(0);
  });

  it('full house: higher triplet wins', () => {
    const a = evaluateHand(parseCards(['As', 'Ad', 'Ah', 'Kc', 'Ks']));
    const b = evaluateHand(parseCards(['Ks', 'Kd', 'Kh', 'Ac', 'As']));
    expect(compareHands(a, b)).toBeGreaterThan(0);
  });
});
