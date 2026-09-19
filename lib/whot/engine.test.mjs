import assert from "node:assert/strict";
import test from "node:test";

import { buildDeck, deal, isWhot, shuffle } from "./deck.mjs";
import { applyMove, abandonGame, createGame, legalCardsFor, standings } from "./engine.mjs";
import { isPlayable, cardValue, scoreHand } from "./rules.mjs";

const card = (suit, number) => ({ id: `${suit}-${number}`, suit, number });
const WHOT = { id: "whot-1", suit: null, number: 20 };

/**
 * Defaults to a non-empty stock: an empty one is now the end-of-hand clock, so tests
 * that are not about exhaustion would otherwise settle on their very first move.
 */
const DEFAULT_STOCK = [card("circle", 3), card("circle", 4), card("circle", 5)];

function stateWith({ hands, pile = [], stock = DEFAULT_STOCK, turn = 0 }) {
  return {
    seed: 1,
    players: hands.map((hand, index) => ({ id: `p${index}`, hand })),
    stock,
    pile,
    turn,
    calledSuit: null,
    pendingPick: null,
    winner: null,
    finished: false,
    log: [],
  };
}

test("deck is the 54-card Nigerian pack", () => {
  const deck = buildDeck();

  assert.equal(deck.length, 54);
  assert.equal(deck.filter(isWhot).length, 5);

  const bySuit = {};
  for (const c of deck) {
    if (c.suit) bySuit[c.suit] = (bySuit[c.suit] ?? 0) + 1;
  }

  // The suits are ragged on purpose. A tidy 5x14 deck would be a different game.
  assert.deepEqual(bySuit, {
    circle: 12,
    triangle: 12,
    cross: 9,
    square: 9,
    star: 7,
  });
});

test("shuffle is reproducible from its seed", () => {
  const a = shuffle(buildDeck(), 42).map((c) => c.id);
  const b = shuffle(buildDeck(), 42).map((c) => c.id);
  const c = shuffle(buildDeck(), 43).map((c) => c.id);

  assert.deepEqual(a, b, "same seed must produce the same order");
  assert.notDeepEqual(a, c, "different seeds must diverge");
  assert.equal(new Set(a).size, 54, "shuffle must not drop or duplicate cards");
});

test("deal gives everyone six cards and leaves the rest in the stock", () => {
  const { hands, stock } = deal(shuffle(buildDeck(), 7), 5);

  assert.equal(hands.length, 5);
  for (const hand of hands) assert.equal(hand.length, 6);
  assert.equal(stock.length, 54 - 30);
});

test("legality follows suit, number, and the whot call", () => {
  const circle5 = card("circle", 5);
  const triangle5 = card("triangle", 5);
  const star7 = card("star", 7);
  const circle7 = card("circle", 7);

  const on = (topCard, calledSuit = null, pendingPick = null) => ({
    topCard,
    calledSuit,
    pendingPick,
  });

  assert.ok(isPlayable(circle5, on(circle7)), "same suit");
  assert.ok(isPlayable(triangle5, on(circle5)), "same number, any suit");
  assert.ok(!isPlayable(star7, on(circle5)), "neither suit nor number");
  assert.ok(isPlayable(WHOT, on(star7)), "whot is always legal");
  assert.ok(isPlayable(star7, on(WHOT, "star")), "matches the called suit");
  assert.ok(!isPlayable(circle5, on(WHOT, "star")), "does not match the called suit");
});

test("an empty pile accepts any opening card", () => {
  assert.ok(
    isPlayable(card("star", 4), { topCard: null, calledSuit: null, pendingPick: null }),
  );
});

test("hold on returns the turn to the same player", () => {
  const state = stateWith({
    hands: [[card("circle", 1), card("circle", 7)], [card("triangle", 3)]],
    pile: [card("circle", 9)],
  });

  const next = applyMove(state, { type: "play", playerIndex: 0, cardId: "circle-1" });

  assert.equal(next.turn, 0);
  assert.equal(next.players[0].hand.length, 1);
});

test("pick two passes the obligation on and chains", () => {
  const state = stateWith({
    hands: [
      [card("circle", 2), card("circle", 7)],
      [card("triangle", 2), card("triangle", 3)],
      [card("star", 7)],
    ],
    pile: [card("circle", 9)],
  });

  const afterFirst = applyMove(state, { type: "play", playerIndex: 0, cardId: "circle-2" });
  assert.deepEqual(afterFirst.pendingPick, { kind: "two", count: 2 });
  assert.equal(afterFirst.turn, 1);

  // Any two is legal while a two is pending, regardless of suit.
  const afterSecond = applyMove(afterFirst, {
    type: "play",
    playerIndex: 1,
    cardId: "triangle-2",
  });
  assert.deepEqual(afterSecond.pendingPick, { kind: "two", count: 4 });
  assert.equal(afterSecond.turn, 2);
});

