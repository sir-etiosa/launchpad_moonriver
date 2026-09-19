import { buildDeck, deal, isWhot, shuffle } from "./deck.mjs";
import { effectOf, isPlayable, isValidSuit, turnSkipsFor } from "./rules.mjs";

/**
 * Pure Whot engine.
 *
 * Every function returns a new state and mutates nothing, so the server can persist the
 * move list and replay a game from its seed at any time. That property is what makes the
 * signed result auditable, and it is the reason `Math.random` is banned from this module.
 */

export function createGame({ seed, playerIds }) {
  const deck = shuffle(buildDeck(), seed);
  const { hands, stock } = deal(deck, playerIds.length);

  return {
    seed,
    players: playerIds.map((id, index) => ({ id, hand: hands[index] })),
    stock,
    pile: [],
    turn: 0,
    calledSuit: null,
    pendingPick: null,
    winner: null,
    finished: false,
    log: [],
  };
}

export function topCard(state) {
  return state.pile.length ? state.pile[state.pile.length - 1] : null;
}

export function contextFor(state) {
  return {
    topCard: topCard(state),
    calledSuit: state.calledSuit,
    pendingPick: state.pendingPick,
  };
}

export function legalCardsFor(state, playerIndex = state.turn) {
  return state.players[playerIndex].hand.filter((card) =>
    isPlayable(card, contextFor(state)),
  );
}

function advance(state, steps) {
  const count = state.players.length;
  return (state.turn + steps) % count;
}

/**
 * Draw `amount` for one player.
 *
 * There is deliberately no reshuffle here: the stock is the clock. When it runs dry the
 * hand is settled on fewest cards, so topping it back up from the pile would defeat the
 * whole point. Players simply draw what is left.
 */
function drawFor(state, playerIndex, amount) {
  const stock = [...state.stock];
  const hand = [...state.players[playerIndex].hand];

  for (let i = 0; i < amount; i += 1) {
    if (stock.length === 0) break;
    hand.push(stock.pop());
  }

  const players = state.players.map((player, index) =>
    index === playerIndex ? { ...player, hand } : player,
  );

  return { ...state, players, stock };
}

function withTurn(state, nextTurn) {
  return { ...state, turn: nextTurn };
}

function finishIfWon(state, playerIndex) {
  if (state.players[playerIndex].hand.length > 0) return state;

  return { ...state, winner: playerIndex, finished: true };
}

/**
 * Apply the card's effect and hand the turn on. The order matters: `holdOn` returns the
 * turn to the player who just acted, and a pending pick must survive into the next
 * player's turn for chains to accumulate.
 */
function resolveCardEffects(state, card, playerIndex, calledSuit) {
  const effect = effectOf(card);

  switch (effect) {
    case "holdOn":
      return withTurn({ ...state, pendingPick: null, calledSuit: null }, playerIndex);

    case "pickTwo":
      return withTurn(
        {
          ...state,
          calledSuit: null,
          pendingPick: {
            kind: "two",
            count: (state.pendingPick?.count ?? 0) + 2,
          },
        },
        advance(state, 1),
      );

    case "pickThree":
      return withTurn(
        {
          ...state,
          calledSuit: null,
          pendingPick: {
            kind: "three",
            count: (state.pendingPick?.count ?? 0) + 3,
          },
        },
        advance(state, 1),
      );

    case "suspension":
      return withTurn(
        { ...state, pendingPick: null, calledSuit: null },
        advance(state, 1 + turnSkipsFor(card)),
      );

    case "generalMarket": {
      let next = { ...state, pendingPick: null, calledSuit: null };
      for (let i = 0; i < state.players.length; i += 1) {
        if (i !== playerIndex) next = drawFor(next, i, 1);
      }
      return withTurn(next, advance(state, 1));
    }

    case "whot":
      return withTurn(
        { ...state, pendingPick: null, calledSuit },
        advance(state, 1),
      );

    default:
      return withTurn({ ...state, pendingPick: null, calledSuit: null }, advance(state, 1));
  }
}

/**
 * The stock is the clock. Once it is empty there is nothing left to draw, so the hand
 * settles immediately on fewest cards held rather than playing on until someone sheds
 * everything. Ties are broken by seat order.
 */
