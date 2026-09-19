import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

/**
 * The four products, in the order they are actually being built. The status column is
 * deliberately blunt: none of this is on mainnet, and saying so is cheaper than a
 * support ticket.
 */
const board = [
  { name: "Swap", detail: "MVR and USDC routes", status: "In build" },
  { name: "Futures", detail: "Powered by Circle", status: "Coming soon" },
  { name: "Launchpad", detail: "Graduates at 5,000 MVR", status: "In build" },
  { name: "Games", detail: "Whot, then chess and ludo", status: "In build" },
];

const facts = [{ value: "5,000", unit: "MVR", label: "to graduate" }];

export default function Hero() {
  return (
    <section id="top" className="grid gap-16 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
      <Reveal>
        <p className="label m-0">Built on Arc</p>

        <h1 className="mt-6 mb-0 max-w-[15ch] text-[clamp(2.9rem,5.8vw,4.8rem)] leading-[1.0] font-semibold tracking-[-0.04em] text-balance">
          Swap, launch, and play.{" "}
          <span className="text-gold">All in MVR.</span>
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Button as="a" href="/app" variant="primary">
            Open the app
          </Button>
          <a
            href="#launchpad"
            className="text-base font-semibold tracking-tight text-quiet underline decoration-rule-strong underline-offset-[6px] transition-colors duration-150 hover:text-paper hover:decoration-paper/50"
          >
            See the ledger
          </a>
        </div>

        <dl className="mt-14 grid grid-cols-1 gap-px border-t border-rule sm:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border-b border-rule pt-6 pb-6 sm:border-b-0 sm:pr-6"
            >
              <dt className="label m-0">{fact.label}</dt>
              <dd
                className="m-0 mt-2.5 font-mono text-3xl tracking-tight"
                data-numeric=""
              >
                {fact.value}
                <span className="ml-2 text-base text-quiet">{fact.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="lg:pt-3">
        <div className="rounded-sharp border border-rule bg-panel">
          <div className="flex items-center justify-between border-b border-rule px-6 py-4">
            <span className="label">Platform</span>
            <span className="label text-faint">Arc testnet</span>
          </div>

          <dl className="divide-y divide-rule">
            {board.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline justify-between gap-5 px-6 py-5"
              >
                <dt className="m-0">
                  <span className="block text-lg font-semibold tracking-tight">
                    {item.name}
                  </span>
                  <span className="mt-1 block text-sm text-quiet">{item.detail}</span>
                </dt>
                <dd
                  className={`m-0 shrink-0 font-mono text-sm tracking-[0.12em] uppercase ${
                    item.status === "Coming soon" ? "text-faint" : "text-gold"
                  }`}
                >
                  {item.status}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