test("drawing under a pending pick takes the whole accumulation", () => {
  const state = stateWith({
    hands: [
      [card("circle", 2), card("circle", 7)],
      [card("triangle", 3)],
      [card("star", 7)],
    ],
    pile: [card("circle", 9)],
    stock: [card("star", 1), card("star", 2), card("star", 3), card("star", 4)],
  });

  const afterPlay = applyMove(state, { type: "play", playerIndex: 0, cardId: "circle-2" });
  const afterDraw = applyMove(afterPlay, { type: "draw", playerIndex: 1 });

  assert.equal(afterDraw.players[1].hand.length, 3, "took both cards");
  assert.equal(afterDraw.pendingPick, null);
  assert.equal(afterDraw.turn, 2, "the drawer does not get to play");
});

test("suspension skips one player, and the star eight skips two", () => {
  const fourHands = () => [
    [card("circle", 8), card("circle", 7)],
    [card("triangle", 3)],
    [card("square", 4)],
    [card("star", 5)],
  ];

  const normal = applyMove(
    stateWith({ hands: fourHands(), pile: [card("circle", 8)] }),
    { type: "play", playerIndex: 0, cardId: "circle-8" },
  );
  assert.equal(normal.turn, 2, "player 1 is skipped");

  const starEight = stateWith({ hands: fourHands(), pile: [card("circle", 8)] });
  starEight.players[0].hand[0] = card("star", 8);
  const superSuspended = applyMove(starEight, {
    type: "play",
    playerIndex: 0,
    cardId: "star-8",
  });
  assert.equal(superSuspended.turn, 3, "players 1 and 2 are skipped");
});

test("general market makes everyone else draw", () => {
  const state = stateWith({
    hands: [
      [card("circle", 14), card("circle", 7)],
      [card("triangle", 3)],
      [card("square", 4)],
    ],
    pile: [card("circle", 9)],
    stock: [card("star", 1), card("star", 2), card("star", 3)],
  });

  const next = applyMove(state, { type: "play", playerIndex: 0, cardId: "circle-14" });

  assert.equal(next.players[0].hand.length, 1);
  assert.equal(next.players[1].hand.length, 2);
  assert.equal(next.players[2].hand.length, 2);
  assert.equal(next.turn, 1);
});

test("a whot names the suit that must follow", () => {
  const state = stateWith({
    hands: [[WHOT, card("circle", 7)], [card("star", 4)], [card("circle", 5)]],
    pile: [card("circle", 9)],
  });

  const next = applyMove(state, {
    type: "play",
    playerIndex: 0,
    cardId: "whot-1",
    calledSuit: "star",
  });

  assert.equal(next.calledSuit, "star");
  assert.equal(next.turn, 1);
  assert.deepEqual(
    legalCardsFor(next).map((c) => c.id),
    ["star-4"],
    "only the called suit is playable",
  );
});

test("a whot without a suit call is rejected", () => {
  const state = stateWith({
    hands: [[WHOT], [card("star", 4)]],
    pile: [card("circle", 9)],
  });

  assert.throws(
    () => applyMove(state, { type: "play", playerIndex: 0, cardId: "whot-1" }),
    /valid suit/,
  );
});

test("playing out of turn and playing an illegal card are both rejected", () => {
  const state = stateWith({
    hands: [[card("star", 4), card("star", 5)], [card("circle", 9)]],
    pile: [card("circle", 9)],
  });

  assert.throws(
    () => applyMove(state, { type: "play", playerIndex: 1, cardId: "circle-9" }),
    /Out of turn/,
  );
  assert.throws(
    () => applyMove(state, { type: "play", playerIndex: 0, cardId: "star-4" }),
    /cannot be played/,
  );
});

/**
 * Pinned deliberately: emptying your hand ends the hand immediately, so a special card
 * played as the winning card does not fire. This matters for the 14, where the printed
 * 1970s rules explicitly say everyone still draws. Settle it before mainnet.
 */
test("playing your last card ends the game and its effect does not fire", () => {
  const state = stateWith({
    hands: [[card("circle", 14)], [card("triangle", 3)], [card("square", 4)]],
    pile: [card("circle", 9)],
    stock: [card("star", 1), card("star", 2)],
  });

  const next = applyMove(state, { type: "play", playerIndex: 0, cardId: "circle-14" });

  assert.equal(next.finished, true);
  assert.equal(next.winner, 0);
  assert.equal(next.players[1].hand.length, 1, "general market did not fire");
});

test("a whot's called suit survives a player drawing", () => {
  const state = stateWith({
    hands: [
      [WHOT, card("circle", 7)],
      [card("triangle", 3), card("triangle", 4)],
      [card("star", 5)],
    ],
    pile: [card("circle", 9)],
  });

  const called = applyMove(state, {
    type: "play",
    playerIndex: 0,
    cardId: "whot-1",
    calledSuit: "star",
  });
  assert.equal(called.calledSuit, "star");

  // Player 1 holds no star, so draws. The whot is still face up, so the call stands.
  const afterDraw = applyMove(called, { type: "draw", playerIndex: 1 });

  assert.equal(afterDraw.calledSuit, "star", "the call is not reset by a draw");
  assert.equal(afterDraw.turn, 2);
  assert.deepEqual(
    legalCardsFor(afterDraw).map((c) => c.id),
    ["star-5"],
    "the next player is still bound to the called shape",
  );
});

