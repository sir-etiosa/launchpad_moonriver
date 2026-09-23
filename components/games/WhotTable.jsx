"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

import WhotCard from "@/components/games/WhotCard";
import { WhotCardStack } from "@/components/games/WhotCardBack";
import { useProfile } from "@/components/dapp/ProfileProvider";
import { SUIT_NAMES, WhotSuit } from "@/components/games/suits";
import { SUITS } from "@/lib/whot/deck.mjs";
import { scoreHand } from "@/lib/whot/rules.mjs";
import {
  abandonGame,
  applyMove,
  createGame,
  legalCardsFor,
  standings,
  topCard,
} from "@/lib/whot/engine.mjs";

const HUMAN = 0;
const BOT_NAMES = ["Bot Ada", "Bot Lio", "Bot Kene", "Bot Zara"];

/** Head to head gives five minutes of silence; a bigger table passes after forty-five seconds. */
const HEAD_TO_HEAD_SECONDS = 300;
const TABLE_SECONDS = 45;

/**
 * How long a bot pauses before taking its turn. This is really a courtesy to the human:
 * at ~650ms the table flipped between opponents faster than you could read, so each move
 * now waits long enough for the board to be legible before it changes again.
 */
const BOT_THINK_MS = 1500;
const GAME_STORAGE_KEY = "moonriver:whot-game-id";
const SNAPSHOT_STORAGE_KEY = "moonriver:whot-snapshot";

function quietLimitFor(playerCount) {
  return playerCount === 2 ? HEAD_TO_HEAD_SECONDS : TABLE_SECONDS;
}

function formatClock(total) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function buildGame(playerCount, seed, playerName = "You") {
  const playerIds = [playerName, ...BOT_NAMES.slice(0, playerCount - 1)];
  return createGame({ seed, playerIds });
}

function playerNameFor(game, index, humanName) {
  return index === HUMAN ? humanName : game.players[index].id;
}

function saveBrowserSnapshot(gameId, state, pendingWhot) {
  window.localStorage.setItem(GAME_STORAGE_KEY, gameId);
  window.localStorage.setItem(
    SNAPSHOT_STORAGE_KEY,
    JSON.stringify({ state, pendingWhot }),
  );
}

function clearBrowserSession() {
  window.localStorage.removeItem(GAME_STORAGE_KEY);
  window.localStorage.removeItem(SNAPSHOT_STORAGE_KEY);
}

/** Bots play the first legal card they hold, and call their strongest suit on a whot. */
function botSuit(state) {
  const counts = {};
  for (const card of state.players[state.turn].hand) {
    if (card.suit) counts[card.suit] = (counts[card.suit] ?? 0) + 1;
  }
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : "circle";
}

function botMove(state) {
  const legal = legalCardsFor(state);

  if (legal.length === 0) {
    return applyMove(state, { type: "draw", playerIndex: state.turn });
  }

  const card = legal[0];
  return applyMove(state, {
    type: "play",
    playerIndex: state.turn,
    cardId: card.id,
    calledSuit: card.number === 20 ? botSuit(state) : undefined,
  });
}

/**
 * The moments that actually change what you must do. Everything else on the board is
 * state you can read at leisure; these are the ones that cost you cards if you miss
 * them, so they get a banner with a live region rather than a line of small text.
 */
const ALERT_TONES = {
  down: "border-down/60 bg-down-dim text-down",
  gold: "border-gold/60 bg-gold-dim text-gold",
};

function alertFor(game, { isHumanTurn, suitPickerOpen, humanHandSize, humanName }) {
  if (!game || game.finished) return null;

  if (suitPickerOpen) {
    return {
      tone: "gold",
      title: "Name a suit",
      detail: "You played a whot. Choose the shape that has to follow.",
    };
  }

  // Someone called a suit and the next move is yours: this is the whole question.
  if (game.calledSuit && game.turn === HUMAN) {
    const name = SUIT_NAMES[game.calledSuit];
    return {
      tone: "gold",
      suit: game.calledSuit,
      title: `${name} called`,
      detail: `Play a ${name.toLowerCase()} or a whot. Draw if you hold neither.`,
    };
  }

  if (game.pendingPick) {
    const { count, kind } = game.pendingPick;
    const stacking = kind === "two" ? "2" : "5";

    return game.turn === HUMAN
      ? {
          tone: "down",
          title: `Pick ${count}`,
          detail: `Take ${count} cards, or stack another ${stacking} to hand it on.`,
        }
      : {
          tone: "down",
          title: `Pick ${count}`,
          detail: `${playerNameFor(game, game.turn, humanName)} is sitting under it.`,
        };
  }

  if (isHumanTurn && humanHandSize <= 2) {
    return {
      tone: "gold",
      title: humanHandSize === 1 ? "Last card" : "Semi last",
      detail:
        humanHandSize === 1
          ? "One card from winning the hand."
          : "Two cards left. Call it when you get to one.",
    };
  }

  return null;
}

