"use client";

import { usePathname, useRouter } from "next/navigation";

import { LAUNCH_KINDS, LAUNCH_SORTS } from "@/lib/launches";

/**
 * Filter and sort controls only. The current values arrive as props from the server
 * render, so this never needs `useSearchParams` — which means the ledger rows are
 * always in the server HTML instead of behind a suspense fallback.
 */
export default function LedgerControls({ kind, sort, count }) {
  const router = useRouter();
  const pathname = usePathname();

  function setParam(key, value) {
    const next = new URLSearchParams({ kind, sort });
    next.set(key, value);
    // replace, not push: filtering should not fill the back button with noise.
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-rule pb-4">
      <div role="group" aria-label="Filter by category" className="flex items-center gap-1.5">
        {LAUNCH_KINDS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={kind === option.value}
            onClick={() => setParam("kind", option.value)}
            className={`rounded-full border px-4 py-2 font-mono text-sm tracking-[0.12em] uppercase transition-colors duration-150 ${
              kind === option.value
                ? "border-brand bg-brand text-ink"
                : "border-rule text-quiet hover:border-rule-strong hover:text-paper"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="font-mono text-sm text-faint" data-numeric="">
          {count} shown
        </span>

        {/*
          Buttons rather than a <select>: the native control draws its own chrome, which
          ignores the border radius on Windows, and its option list cannot be styled at
          all. These match the category filters exactly.
        */}
        <div role="group" aria-label="Sort by" className="flex items-center gap-1.5">
          {LAUNCH_SORTS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={sort === option.value}
              onClick={() => setParam("sort", option.value)}
              className={`cursor-pointer rounded-full border px-4 py-2 font-mono text-sm tracking-[0.12em] uppercase transition-colors duration-150 ${
                sort === option.value
                  ? "border-brand bg-brand text-ink"
                  : "border-rule text-quiet hover:border-rule-strong hover:text-paper"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
