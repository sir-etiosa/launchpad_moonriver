/**
 * The Whot deck.
 *
 * Composition follows the Nigerian 54-card pack as documented by Pagat
 * (https://www.pagat.com/com/whot.html): five unequal suits plus five wild "Whot" cards
 * numbered 20. The suits are deliberately ragged — stars only run to 8, crosses and
 * squares skip 4, 6, 8, 9 and 12 — and the total only lands on 54 if that raggedness is
 * respected. A "clean" 5x14 deck would be 75 cards and is a different game.
 */

export const SUITS = ["circle", "triangle", "cross", "square", "star"];

export const SUIT_NUMBERS = {
  circle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  triangle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  cross: [1, 2, 3, 5, 7, 10, 11, 13, 14],
  square: [1, 2, 3, 5, 7, 10, 11, 13, 14],
  star: [1, 2, 3, 4, 5, 7, 8],
};

export const WHOT_NUMBER = 20;
export const WHOT_COUNT = 5;

export const DECK_SIZE = 54;
export const HAND_SIZE = 6;

/** Whot calls a suit by its shape; the Nigerian names are worth keeping around for the UI. */
export const SUIT_LABELS = {
  circle: "Ball",
  triangle: "Angle",
  cross: "Cross",
  square: "Carpet",
  star: "Star",
};

export function buildDeck() {
  const cards = [];

  for (const suit of SUITS) {
    for (const number of SUIT_NUMBERS[suit]) {
      cards.push({ id: `${suit}-${number}`, suit, number });
    }
  }

  for (let i = 1; i <= WHOT_COUNT; i += 1) {
    cards.push({ id: `whot-${i}`, suit: null, number: WHOT_NUMBER });
  }

  return cards;
}

export function isWhot(card) {
  return card.number === WHOT_NUMBER;
}

/**
 * Deterministic shuffle. The game server publishes a commitment to the seed before the
 * deal and reveals it afterwards, so the shuffle has to be reproducible from the seed
 * alone — `Math.random` would make that impossible.
 */
export function mulberry32(seed) {
  let a = seed >>> 0;

  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(cards, seed) {
  const next = mulberry32(seed);
  const out = [...cards];

  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

export function deal(deck, playerCount, handSize = HAND_SIZE) {
  const hands = Array.from({ length: playerCount }, () => []);

  for (let round = 0; round < handSize; round += 1) {
    for (let player = 0; player < playerCount; player += 1) {
      hands[player].push(deck[round * playerCount + player]);
    }
  }

  return {
    hands,
    stock: deck.slice(playerCount * handSize),
  };
}