function GameAlert({ tone, title, detail, suit, className = "" }) {
  return (
    <div
      role="status"
      aria-live={tone === "down" ? "assertive" : "polite"}
      className={`flex items-start gap-4 rounded-sharp border px-5 py-4 ${className} ${
        ALERT_TONES[tone] ?? ALERT_TONES.gold
      }`}
    >
      {suit ? (
        // When a suit is called the shape itself is the message, so it replaces the dot.
        <WhotSuit suit={suit} className="mt-0.5 h-10 w-10 shrink-0" />
      ) : (
        <span
          aria-hidden="true"
          className="mt-2.5 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-current"
        />
      )}
      <div>
        <p className="m-0 font-mono text-2xl leading-none font-bold tracking-[0.06em] uppercase">
          {title}
        </p>
        <p className="mt-2 mb-0 text-base text-quiet">{detail}</p>
      </div>
    </div>
  );
}

/**
 * The last stretch of your own clock.
 *
 * Deliberately not a live region: the number changes every second, so an announcement
 * would fire sixty times a minute and talk over everything else. It is a visual alarm;
 * the turn itself is already announced in words.
 */
function CountdownAlert({ seconds, headToHead }) {
  return (
    <div
      aria-live="off"
      className="flex items-center gap-6 rounded-sharp border border-down/60 bg-down-dim px-5 py-4"
    >
      <span
        className="font-mono text-5xl leading-none font-bold text-down tabular-nums"
        data-numeric=""
      >
        {seconds}
      </span>
      <span>
        <span className="block font-mono text-lg leading-none font-bold tracking-[0.08em] text-down uppercase">
          Seconds left
        </span>
        <span className="mt-1.5 block text-base text-quiet">
          {headToHead
            ? "Run out and the hand is voided with no winner."
            : "Run out and your turn is passed."}
        </span>
      </span>
    </div>
  );
}

/** Card counts only: another player's hand stays hidden, the count is the public part. */
function CardCount({ count, className = "" }) {
  return (
    <p
      className={`m-0 font-mono text-2xl leading-none font-semibold ${className}`}
      data-numeric=""
    >
      {count}
      <span className="ml-2 font-sans text-sm text-quiet">
        {count === 1 ? "card" : "cards"}
      </span>
    </p>
  );
}

function LastCardWarning({ count, className = "" }) {
  if (count > 2) return null;

  return (
    <p className={`m-0 font-mono text-sm text-gold ${className}`}>
      {count === 1 ? "last card" : "semi last"}
    </p>
  );
}

function WinnerBadge() {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-sharp border border-gold/60 bg-gold-dim px-5 py-4">
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        fill="none"
        className="h-14 w-14 shrink-0 text-gold"
      >
        <path
          d="M16 8h16v11c0 6-3.2 10-8 10s-8-4-8-10V8Z"
          fill="currentColor"
          fillOpacity=".18"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M16 12H9v4c0 5.2 3 8 8 8M32 12h7v4c0 5.2-3 8-8 8M24 29v6M17 40h14M19 35h10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m24 12 1.5 3 3.3.5-2.4 2.3.6 3.2-3-1.5-3 1.5.6-3.2-2.4-2.3 3.3-.5L24 12Z" fill="currentColor" />
      </svg>
      <div>
        <p className="label m-0 text-gold">Winner</p>
        <p className="m-0 mt-1 text-2xl font-semibold tracking-tight text-paper">
          You won the hand
        </p>
      </div>
    </div>
  );
}

