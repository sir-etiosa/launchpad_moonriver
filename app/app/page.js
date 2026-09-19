import Link from "next/link";

import LaunchLedger from "@/components/LaunchLedger";
import LedgerControls from "@/components/dapp/LedgerControls";
import {
  kindLabel,
  normalizeKind,
  normalizeSort,
  selectLaunches,
} from "@/lib/launches";
import { placeholderLaunches } from "@/lib/placeholderLaunches";

export default async function DiscoverPage({ searchParams }) {
  const params = await searchParams;
  const kind = normalizeKind(params?.kind);
  const sort = normalizeSort(params?.sort);
  const tokens = selectLaunches(placeholderLaunches, kind, sort);

  return (
    <div className="space-y-10 pt-8">
      <header>
        {/*
          A status chip, not a control. Nothing here is clickable until there is more
          than one chain, so it is a span rather than a disabled button — a disabled
          button advertises a control you cannot use.
        */}
        <span className="inline-flex items-center gap-2.5 font-mono text-sm font-semibold tracking-[0.1em] text-live uppercase">
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live shadow-[0_0_6px_2px_rgba(78,217,164,0.55)]" />
          </span>
          Arc
          <span className="text-quiet">Testnet</span>
        </span>

        <h1 className="mt-6 mb-0 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
          Launch ledger
        </h1>
      </header>

      <div>
        <LedgerControls kind={kind} sort={sort} count={tokens.length} />

        {tokens.length === 0 ? (
          <div className="border-b border-rule py-20 text-center">
            <p className="m-0 text-base text-quiet">
              No {kindLabel(kind)} on the ledger yet.
            </p>
            <Link
              href="/app/launch"
              className="mt-4 inline-block text-base font-semibold tracking-tight text-brand no-underline hover:underline hover:underline-offset-4"
            >
              Create the first one
            </Link>
          </div>
        ) : (
          <LaunchLedger tokens={tokens} />
        )}
      </div>
    </div>
  );
}