function settleIfExhausted(state) {
  if (state.finished || state.stock.length > 0) return state;

  const ranked = state.players
    .map((player, index) => ({ index, remaining: player.hand.length }))
    .sort((a, b) => a.remaining - b.remaining);

  return {
    ...state,
    finished: true,
    winner: ranked[0].index,
    endedBy: "exhaustion",
  };
}

export function applyMove(state, move) {
  if (state.finished) throw new Error("This game is already finished.");
  if (move.playerIndex !== state.turn) {
    throw new Error(`Out of turn: player ${move.playerIndex} moved on ${state.turn}'s turn.`);
  }

  if (move.type === "draw") return settleIfExhausted(applyDraw(state, move));

  if (move.type === "play") return settleIfExhausted(applyPlay(state, move));

  if (move.type === "pass") return settleIfExhausted(applyPass(state, move));

  throw new Error(`Unknown move type: ${move.type}`);
}

/**
 * Skip a player who has gone quiet.
 *
 * Passing while a pick is pending still costs you the pick — you did not play a 2, so
 * the accumulated draw is yours. Otherwise it is a bare skip, which is what "a pass"
 * means for a table of three or more.
 */
function applyPass(state, move) {
  if (state.pendingPick) return applyDraw(state, move);

  const next = withTurn({ ...state, calledSuit: null }, advance(state, 1));

  return {
    ...next,
    log: [...state.log, { type: "pass", playerIndex: move.playerIndex }],
  };
}

/**
 * End a hand early, with no winner. Used when a table is abandoned or a head-to-head
 * goes quiet for the full timeout, so nobody is credited with a pot they did not win.
 */
export function abandonGame(state, reason) {
  if (state.finished) return state;

  return { ...state, finished: true, winner: null, abandoned: reason };
}

function applyDraw(state, move) {
  const playerIndex = move.playerIndex;

  // A pending pick cannot be side-stepped by drawing a single card: you take the lot.
  const amount = state.pendingPick ? state.pendingPick.count : 1;
  const drawn = drawFor(state, playerIndex, amount);

  /*
   * The called suit survives a draw. Drawing does not change the card on top of the
   * pile, so the whot that named the shape is still the thing to beat — clearing it here
   * would quietly let a player who drew reset the call for everyone after them.
   */
  const next = withTurn({ ...drawn, pendingPick: null }, advance(state, 1));

  return { ...next, log: [...state.log, { type: "draw", playerIndex, amount }] };
}

function applyPlay(state, move) {
  const playerIndex = move.playerIndex;
  const player = state.players[playerIndex];
  const card = player.hand.find((c) => c.id === move.cardId);

  if (!card) throw new Error(`Player ${playerIndex} does not hold ${move.cardId}.`);

  if (!isPlayable(card, contextFor(state))) {
    throw new Error(`${card.id} cannot be played on the current pile.`);
  }

  if (isWhot(card)) {
    if (!isValidSuit(move.calledSuit)) {
      throw new Error("Playing a Whot requires naming a valid suit.");
    }
  }

  const players = state.players.map((p, index) =>
    index === playerIndex ? { ...p, hand: p.hand.filter((c) => c.id !== card.id) } : p,
  );

  const played = {
    ...state,
    players,
    pile: [...state.pile, card],
    log: [...state.log, { type: "play", playerIndex, cardId: card.id, calledSuit: move.calledSuit ?? null }],
  };

  const settled = finishIfWon(played, playerIndex);
  if (settled.finished) return settled;

  return resolveCardEffects(settled, card, playerIndex, move.calledSuit ?? null);
}

/**
 * Final order. The winner is whoever emptied first; behind them, players are ranked by
 * how few cards they are still holding. Only first and second are paid, so this is the
 * rule the payout depends on — see the plan's open question about second place.
 */
export function standings(state) {
  if (!state.finished || state.winner === null) return null;

  const rest = state.players
    .map((player, index) => ({ index, remaining: player.hand.length }))
    .filter((entry) => entry.index !== state.winner)
    .sort((a, b) => a.remaining - b.remaining);

  return [state.winner, ...rest.map((entry) => entry.index)];
}