export default function WhotTable() {
  const [phase, setPhase] = useState("lobby");
  const [playerCount, setPlayerCount] = useState(4);
  const [game, setGame] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [resumeSession, setResumeSession] = useState(null);
  const [persistenceVersion, setPersistenceVersion] = useState(0);
  const [pendingWhot, setPendingWhot] = useState(null);
  const [remaining, setRemaining] = useState(TABLE_SECONDS);
  const [persistenceError, setPersistenceError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const ownerKeyRef = useRef("");
  const persistenceVersionRef = useRef(0);
  // No wallet, no table: a hand you cannot be paid for is not worth dealing.
  const { address, isConnected } = useAccount();
  const { displayName } = useProfile();

  const finished = Boolean(game?.finished);
  const isHumanTurn = Boolean(game) && !finished && game.turn === HUMAN;
  const suitPickerOpen = pendingWhot !== null;
  const quietLimit = quietLimitFor(playerCount);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      if (!isConnected || !address) {
        setResumeSession(null);
        setGame(null);
        setGameId(null);
        setPhase("lobby");
        if (mounted) setHydrated(true);
        return;
      }

      const ownerKey = address.toLowerCase();
      ownerKeyRef.current = ownerKey;
      setResumeSession(null);
      setGame(null);
      setGameId(null);
      setPhase("lobby");
      const savedGameId = window.localStorage.getItem(GAME_STORAGE_KEY);

      try {
        const response = await fetch(
          savedGameId
            ? `/api/games/whot/${savedGameId}`
            : `/api/games/whot?ownerKey=${encodeURIComponent(ownerKey)}`,
          { headers: { "x-whot-owner": ownerKey } },
        );

        if (response.ok) {
          const saved = await response.json();
          if (!mounted) return;
          const session = saved.active ?? saved.game ?? (saved.state ? saved : null);
          if (!session?.state) {
            setHydrated(true);
            return;
          }
          setResumeSession(session);
          setPlayerCount(session.state.players.length);
          setPersistenceError("");
        } else if (response.status === 404 && savedGameId) {
          clearBrowserSession();
        } else {
          throw new Error("The game server could not be reached.");
        }
      } catch {
        const snapshot = JSON.parse(
          window.localStorage.getItem(SNAPSHOT_STORAGE_KEY) ?? "null",
        );
        if (mounted && snapshot?.state) {
          setResumeSession({ gameId: savedGameId, state: snapshot.state, version: 0 });
          setPlayerCount(snapshot.state.players.length);
          setPersistenceError("Connection lost. Playing from the saved local snapshot.");
        }
      } finally {
        if (mounted) setHydrated(true);
      }
    }

    restoreSession();
    return () => {
      mounted = false;
    };
  }, [address, isConnected]);

  useEffect(() => {
    if (!hydrated || !game || !gameId) return;

    saveBrowserSnapshot(gameId, game, pendingWhot);
    if (!ownerKeyRef.current) return;

    const version = persistenceVersionRef.current;
    fetch(`/api/games/whot/${gameId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-whot-owner": ownerKeyRef.current,
      },
      body: JSON.stringify({ state: game, version }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Game save failed.");
        const saved = await response.json();
        persistenceVersionRef.current = saved.version;
        setPersistenceVersion(saved.version);
        setPersistenceError("");
      })
      .catch(() => {
        setPersistenceError("Connection lost. Your latest move is saved on this device.");
      });
  }, [game, gameId, hydrated, pendingWhot]);

  function continueGame(session = resumeSession) {
    if (!session?.state) return;

    const snapshot = JSON.parse(
      window.localStorage.getItem(SNAPSHOT_STORAGE_KEY) ?? "null",
    );
    setGame(session.state);
    setGameId(session.gameId);
    setPersistenceVersion(session.version);
    persistenceVersionRef.current = session.version;
    setPlayerCount(session.state.players.length);
    setRemaining(quietLimitFor(session.state.players.length));
    setPendingWhot(snapshot?.pendingWhot ?? null);
    setResumeSession(null);
    setPhase("playing");
  }

  async function startGame(count = playerCount) {
    if (resumeSession?.gameId && ownerKeyRef.current) {
      await fetch(`/api/games/whot/${resumeSession.gameId}`, {
        method: "DELETE",
        headers: { "x-whot-owner": ownerKeyRef.current },
      }).catch(() => {});
      clearBrowserSession();
    }

    setPlayerCount(count);
    const nextGame = buildGame(count, Math.floor(Math.random() * 2 ** 31), displayName);
    const ownerKey = ownerKeyRef.current || address?.toLowerCase();
    if (!ownerKey) return;
    ownerKeyRef.current = ownerKey;

    try {
      const response = await fetch("/api/games/whot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ownerKey, state: nextGame }),
      });
      if (!response.ok) throw new Error("Game persistence is unavailable.");
      const saved = await response.json();
      setGameId(saved.gameId);
      setPersistenceVersion(saved.version);
      persistenceVersionRef.current = saved.version;
      setGame(nextGame);
      setPersistenceError("");
      saveBrowserSnapshot(saved.gameId, nextGame, null);
    } catch {
      const localGameId = window.crypto.randomUUID();
      setGameId(localGameId);
      setGame(nextGame);
      setPersistenceError("Database unavailable. This game will resume only on this device.");
      saveBrowserSnapshot(localGameId, nextGame, null);
    }
    setPendingWhot(null);
    setRemaining(quietLimitFor(count));
    setPhase("playing");
  }

  function endGame() {
    if (gameId && ownerKeyRef.current && !finished) {
      fetch(`/api/games/whot/${gameId}`, {
        method: "DELETE",
        headers: { "x-whot-owner": ownerKeyRef.current },
      }).catch(() => {});
    }
    clearBrowserSession();
    setGame(null);
    setGameId(null);
    setResumeSession(null);
    setPendingWhot(null);
    setPhase("lobby");
  }

  // Bots take their own turns.
  useEffect(() => {
    if (phase !== "playing" || !game || finished || isHumanTurn || suitPickerOpen) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setGame((prev) => {
        if (!prev || prev.finished || prev.turn === HUMAN) return prev;
        return botMove(prev);
      });
    }, BOT_THINK_MS);

    return () => clearTimeout(timer);
  }, [phase, game, finished, isHumanTurn, suitPickerOpen]);

  // The inactivity clock restarts on every move.
  useEffect(() => {
    if (phase !== "playing") return;
    setRemaining(quietLimit);
  }, [phase, game?.log.length, quietLimit]);

  // It only ticks while the move is yours.
  useEffect(() => {
    if (phase !== "playing" || finished || suitPickerOpen || !isHumanTurn) {
      return undefined;
    }

    const id = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, finished, suitPickerOpen, isHumanTurn]);

  // Out of time: head to head voids the hand, a bigger table passes your turn.
  useEffect(() => {
    if (phase !== "playing" || finished || suitPickerOpen || !isHumanTurn) return;
    if (remaining > 0) return;

    setGame((prev) => {
      if (!prev || prev.finished || prev.turn !== HUMAN) return prev;

      return prev.players.length === 2
        ? abandonGame(prev, "Nobody played for five minutes, so the hand was voided.")
        : applyMove(prev, { type: "pass", playerIndex: HUMAN });
    });
  }, [phase, finished, suitPickerOpen, isHumanTurn, remaining]);

  if (phase === "lobby") {
    return (
      <div className="space-y-9 pt-8">
        <header>
          <p className="label m-0">Games</p>
          <h1 className="mt-4 mb-0 text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
            Whot
          </h1>
        </header>

        <div className="rounded-sharp border border-rule bg-panel px-7 py-8">
          <p className="label m-0">Table setup</p>
          <h2 className="mt-4 mb-0 text-2xl font-semibold tracking-tight">
            Choose your table
          </h2>

        <div
          role="group"
          aria-label="Number of players"
          className="mt-7 flex flex-wrap gap-3"
        >
          {[2, 3, 4, 5].map((count) => (
            <button
              key={count}
              type="button"
              aria-pressed={playerCount === count}
              onClick={() => setPlayerCount(count)}
              className={`cursor-pointer rounded-sharp border px-5 py-3 text-base font-semibold transition-colors duration-150 ${
                playerCount === count
                  ? "border-gold bg-gold text-ink"
                  : "border-rule text-quiet hover:border-rule-strong hover:text-paper"
              }`}
            >
              {count === 2 ? "1:1" : `${count} players`}
            </button>
          ))}
        </div>

        <dl className="mt-8 grid gap-6 border-t border-rule pt-6 sm:grid-cols-3">
          <div>
            <dt className="label m-0">Seats</dt>
            <dd className="m-0 mt-2 font-mono text-lg text-gold" data-numeric="">
              {playerCount}
            </dd>
          </div>
          <div>
            <dt className="label m-0">Idle timeout</dt>
            <dd className="m-0 mt-2 font-mono text-lg text-gold" data-numeric="">
              {formatClock(quietLimitFor(playerCount))}
            </dd>
          </div>
          <div>
            <dt className="label m-0">If you go quiet</dt>
            <dd className="m-0 mt-2 text-base text-paper">
              {playerCount === 2 ? "Hand voided, no winner" : "Your turn is passed"}
            </dd>
          </div>
        </dl>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          {resumeSession ? (
            <>
              <button
                type="button"
                onClick={() => continueGame()}
                className="cursor-pointer rounded-sharp border border-live bg-live px-7 py-3 text-base font-semibold text-ink transition-colors hover:bg-[#65e5b0]"
              >
                Continue game
              </button>
              <button
                type="button"
                onClick={() => startGame()}
                className="cursor-pointer rounded-sharp border border-gold bg-gold px-7 py-3 text-base font-semibold text-ink transition-colors hover:bg-gold-deep"
              >
                New game
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!isConnected}
              onClick={() => startGame()}
              className={`rounded-sharp border px-7 py-3 text-base font-semibold transition-colors duration-150 ${
                isConnected
                  ? "cursor-pointer border-gold bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep"
                  : "cursor-not-allowed border-rule text-faint"
              }`}
            >
              New game
            </button>
          )}

          {!isConnected ? (
            <>
              <ConnectButton />
              <span className="text-base text-quiet">
                Connect a wallet to take a seat.
              </span>
            </>
          ) : null}
        </div>
        </div>

        <details className="group rounded-sharp border border-rule bg-panel">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-7 py-5 text-lg font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
            How to play
            <span
              aria-hidden="true"
              className="font-mono text-2xl leading-none text-gold transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45"
            >
              +
            </span>
          </summary>

          <div className="space-y-7 border-t border-rule px-7 py-6">
            <div>
              <h3 className="label m-0">The deck</h3>
              <p className="mt-2.5 mb-0 max-w-[64ch] text-base leading-relaxed text-quiet">
                Fifty-four cards: five shapes (ball, angle, cross, carpet, star) numbered
                up to 14, plus five Whot cards. The shapes are unevenly filled, so some
                numbers only exist in some of them.
              </p>
            </div>

            <div>
              <h3 className="label m-0">A turn</h3>
              <p className="mt-2.5 mb-0 max-w-[64ch] text-base leading-relaxed text-quiet">
                Six cards each, the rest goes to the stock. Match the shape or the number
                of the card on top of the pile. A Whot can always be played, and playing
                one means naming the shape that has to follow. If you cannot play, draw
                instead.
              </p>
            </div>

            <div>
              <h3 className="label m-0">Special cards</h3>
              <dl className="mt-3">
                {[
                  ["1 — Hold on", "You play again."],
                  [
                    "2 — Pick two",
                    "The next player takes two, or stacks another 2 to hand it on. Chained twos add up.",
                  ],
                  ["5 — Pick three", "The same, in threes."],
                  [
                    "8 — Suspension",
                    "The next player misses a turn. The star 8 makes the next two miss.",
                  ],
                  ["14 — General market", "Everyone except you draws one."],
                  ["Whot", "Wild. Name the shape that follows."],
                ].map(([name, detail]) => (
                  <div
                    key={name}
                    className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-rule py-3 last:border-b-0"
                  >
                    <dt className="m-0 w-48 shrink-0 font-mono text-sm font-semibold tracking-[0.08em] text-gold uppercase">
                      {name}
                    </dt>
                    <dd className="m-0 max-w-[56ch] text-base text-quiet">{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="label m-0">How the hand ends</h3>
              <p className="mt-2.5 mb-0 max-w-[64ch] text-base leading-relaxed text-quiet">
                Play your last card and you win outright. Otherwise the stock is the clock:
                the moment it runs out, whoever is holding the fewest cards takes the hand,
                and every hand is turned face up.
              </p>
            </div>

            <div>
              <h3 className="label m-0">Scoring</h3>
              <p className="mt-2.5 mb-0 max-w-[64ch] text-base leading-relaxed text-quiet">
                Cards you are still holding when the hand ends count against you. A
                numbered card is worth its face value, a star is worth double, and a Whot
                is worth 20. So carpet 14, carpet 4, carpet 2 and circle 2 comes to 22. The
                final table shows what each player was holding and what it added up to.
              </p>
            </div>

            <div>
              <h3 className="label m-0">If you go quiet</h3>
              <p className="mt-2.5 mb-0 max-w-[64ch] text-base leading-relaxed text-quiet">
                Head to head gives you five minutes, then the hand is voided with no winner.
                At a bigger table your turn is passed after 45 seconds.
              </p>
            </div>
          </div>
        </details>
      </div>
    );
  }

  const legalIds = new Set(
    !finished && isHumanTurn ? legalCardsFor(game, HUMAN).map((card) => card.id) : [],
  );
  const pileTop = topCard(game);
  const pool = game.players[HUMAN].hand;
  const order = standings(game);
  const recent = game.log.slice(-5).reverse();
  // Nothing in hand fits the pile, so drawing is the only move left.
  const mustDraw = isHumanTurn && legalIds.size === 0;
  const alert = alertFor(game, {
    isHumanTurn,
    suitPickerOpen,
    humanHandSize: pool.length,
    humanName: displayName,
  });

  function playCard(card) {
    if (finished || !isHumanTurn) return;
    if (!legalIds.has(card.id)) return;

    if (card.number === 20) {
      setPendingWhot(card.id);
      return;
    }

    setGame(applyMove(game, { type: "play", playerIndex: HUMAN, cardId: card.id }));
  }

  function callSuit(suit) {
    setGame(
      applyMove(game, {
        type: "play",
        playerIndex: HUMAN,
        cardId: pendingWhot,
        calledSuit: suit,
      }),
    );
    setPendingWhot(null);
  }

  return (
    <div className="space-y-6 rounded-sharp">
      <h1 className="sr-only">Whot</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-sharp border border-rule bg-panel px-4 py-3">
        <div className="flex flex-wrap items-center gap-5">
          <span className="label m-0">
            {playerCount === 2 ? "1:1" : `${playerCount} players`} · locked
          </span>
          {isHumanTurn ? (
            <span
              className={`font-mono text-base ${
                remaining <= 15 ? "font-semibold text-down" : "text-quiet"
              }`}
              data-numeric=""
            >
              {formatClock(remaining)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={endGame}
          className={`cursor-pointer rounded-sharp border px-5 py-2 text-base font-semibold transition-colors duration-150 ${
            finished
              ? "border-rule-strong text-paper hover:border-gold hover:bg-gold-dim hover:text-gold"
              : "border-down/50 bg-down-dim text-down hover:border-down hover:bg-down hover:text-ink"
          }`}
        >
          {finished ? "Close game" : "Forfeit game"}
        </button>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-3 lg:justify-between">
        {game.players.slice(1).map((player, index) => {
          const seat = index + 1;
          const active = !finished && game.turn === seat;

          return (
            <div
              key={player.id}
              className={`min-w-[9rem] flex-1 rounded-sharp border px-3 py-3 text-center transition-colors duration-300 lg:flex-none ${
                active
                  ? "border-live/60 bg-live-panel"
                  : "border-rule bg-panel"
              }`}
            >
              <div className="flex items-baseline justify-center gap-3 rounded-sharp">
                <p
                  className={`m-0 text-base font-semibold tracking-tight ${
                    active ? "text-live" : "text-paper"
                  }`}
                >
                  {playerNameFor(game, seat, displayName)}
                </p>
                {active ? (
                  <span className="m-0 font-mono text-sm tracking-[0.12em] text-live uppercase">
                    playing
                  </span>
                ) : null}
              </div>
              <CardCount count={player.hand.length} className="mt-1" />
              <LastCardWarning count={player.hand.length} className="mt-1" />

              {finished ? (
                // Once the hand is settled there is nothing left to hide, so every hand
                // is laid out as compact face-up chips.
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {player.hand.map((held) => (
                    <span
                      key={held.id}
                      className="inline-flex items-center gap-1.5 rounded-sharp border border-[#4a3823]/25 bg-white px-2 py-1 font-mono text-sm font-semibold text-[#4a3823]"
                    >
                      {held.number}
                      <WhotSuit suit={held.suit} className="h-3.5 w-3.5" />
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mt-2 flex justify-center">
                  <WhotCardStack count={player.hand.length} size="sm" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 rounded-sharp lg:grid-cols-[minmax(0,1fr)_10rem]">
        <div className="flex flex-col gap-6">
          {isHumanTurn && remaining <= 15 ? (
            <CountdownAlert seconds={remaining} headToHead={playerCount === 2} />
          ) : null}

      <div className="order-2 rounded-sharp border border-rule bg-panel shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
        <div className="grid items-center gap-x-8 gap-y-6 px-6 py-6 lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col items-start gap-2.5">
            <span
              className={`m-0 font-mono text-sm font-semibold tracking-[0.1em] uppercase ${
                isHumanTurn ? "text-live" : "text-quiet"
              }`}
            >
              {finished
                ? "Hand over"
                : isHumanTurn
                  ? "Your turn"
                  : `${playerNameFor(game, game.turn, displayName)} thinking`}
            </span>
            {!finished && isHumanTurn ? (
              <p className="m-0 max-w-[18ch] text-base font-semibold leading-snug text-paper">
                Choose a highlighted card.
              </p>
            ) : null}
            {alert ? <GameAlert {...alert} className="mt-2 max-w-[20rem]" /> : null}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="text-center">
              {pileTop ? (
                <WhotCard card={pileTop} size="md" />
              ) : (
                <div className="flex h-[13rem] w-[9.5rem] items-center justify-center rounded-lg border border-dashed border-rule-strong">
                  <span className="font-mono text-sm text-quiet">empty</span>
                </div>
              )}
              <p className="label m-0 mt-3">Pile</p>

              {game.calledSuit ? (
                <p className="mt-2.5 mb-0 inline-flex items-center gap-2.5 rounded-sharp border border-gold/50 bg-gold-dim px-3.5 py-2 font-mono text-sm font-semibold tracking-[0.1em] text-gold uppercase">
                  <WhotSuit suit={game.calledSuit} className="h-5 w-5" />
                  {SUIT_NAMES[game.calledSuit]} called
                </p>
              ) : null}
            </div>

            <div className="text-center">
              <div className="flex h-[13rem] w-[9.5rem] items-center justify-center rounded-lg border border-dashed border-rule-strong">
                <CardCount count={game.stock.length} />
              </div>
              <p className="label m-0 mt-3">Stock</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end lg:text-right">
            {suitPickerOpen ? (
              <>
                <p className="label m-0">You played a whot</p>
                <p className="m-0 text-lg font-semibold tracking-tight">
                  Name the suit that follows
                </p>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {SUITS.map((suit) => (
                    <button
                      key={suit}
                      type="button"
                      onClick={() => callSuit(suit)}
                      className="flex cursor-pointer items-center gap-2 rounded-sharp border border-rule-strong px-3.5 py-2.5 text-base text-paper transition-colors duration-150 hover:border-gold hover:bg-gold-dim"
                    >
                      <WhotSuit suit={suit} />
                      {SUIT_NAMES[suit]}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={!isHumanTurn || finished}
                  onClick={() =>
                    setGame(applyMove(game, { type: "draw", playerIndex: HUMAN }))
                  }
                  className={`rounded-full border px-7 py-3 text-base font-semibold transition-colors duration-150 ${
                    mustDraw
                      ? // Solid live fill plus an outer glow: the board is already washed
                        // green on your turn, so the button has to out-shout its own
                        // background rather than just tint with it.
                        "cursor-pointer border-live bg-live text-ink shadow-[0_0_0_5px_rgba(78,217,164,0.28)]"
                      : isHumanTurn && !finished
                        ? "cursor-pointer border-rule-strong text-paper hover:border-gold hover:bg-gold-dim hover:text-gold"
                        : "cursor-not-allowed border-rule text-faint"
                  }`}
                >
                  {game.pendingPick ? `Draw ${game.pendingPick.count}` : "Draw a card"}
                </button>

                <p
                  className={`m-0 max-w-[28ch] font-mono text-sm leading-relaxed ${
                    mustDraw ? "text-live" : "text-faint"
                  }`}
                >
                  {game.pendingPick
                    ? `Take ${game.pendingPick.count}, or stack another ${
                        game.pendingPick.kind === "two" ? "2" : "5"
                      }.`
                    : mustDraw
                      ? "Nothing in your hand fits the pile. Draw to continue."
                      : "Play a card, or draw if you would rather not."}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="order-1">
      {finished ? (
        <div className="rounded-sharp border border-gold/40 bg-gold-dim px-6 py-6">
          {game.abandoned ? (
            <>
              <p className="label m-0">Hand voided</p>
              <h2 className="mt-3 mb-0 text-2xl font-semibold tracking-tight">
                No winner
              </h2>
              <p className="mt-3 mb-0 max-w-[56ch] text-base leading-relaxed text-quiet">
                {game.abandoned}
              </p>
            </>
          ) : (
            <>
              {game.winner === HUMAN ? <WinnerBadge /> : null}
              <p className="label m-0">Result</p>
              <h2 className="mt-3 mb-0 text-2xl font-semibold tracking-tight">
                {playerNameFor(game, game.winner, displayName)} wins the hand
              </h2>
              <table className="mt-5 w-full border-collapse">
                <caption className="sr-only">
                  Final standings: the cards each player is left holding and what those
                  cards are worth
                </caption>
                <thead>
                  <tr className="border-b border-rule-strong">
                    <th scope="col" className="label py-2.5 text-left font-medium">
                      Place
                    </th>
                    <th scope="col" className="label py-2.5 text-left font-medium">
                      Player
                    </th>
                    <th scope="col" className="label py-2.5 text-left font-medium">
                      Cards left
                    </th>
                    <th scope="col" className="label py-2.5 text-right font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.map((playerIndex, place) => {
                    const held = game.players[playerIndex].hand;

                    return (
                      <tr
                        key={playerNameFor(game, playerIndex, displayName)}
                        className="border-b border-rule"
                      >
                        <td
                          className="py-3 align-top font-mono text-base text-quiet"
                          data-numeric=""
                        >
                          {place + 1}
                        </td>
                        <td className="py-3 align-top text-base whitespace-nowrap">
                          {playerNameFor(game, playerIndex, displayName)}
                        </td>
                        <td className="py-3">
                          {held.length === 0 ? (
                            <span className="font-mono text-sm text-quiet">none</span>
                          ) : (
                            <span className="flex flex-wrap gap-1.5">
                              {held.map((card) => (
                                <span
                                  key={card.id}
                                  className="inline-flex items-center gap-1.5 rounded-sharp border border-[#4a3823]/25 bg-white px-2 py-1 font-mono text-sm font-semibold text-[#4a3823]"
                                >
                                  {card.number}
                                  <WhotSuit suit={card.suit} className="h-3.5 w-3.5" />
                                </span>
                              ))}
                            </span>
                          )}
                        </td>
                        <td
                          className="py-3 text-right align-top font-mono text-base font-semibold"
                          data-numeric=""
                        >
                          {scoreHand(held)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      ) : (
        <div
          className={`rounded-sharp border px-5 py-4 transition-colors duration-300 ${
            isHumanTurn ? "border-live/60 bg-live-panel" : "border-rule bg-panel"
          }`}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="label m-0">Your hand</p>
                {isHumanTurn ? (
                  <span className="rounded-full bg-live px-2.5 py-1 font-mono text-xs font-bold tracking-widest text-ink uppercase">
                    Play now
                  </span>
                ) : null}
              </div>
              <div className="mt-2 flex items-baseline gap-4">
                <CardCount count={pool.length} />
                <LastCardWarning count={pool.length} />
                {isHumanTurn ? (
                  <span className="font-mono text-sm text-live" data-numeric="">
                    {legalIds.size} playable
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {pool.map((card) => {
              const playable = legalIds.has(card.id);
              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={!playable}
                  onClick={() => playCard(card)}
                  aria-label={`Play ${card.number} of ${card.suit ?? "whot"}`}
                  className={`rounded-lg transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
                    playable
                      ? "cursor-pointer shadow-[0_0_0_3px_rgba(78,217,164,0.45)] hover:-translate-y-1.5 hover:shadow-[0_0_0_5px_rgba(78,217,164,0.7)]"
                      : "cursor-not-allowed"
                  }`}
                >
                  <WhotCard card={card} size="sm" muted={isHumanTurn && !playable} />
                </button>
              );
            })}
          </div>
        </div>
      )}
      </div>

        </div>

        <aside className="pt-6 lg:border-t-0 lg:border-l lg:pt-1 lg:pl-7">
          <p className="label m-0">Last moves</p>
        {recent.length === 0 ? (
          <p className="mt-3 mb-0 text-base text-quiet">
            No moves yet. Play any card to open the pile.
          </p>
        ) : (
          <ol className="mt-3 mb-0 list-none space-y-1.5 p-0 font-mono text-[0.8125rem] leading-snug text-quiet">
            {recent.map((entry, index) => (
              <li
                key={`${entry.type}-${game.log.length - index}`}
                data-numeric=""
                className={index === 0 ? "font-semibold text-gold" : ""}
              >
                <span className="text-paper">
                  {playerNameFor(game, entry.playerIndex, displayName)}
                </span>{" "}
                {entry.type === "play"
                  ? `played ${entry.cardId}`
                  : entry.type === "draw"
                    ? `drew ${entry.amount}`
                    : "passed"}
              </li>
            ))}
          </ol>
        )}
        </aside>
      </div>
    </div>
  );
}
