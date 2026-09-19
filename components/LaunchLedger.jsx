import Link from "next/link";

import { fillRatio, formatNativeUsdc } from "@/lib/format";

const cell = "py-5 text-left align-middle max-md:block max-md:py-0.5 max-md:text-base";

function MobileLabel({ children }) {
  return <span className="label mr-3 hidden max-md:inline">{children}</span>;
}

/**
 * A token's mark. Uses the real image when the launch carries one, and falls back to the
 * symbol so a row is never a blank gap.
 *
 * Plain <img> rather than next/image: these URLs come from token metadata at runtime, so
 * Next's optimiser would need every possible host allow-listed up front.
 */
function TokenMark({ token }) {
  if (token.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={token.image}
        alt=""
        width={44}
        height={44}
        loading="lazy"
        className="h-11 w-11 shrink-0 rounded-lg border border-rule object-cover"
      />
    );
  }

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-rule bg-raised font-mono text-xs font-semibold text-brand">
      {token.symbol.slice(0, 3)}
    </span>
  );
}

/**
 * The launch ledger. Shared by the marketing page and the dapp so the two surfaces
 * cannot drift apart. Reads as a real table (scope, caption, thead) and collapses to
 * stacked rows below md rather than dropping columns.
 */
export default function LaunchLedger({
  tokens,
  hrefFor = (token) => `/app/token/${token.address}`,
}) {
  return (
    <table className="w-full border-collapse max-md:block">
      <caption className="sr-only">
        Tokens launched on Moonriver.fun, their category, stage, curve fill and 1:1
        status
      </caption>

      <thead className="max-md:hidden">
        <tr className="border-y border-rule-strong">
          <th scope="col" className="label py-3.5 text-left font-medium">
            Token
          </th>
          <th scope="col" className="label py-3.5 text-left font-medium">
            Kind
          </th>
          <th scope="col" className="label py-3.5 text-left font-medium">
            Stage
          </th>
          <th scope="col" className="label py-3.5 text-right font-medium">
            Raised
          </th>
          <th scope="col" className="label py-3.5 text-right font-medium">
            Cap
          </th>
          <th scope="col" className="label py-3.5 text-right font-medium">
            Fill
          </th>
          <th scope="col" className="label py-3.5 text-right font-medium">
            1:1
          </th>
        </tr>
      </thead>

      <tbody className="max-md:block">
        {tokens.map((token) => {
          const raised = BigInt(token.raised);
          const cap = BigInt(token.threshold);
          const ratio = fillRatio(token.raised, token.threshold);
          const graduated = Boolean(token.graduated);
          const oneToOne = Boolean(token.oneToOneEnabled) && !graduated;
          const isLaunchpad = token.kind === "launchpad";

          return (
            <tr
              key={token.address}
              className="border-b border-rule transition-colors duration-150 hover:bg-white/[0.02] max-md:block max-md:py-5"
            >
              <th
                scope="row"
                className={`${cell} font-medium max-md:mb-1 max-md:pb-2`}
              >
                <Link
                  href={hrefFor(token)}
                  className="group inline-flex items-center gap-3 no-underline"
                >
                  <TokenMark token={token} />
                  <span className="inline-flex items-baseline gap-3">
                    <span className="text-lg font-semibold tracking-tight text-paper group-hover:text-brand">
                      {token.name}
                    </span>
                    <span className="font-mono text-sm tracking-[0.12em] text-faint uppercase">
                      {token.symbol}
                    </span>
                  </span>
                </Link>
              </th>

              <td className={cell}>
                <MobileLabel>Kind</MobileLabel>
                <span
                  className={`font-mono text-sm tracking-[0.1em] uppercase ${
                    isLaunchpad ? "text-brand" : "text-quiet"
                  }`}
                >
                  {isLaunchpad ? "Launchpad" : "Meme"}
                </span>
              </td>

              <td className={cell}>
                <MobileLabel>Stage</MobileLabel>
                <span
                  className={`font-mono text-sm tracking-[0.1em] uppercase ${
                    graduated ? "text-gold" : "text-quiet"
                  }`}
                >
                  {graduated ? "Graduated" : "On curve"}
                </span>
              </td>

              <td className={`${cell} font-mono max-md:text-right`} data-numeric="">
                <MobileLabel>Raised</MobileLabel>
                <span className="max-md:float-right">
                  {formatNativeUsdc(raised, { maxFractionDigits: 1 })}
                </span>
              </td>

              <td className={`${cell} font-mono max-md:text-right`} data-numeric="">
                <MobileLabel>Cap</MobileLabel>
                <span className="max-md:float-right">
                  {formatNativeUsdc(cap, { maxFractionDigits: 0 })}
                </span>
              </td>

              <td className={`${cell} max-md:mt-2`} data-numeric="">
                <MobileLabel>Fill</MobileLabel>
                <span className="inline-flex items-center gap-3.5 max-md:w-full">
                  <span className="h-1 w-24 shrink-0 bg-raised max-md:flex-1">
                    <span
                      className={`block h-full ${graduated ? "bg-gold" : "bg-brand"}`}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </span>
                  <span className="font-mono text-sm text-quiet">
                    {(ratio * 100).toFixed(0)}%
                  </span>
                </span>
              </td>

              <td className={`${cell} text-right max-md:text-left`}>
                <MobileLabel>1:1</MobileLabel>
                {oneToOne ? (
                  <span className="font-mono text-sm tracking-[0.1em] text-brand uppercase">
                    Enabled
                  </span>
                ) : (
                  <span className="font-mono text-sm text-faint">—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
