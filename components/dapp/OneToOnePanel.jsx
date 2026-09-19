"use client";

import { useState } from "react";


const field =
  "w-full rounded-sharp border border-rule bg-sunken px-4 py-3 text-base text-paper transition-colors duration-150 outline-none placeholder:text-faint focus:border-rule-strong";

/**
 * 1:1 is a shared pool: any two opted-in, ungraduated tokens swap flat 1:1 by unit
 * count. Flat pricing gives the pool no defence against a holder of the cheaper token
 * draining the valuable side, so OneToOneSwap.sol must cap both the per-swap output and
 * the cumulative amount a single token can draw.
 */
export default function OneToOnePanel({ token }) {
  const [amount, setAmount] = useState("");

  if (!token.oneToOneEnabled || token.graduated) return null;

  return (
    <section className="rounded-sharp border border-rule bg-panel">
      <div className="flex items-center justify-between border-b border-rule px-5 py-3">
        <h2 className="label m-0">Trade 1:1</h2>
        <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand uppercase">
          Enabled
        </span>
      </div>

      <div className="p-5">
        <p className="m-0 max-w-[46ch] text-base leading-[1.7] text-quiet">
          {token.symbol} has not bonded yet, so it swaps unit for unit against any other
          opted-in token still on its curve. One {token.symbol} for one of theirs.
        </p>

        <div className="mt-5">
          <label className="label mb-2 block" htmlFor="one-to-one-amount">
            Amount ({token.symbol})
          </label>
          <input
            id="one-to-one-amount"
            className={field}
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="mt-4 flex items-center justify-between border-b border-rule py-2.5 font-mono text-base">
          <span className="font-sans text-quiet">Swap to</span>
          <span className="text-faint">Select token</span>
        </div>

        <button
          type="button"
          disabled
          className="mt-5 w-full cursor-not-allowed rounded-sharp border border-rule bg-transparent px-6 py-3 text-base font-semibold text-faint"
        >
          Swap 1:1
        </button>

      </div>
    </section>
  );
}