test("a full game reaches a winner and ranks everyone", () => {
  let state = createGame({ seed: 20260919, playerIds: ["a", "b", "c", "d", "e"] });

  for (let step = 0; step < 5000 && !state.finished; step += 1) {
    const legal = legalCardsFor(state);
    const move = legal.length
      ? {
          type: "play",
          playerIndex: state.turn,
          cardId: legal[0].id,
          calledSuit: legal[0].number === 20 ? "circle" : undefined,
        }
      : { type: "draw", playerIndex: state.turn };

    state = applyMove(state, move);
  }

  assert.ok(state.finished, "game should finish inside 5000 moves");

  const order = standings(state);
  assert.equal(order.length, 5);
  assert.equal(order[0], state.winner);
  assert.equal(new Set(order).size, 5, "every player is ranked exactly once");

  const ranked = order.map((i) => state.players[i].hand.length);
  for (let i = 1; i < ranked.length - 1; i += 1) {
    assert.ok(ranked[i] <= ranked[i + 1], "ranked by fewest cards left");
  }
});

test("cards score face value, stars double, and a whot is twenty", () => {
  assert.equal(cardValue(card("square", 14)), 14);
  assert.equal(cardValue(card("circle", 2)), 2);
  assert.equal(cardValue(card("star", 8)), 16, "stars count double");
  assert.equal(cardValue(WHOT), 20);

  const hand = [
    card("square", 14),
    card("square", 4),
    card("square", 2),
    card("circle", 2),
  ];

  assert.equal(scoreHand(hand), 22, "matches the worked example");
  assert.equal(scoreHand([]), 0);
});

test("an emptied stock settles the hand on fewest cards, with no reshuffle", () => {
  const state = stateWith({
    hands: [
      [card("star", 4), card("star", 5), card("star", 7)],
      [card("star", 8)],
      [card("star", 10), card("star", 11)],
    ],
    pile: [card("circle", 9)],
    stock: [card("triangle", 3)],
  });

  // Player 0 cannot play a star on a circle, so this draw takes the last card.
  const next = applyMove(state, { type: "draw", playerIndex: 0 });

  assert.equal(next.stock.length, 0);
  assert.equal(next.finished, true);
  assert.equal(next.endedBy, "exhaustion");
  assert.equal(next.winner, 1, "fewest cards wins");
  assert.deepEqual(standings(next), [1, 2, 0]);
});

test("the stock never refills from the pile", () => {
  const state = stateWith({
    hands: [[card("star", 4)], [card("star", 6)], [card("star", 7)]],
    pile: [card("circle", 2), card("circle", 3), card("circle", 9)],
    stock: [],
  });

  const next = applyMove(state, { type: "draw", playerIndex: 0 });

  assert.equal(next.stock.length, 0, "no cards came back out of the pile");
  assert.equal(next.players[0].hand.length, 1, "nothing drawn");
  assert.equal(next.pile.length, 3, "the pile is untouched");
});

test("a pass skips the player without drawing", () => {
  const state = stateWith({
    hands: [[card("circle", 7)], [card("triangle", 3)], [card("square", 4)]],
    pile: [card("circle", 9)],
    stock: [card("star", 1)],
  });

  const next = applyMove(state, { type: "pass", playerIndex: 0 });

  assert.equal(next.turn, 1);
  assert.equal(next.players[0].hand.length, 1, "nothing drawn");
  assert.equal(next.stock.length, 1, "stock untouched");
  assert.deepEqual(next.log.at(-1), { type: "pass", playerIndex: 0 });
});

test("passing under a pending pick still costs you the pick", () => {
  const state = stateWith({
    hands: [
      [card("circle", 2), card("circle", 7)],
      [card("triangle", 3)],
      [card("square", 4)],
    ],
    pile: [card("circle", 9)],
    stock: [card("star", 1), card("star", 2), card("star", 3)],
  });

  const afterPlay = applyMove(state, { type: "play", playerIndex: 0, cardId: "circle-2" });
  const afterPass = applyMove(afterPlay, { type: "pass", playerIndex: 1 });

  assert.equal(afterPass.players[1].hand.length, 3, "took the two");
  assert.equal(afterPass.pendingPick, null);
  assert.equal(afterPass.turn, 2);
});

test("an abandoned game has no winner and nobody is ranked", () => {
  const state = stateWith({
    hands: [[card("circle", 7)], [card("triangle", 3)]],
    pile: [card("circle", 9)],
  });

  const dead = abandonGame(state, "Nobody played for five minutes.");

  assert.equal(dead.finished, true);
  assert.equal(dead.winner, null);
  assert.equal(dead.abandoned, "Nobody played for five minutes.");
  assert.equal(standings(dead), null, "nobody is credited with the pot");
  assert.throws(
    () => applyMove(dead, { type: "draw", playerIndex: 0 }),
    /already finished/,
  );
});
