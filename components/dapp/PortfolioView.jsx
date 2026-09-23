"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { useProfile } from "@/components/dapp/ProfileProvider";
import { shortenAddress } from "@/lib/format";

export default function PortfolioView() {
  const { address, isConnected } = useAccount();
  const { displayName, error, loading, saving, saveDisplayName } = useProfile();
  const [nameDraft, setNameDraft] = useState(displayName);
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => setNameDraft(displayName), [displayName]);

  useEffect(() => {
    if (!isConnected || !address) {
      setGameHistory([]);
      return undefined;
    }

    let active = true;
    fetch(`/api/games/whot?ownerKey=${encodeURIComponent(address.toLowerCase())}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((result) => {
        if (active) setGameHistory(result.history ?? []);
      })
      .catch(() => {
        if (active) setGameHistory([]);
      });

    return () => {
      active = false;
    };
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <div className="rounded-sharp border border-rule bg-panel px-6 py-12 text-center">
        <p className="m-0 text-base text-quiet">
          Connect a wallet to see the tokens it holds.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-sharp border border-rule bg-panel px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="label m-0">Your identity</p>
            <p className="m-0 mt-2 text-2xl font-semibold tracking-tight">{displayName}</p>
            <p className="m-0 mt-2 font-mono text-sm text-quiet" data-numeric="">
              {shortenAddress(address, { lead: 10, tail: 8 })}
            </p>
          </div>

          <form
            className="flex w-full max-w-sm flex-wrap items-end gap-3 sm:w-auto"
            onSubmit={async (event) => {
              event.preventDefault();
              await saveDisplayName(nameDraft);
            }}
          >
            <label className="flex min-w-48 flex-1 flex-col gap-2">
              <span className="label">Display name</span>
              <input
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                maxLength={24}
                minLength={2}
                placeholder="Your name"
                className="rounded-sharp border border-rule-strong bg-sunken px-3 py-2.5 text-base text-paper outline-none focus:border-gold"
                disabled={loading || saving}
              />
            </label>
            <button
              type="submit"
              disabled={loading || saving || nameDraft.trim().length < 2}
              className="rounded-sharp border border-gold bg-gold px-4 py-2.5 text-base font-semibold text-ink transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving" : "Save name"}
            </button>
          </form>
        </div>
        {error ? <p className="m-0 mt-4 text-sm text-down">{error}</p> : null}
      </div>

      <section className="rounded-sharp border border-rule bg-panel px-6 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label m-0">Whot record</p>
            <h2 className="m-0 mt-2 text-2xl font-semibold tracking-tight">
              Your games
            </h2>
          </div>
          <span className="text-sm text-quiet">{gameHistory.length} finished</span>
        </div>

        <dl className="mt-6 grid gap-4 border-y border-rule py-5 sm:grid-cols-3">
          <div>
            <dt className="label m-0">Games played</dt>
            <dd className="m-0 mt-2 font-mono text-xl text-paper" data-numeric="">
              {gameHistory.length}
            </dd>
          </div>
          <div>
            <dt className="label m-0">Wins</dt>
            <dd className="m-0 mt-2 font-mono text-xl text-gold" data-numeric="">
              {gameHistory.filter((entry) => entry.state?.winner === 0).length}
            </dd>
          </div>
          <div>
            <dt className="label m-0">Tokens staked</dt>
            <dd className="m-0 mt-2 text-base text-quiet">Escrow not live</dd>
          </div>
        </dl>

        {gameHistory.length ? (
          <ul className="m-0 list-none divide-y divide-rule p-0">
            {gameHistory.map((entry) => {
              const won = entry.state?.winner === 0;
              return (
                <li key={entry.gameId} className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div>
                    <p className="m-0 font-semibold">Whot table</p>
                    <p className="m-0 mt-1 font-mono text-sm text-quiet">
                      {new Date(entry.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`m-0 font-semibold ${won ? "text-gold" : "text-quiet"}`}>
                      {won ? "Won" : "Finished"}
                    </p>
                    <p className="m-0 mt-1 text-sm text-quiet">No token escrow</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="m-0 pt-5 text-base text-quiet">
            Finish a Whot hand and your record will appear here.
          </p>
        )}
      </section>


      <div className="border-t border-rule py-12 text-center">
        <p className="m-0 text-base text-quiet">No holdings to show yet.</p>
        <Link
          href="/app"
          className="mt-4 inline-block text-base font-semibold tracking-tight text-brand no-underline hover:underline hover:underline-offset-4"
        >
          Browse the ledger
        </Link>
      </div>
    </div>
  );
}
