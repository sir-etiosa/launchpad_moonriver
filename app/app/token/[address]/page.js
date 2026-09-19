import Link from "next/link";
import { notFound } from "next/navigation";

import CurveProgress from "@/components/dapp/CurveProgress";
import OneToOnePanel from "@/components/dapp/OneToOnePanel";
import TradePanel from "@/components/dapp/TradePanel";
import { explorerAddressUrl } from "@/lib/arc";
import { formatNativeUsdc, shortenAddress } from "@/lib/format";
import { findPlaceholderLaunch } from "@/lib/placeholderLaunches";

export async function generateMetadata({ params }) {
  const { address } = await params;
  const token = findPlaceholderLaunch(address);
  return { title: token ? `${token.name} (${token.symbol})` : "Token" };
}

function Tag({ children, tone = "quiet" }) {
  const tones = {
    quiet: "border-rule text-quiet",
    gold: "border-gold/35 text-gold",
    brand: "border-brand/35 text-brand",
  };
  return (
    <span
      className={`rounded-sharp border px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.12em] uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export default async function TokenPage({ params }) {
  const { address } = await params;
  const token = findPlaceholderLaunch(address);

  if (!token) notFound();

  const raised = BigInt(token.raised);
  const cap = BigInt(token.threshold);
  const oneToOne = Boolean(token.oneToOneEnabled) && !token.graduated;

  const facts = [
    ["Raised", `${formatNativeUsdc(raised, { maxFractionDigits: 1 })} USDC`],
    ["Cap", `${formatNativeUsdc(cap, { maxFractionDigits: 0 })} USDC`],
    ["Creator", shortenAddress(token.creator)],
  ];

  return (
    <div className="space-y-9 pt-8">
      <Link
        href="/app"
        className="label no-underline transition-colors duration-150 hover:text-paper"
      >
        ← Ledger
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {token.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={token.image}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-sharp border border-rule object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sharp border border-rule font-mono text-base text-brand">
              {token.symbol.slice(0, 3)}
            </span>
          )}
          <div>
            <h1 className="m-0 text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em]">
              {token.name}
            </h1>
            <span className="font-mono text-sm tracking-[0.14em] text-faint uppercase">
              {token.symbol}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tag tone={token.graduated ? "gold" : "quiet"}>
            {token.graduated ? "Graduated" : "On curve"}
          </Tag>
          {oneToOne ? <Tag tone="brand">1:1 enabled</Tag> : null}
        </div>
      </header>


      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <div className="space-y-8">
          <section className="rounded-sharp border border-rule bg-panel p-6">
            <CurveProgress raised={raised} threshold={cap} />

            <dl className="mt-7 font-mono text-base">
              {facts.map(([label, value], index) => (
                <div
                  key={label}
                  className={`flex items-baseline justify-between py-3 ${
                    index === 0 ? "" : "border-t border-rule"
                  }`}
                >
                  <dt className="font-sans text-quiet">{label}</dt>
                  <dd className="m-0 text-paper" data-numeric="">
                    {label === "Creator" ? (
                      <a
                        href={explorerAddressUrl(token.creator)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand no-underline hover:underline hover:underline-offset-4"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border-t border-rule pt-6">
            <h2 className="label m-0">About</h2>
            <p className="mt-4 mb-0 max-w-[62ch] text-base leading-[1.75] text-quiet">
              {token.description}
            </p>
          </section>

          <section className="border-t border-rule pt-6">
            <h2 className="label m-0">Contract</h2>
            <a
              href={explorerAddressUrl(token.address)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block font-mono text-sm break-all text-brand no-underline hover:underline"
            >
              {token.address}
            </a>
          </section>
        </div>

        <div className="space-y-8">
          <TradePanel token={token} />
          <OneToOnePanel token={token} />
        </div>
      </div>
    </div>
  );
}
