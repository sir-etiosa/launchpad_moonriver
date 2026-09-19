import Link from "next/link";

import { SUIT_NAMES, SUIT_ORDER, WhotSuit } from "@/components/games/suits";

export const metadata = {
  title: "Games",
  description: "Whot, chess and ludo tables staked in MVR on Arc.",
};

const games = [
  {
    name: "Whot",
    detail: "2 to 5 seats. Winner takes the pot, second keeps their stake.",
    href: "/app/games/whot",
  },
  {
    name: "Chess",
    detail: "Heads-up, one table per match.",
    status: "After Whot",
  },
  {
    name: "Ludo",
    detail: "Two to four seats on the same escrow.",
    status: "After chess",
  },
];

export default function GamesPage() {
  return (
    <div className="space-y-10 pt-8">
      <header>
        <h1 className="label m-0">Games</h1>
      </header>

      <ol className="m-0 list-none p-0">
        {games.map((game) => {
          const playable = Boolean(game.href);

          const row = (
            <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 py-7">
              <div className="flex items-baseline gap-6">
                <h2
                  className={`m-0 text-2xl font-semibold tracking-tight transition-colors duration-150 ${
                    playable ? "group-hover:text-live" : ""
                  }`}
                >
                  {game.name}
                </h2>
                {game.name === "Whot" ? (
                  <ul className="m-0 hidden list-none items-center gap-2.5 p-0 sm:flex">
                    {SUIT_ORDER.map((suit) => (
                      <li key={suit} aria-label={SUIT_NAMES[suit]}>
                        <WhotSuit suit={suit} className="h-5 w-5 text-faint" />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
                <p className="m-0 max-w-[38ch] text-base text-quiet">{game.detail}</p>
                {game.status ? (
                  <span
                    className={`font-mono text-sm tracking-[0.12em] uppercase ${
                      playable ? "text-gold" : "text-faint"
                    }`}
                  >
                    {game.status}
                  </span>
                ) : null}
              </div>
            </div>
          );

          return (
            <li key={game.name} className="border-t border-rule last:border-b">
              {playable ? (
                <Link
                  href={game.href}
                  className="group block no-underline transition-colors duration-150 hover:bg-live-dim"
                >
                  {row}
                </Link>
              ) : (
                <div className="opacity-50">{row}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
