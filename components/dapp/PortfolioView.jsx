"use client";

import Link from "next/link";
import { useAccount } from "wagmi";

import { shortenAddress } from "@/lib/format";

export default function PortfolioView() {
  const { address, isConnected } = useAccount();

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
      <div className="rounded-sharp border border-rule bg-panel px-5 py-4">
        <p className="label m-0">Connected</p>
        <p className="m-0 mt-2 font-mono text-base" data-numeric="">
          {shortenAddress(address, { lead: 10, tail: 8 })}
        </p>
      </div>


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
