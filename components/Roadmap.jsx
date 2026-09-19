import Reveal from "@/components/Reveal";

const phases = [
  { step: "01", title: "Launchpad", status: "Ready" },
  { step: "02", title: "Spot trading", status: "In build" },
  { step: "03", title: "Games", status: "In build" },
  { step: "04", title: "Futures trading", status: "Coming" },
];

/** Each status gets an obvious tone, so the column reads at a glance. */
const TONES = {
  Ready: "text-live",
  "In build": "text-gold",
  Coming: "text-faint",
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="border-t border-rule py-20 md:py-28">
      <Reveal>
        <p className="label m-0">Roadmap</p>
        <h2 className="mt-5 mb-0 text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
          In phases, in order
        </h2>
      </Reveal>

      <ol className="mt-14 mb-0 list-none p-0">
        {phases.map((phase) => (
          <Reveal
            as="li"
            key={phase.step}
            className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-rule py-7"
          >
            <div className="flex items-baseline gap-6">
              <span className="font-mono text-base text-gold" data-numeric="">
                {phase.step}
              </span>
              <h3 className="m-0 text-xl font-semibold tracking-tight">
                {phase.title}
              </h3>
            </div>
            <span
              className={`font-mono text-sm tracking-[0.12em] uppercase ${
                TONES[phase.status] ?? "text-faint"
              }`}
            >
              {phase.status}
            </span>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
