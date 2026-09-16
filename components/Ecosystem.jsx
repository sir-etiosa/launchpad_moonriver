import Reveal from "@/components/Reveal";

const cardClasses =
  "rounded-3xl border border-line bg-panel p-7 shadow-[0_16px_28px_rgba(6,16,24,0.35)]";

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="pt-[100px]">
      <Reveal className="mb-7">
        <p className="mb-[18px] text-[0.78rem] font-bold tracking-[0.18em] text-cyan">
          ECOSYSTEM
        </p>
        <h2 className="m-0 text-[clamp(2rem,3vw,3rem)] tracking-[-0.05em]">
          Designed for rapid growth across the Web3 stack
        </h2>
      </Reveal>

      <Reveal className="grid grid-cols-1 gap-6 min-[980px]:grid-cols-2">
        <div className={cardClasses}>
          <h3 className="mb-3 text-[1.4rem]">Investor onboarding</h3>
          <ul className="m-0 grid list-disc gap-3 pl-[18px] leading-[1.7] text-muted">
            <li>Smart whitelisting and eligibility checks</li>
            <li>Tiered KYC and anti-bot protection</li>
            <li>Seamless wallet connection and claim flows</li>
          </ul>
        </div>

        <div
          className={`${cardClasses} bg-linear-to-b from-[rgba(18,34,49,0.95)] to-[rgba(21,21,42,0.9)]`}
        >
          <h3 className="mb-3 text-[1.4rem]">Project analytics</h3>
          <ul className="m-0 grid list-disc gap-3 pl-[18px] leading-[1.7] text-muted">
            <li>Live campaign dashboards and conversion insights</li>
            <li>Retention and reward engagement reports</li>
            <li>Governance-ready treasury visibility</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
