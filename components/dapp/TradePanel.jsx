"use client";

import { useState } from "react";

import { formatNativeUsdc } from "@/lib/format";

const field =
  "w-full rounded-sharp border border-rule bg-sunken px-4 py-3 text-base text-paper transition-colors duration-150 outline-none placeholder:text-faint focus:border-rule-strong";

export default function TradePanel({ token }) {
  const [side, setSide] = useState("buy");
  const [amount, setAmount] = useState("");

  const isBuy = side === "buy";

  return (
    <section className="rounded-sharp border border-rule bg-panel">
      <h2 className="label m-0 border-b border-rule px-5 py-3">Trade</h2>

      <div className="p-5">
        <div className="grid grid-cols-2 overflow-hidden rounded-sharp border border-rule">
          {["buy", "sell"].map((option, index) => (
            <button
              key={option}
              type="button"
              aria-pressed={side === option}
              onClick={() => setSide(option)}
              className={`px-4 py-2.5 text-base font-semibold capitalize transition-colors duration-150 ${
                index === 1 ? "border-l border-rule" : ""
              } ${
                side === option
                  ? option === "buy"
                    ? "bg-gold text-ink"
                    : "bg-down text-ink"
                  : "bg-transparent text-quiet hover:text-paper"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <label
            className="label mb-2 block"
            htmlFor="trade-amount"
          >
            {isBuy ? "You pay (USDC)" : `You sell (${token.symbol})`}
          </label>
          <input
            id="trade-amount"
            className={field}
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <dl className="mt-6 font-mono text-base">
          {[
            ["Curve price", "—"],
            [isBuy ? `You receive (${token.symbol})` : "You receive (USDC)", "—"],
            [
              "Raised so far",
              `${formatNativeUsdc(BigInt(token.raised), { maxFractionDigits: 2 })} USDC`,
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between border-b border-rule py-2.5 last:border-b-0"
            >
              <dt className="font-sans text-quiet">{label}</dt>
              <dd className="m-0 text-paper" data-numeric="">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          disabled
          className="mt-5 w-full cursor-not-allowed rounded-sharp border border-rule bg-transparent px-6 py-3 text-base font-semibold text-faint"
        >
          {isBuy ? "Buy" : "Sell"}
        </button>

      </div>
    </section>
  );
}
