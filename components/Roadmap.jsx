import Reveal from "@/components/Reveal";

const phases = [
  {
    step: "01",
    title: "Launch Essentials",
    body: "Token sales, investor dashboards, and KYB-backed project onboarding.",
  },
  {
    step: "02",
    title: "Growth Engine",
    body: "Automated community rewards, referral loops, and milestone-based unlocks.",
  },
  {
    step: "03",
    title: "Cross-Chain Expansion",
    body: "Multi-chain deployment, stronger analytics, and deeper interoperability.",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="pt-[100px]">
      <Reveal className="mb-7">
        <p className="mb-[18px] text-[0.78rem] font-bold tracking-[0.18em] text-cyan">
          ROADMAP
        </p>
        <h2 className="m-0 text-[clamp(2rem,3vw,3rem)] tracking-[-0.05em]">
          Building the launchpad infrastructure in phases
        </h2>
      </Reveal>

      <Reveal className="grid gap-5">
        {phases.map((phase) => (
          <div
            key={phase.step}
            className="flex items-start gap-[18px] rounded-3xl border border-line bg-panel p-6 shadow-[0_16px_28px_rgba(6,16,24,0.35)]"
          >
            <span className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[rgba(160,198,220,0.12)] bg-linear-to-br from-[rgba(138,125,255,0.2)] to-[rgba(99,230,255,0.2)] font-extrabold text-cyan">
              {phase.step}
            </span>
            <div>
              <h3 className="mb-3 text-[1.4rem]">{phase.title}</h3>
              <p className="m-0 leading-[1.7] text-muted">{phase.body}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
