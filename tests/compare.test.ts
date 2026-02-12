import { parseCards } from '../src/card';
import { compareHands } from '../src/compare';
import { evaluateHand } from '../src/evaluator';

function hand(cards: string[]) {
  return evaluateHand(parseCards(cards));
}

describe('compareHands', () => {
  it('compares different categories first', () => {
    const flush = hand(['Ah', 'Jh', '9h', '4h', '2h']);
    const straight = hand(['9c', '8d', '7h', '6s', '5c']);

    expect(compareHands(flush, straight)).toBeGreaterThan(0);
    expect(compareHands(straight, flush)).toBeLessThan(0);
  });

  it('breaks tie for StraightFlush by highest card', () => {
    const royal = hand(['Ah', 'Kh', 'Qh', 'Jh', 'Th']);
    const nineHigh = hand(['9s', '8s', '7s', '6s', '5s']);

    expect(compareHands(royal, nineHigh)).toBeGreaterThan(0);
  });

  it('breaks tie for FourOfAKind by quad rank then kicker', () => {
    const sevensWithAce = hand(['7c', '7d', '7h', '7s', 'Ac']);
    const sevensWithQueen = hand(['7c', '7d', '7h', '7s', 'Qc']);

    expect(compareHands(sevensWithAce, sevensWithQueen)).toBeGreaterThan(0);
  });

  it('breaks tie for FullHouse by trips rank then pair rank', () => {
    const acesOverTwos = hand(['Ah', 'Ad', 'Ac', '2d', '2c']);
    const kingsOverAces = hand(['Kh', 'Kd', 'Kc', 'Ad', 'Ac']);
    const queensOverNines = hand(['Qh', 'Qd', 'Qc', '9s', '9d']);
    const queensOverEights = hand(['Qs', 'Qh', 'Qd', '8c', '8d']);

    expect(compareHands(acesOverTwos, kingsOverAces)).toBeGreaterThan(0);
    expect(compareHands(queensOverNines, queensOverEights)).toBeGreaterThan(0);
  });

  it('breaks tie for Flush by ordered kickers', () => {
    const jackHighSecond = hand(['Ah', 'Jh', '9h', '4h', '2h']);
    const tenHighSecond = hand(['Ah', 'Th', '9h', '4h', '2h']);

    expect(compareHands(jackHighSecond, tenHighSecond)).toBeGreaterThan(0);
  });

  it('breaks tie for Straight including wheel low straight', () => {
    const nineHigh = hand(['9h', '8d', '7c', '6s', '5h']);
    const eightHigh = hand(['8h', '7d', '6c', '5s', '4h']);
    const wheel = hand(['Ah', '2d', '3c', '4s', '5h']);

    expect(compareHands(nineHigh, eightHigh)).toBeGreaterThan(0);
    expect(compareHands(eightHigh, wheel)).toBeGreaterThan(0);
  });

  it('breaks tie for ThreeOfAKind by trips then kickers', () => {
    const tripsQWithA9 = hand(['Qh', 'Qd', 'Qc', 'Ah', '9d']);
    const tripsQWithKJ = hand(['Qs', 'Qh', 'Qd', 'Kh', 'Jd']);

    expect(compareHands(tripsQWithA9, tripsQWithKJ)).toBeGreaterThan(0);
  });

  it('breaks tie for TwoPair by high pair, low pair, then kicker', () => {
    const akWith2 = hand(['Ah', 'Ad', 'Kc', 'Kd', '2d']);
    const aqWithK = hand(['Ah', 'Ad', 'Qc', 'Qd', 'Kd']);
    const akWith3 = hand(['As', 'Ac', 'Kh', 'Kc', '3d']);

    expect(compareHands(akWith2, aqWithK)).toBeGreaterThan(0);
    expect(compareHands(akWith3, akWith2)).toBeGreaterThan(0);
  });

  it('breaks tie for OnePair by pair rank then kickers', () => {
    const pairAWithKQJ = hand(['Ah', 'Ad', 'Kc', 'Qd', 'Jd']);
    const pairAWithKQT = hand(['As', 'Ac', 'Kh', 'Qs', 'Td']);

    expect(compareHands(pairAWithKQJ, pairAWithKQT)).toBeGreaterThan(0);
  });

  it('breaks tie for HighCard by descending ranks', () => {
    const aK9 = hand(['Ah', 'Kd', '9c', '4s', '2h']);
    const aK8 = hand(['As', 'Kc', '8d', '4h', '2c']);

    expect(compareHands(aK9, aK8)).toBeGreaterThan(0);
  });
});
