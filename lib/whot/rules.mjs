import { isWhot, SUITS, WHOT_NUMBER } from "./deck.mjs";

/**
 * Nigerian Whot special cards. Values are the card numbers that carry an effect; the
 * effect fires when the card is played.
 *
 *  1  HOLD ON         the player who played it goes again
 *  2  PICK TWO        next player plays a 2 or draws 2; consecutive 2s accumulate
 *  5  PICK THREE      next player plays a 5 or draws 3; consecutive 5s accumulate
 *  8  SUSPENSION      next player misses a turn; the STAR 8 makes the next two miss
 * 14  GENERAL MARKET  every other player draws one
 * 20  WHOT            wild; the player names the suit that must be played next
 */
export const EFFECTS = {
  1: "holdOn",
  2: "pickTwo",
  5: "pickThree",
  8: "suspension",
  14: "generalMarket",
  [WHOT_NUMBER]: "whot",
};

export function effectOf(card) {
  return EFFECTS[card.number] ?? null;
}

/** A star 8 suspends two players rather than one. */
export function suspensionCount(card) {
  return card.suit === "star" ? 2 : 1;
}

/**
 * Can `card` be played on the current pile?
 *
 * Three ways to be legal: match the suit, match the number, or play a Whot. When a Whot
 * is on top, the called suit replaces the suit match.
 *
 * The exception is a pending pick. After a 2, any 2 is legal regardless of suit (that is
 * what makes chains work), and likewise any 5 after a 5.
 */
export function isPlayable(card, { topCard, calledSuit, pendingPick }) {
  if (isWhot(card)) return true;

  if (pendingPick) {
    const wanted = pendingPick.kind === "two" ? 2 : 5;
    return card.number === wanted;
  }

  if (!topCard) return true;

  if (topCard.number === WHOT_NUMBER) {
    return calledSuit !== null && card.suit === calledSuit;
  }

  if (card.suit === topCard.suit) return true;
  if (card.number === topCard.number) return true;

  return false;
}

export function legalCards(hand, context) {
  return hand.filter((card) => isPlayable(card, context));
}

export function isValidSuit(suit) {
  return SUITS.includes(suit);
}

/**
 * How many players miss their turn after `card` is played. Suspension stacks with the
 * pending pick chain only in that both are resolved in order.
 */
export function turnSkipsFor(card) {
  if (card.number === 8) return suspensionCount(card);
  return 0;
}

/**
 * Whot scoring: a numbered card is worth its face value, a star is worth double (which
 * is why star cards carry a second, smaller number), and a Whot is always 20.
 *
 * So a hand of carpet 14, carpet 4, carpet 2 and circle 2 comes to 22.
 */
export function cardValue(card) {
  if (card.number === WHOT_NUMBER) return 20;
  return card.suit === "star" ? card.number * 2 : card.number;
}

export function scoreHand(hand) {
  return hand.reduce((total, card) => total + cardValue(card), 0);
}
