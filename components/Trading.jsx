import Reveal from "@/components/Reveal";

const surfaces = [
  {
    id: "swap",
    name: "Swap",
    status: "In build",
    facts: [
      ["Pairs", "MVR / USDC"],
      ["Routing", "Quoted up front"],
    ],
  },
  {
    id: "futures",
    name: "Futures",
    status: "Coming soon",
    facts: [
      ["Direction", "Long / short"],
      ["Engine", "Circle"],
      ["Blocked on", "Circle docs"],
    ],
  },
];

export default function Trading() {
  return (
    <section className="border-t border-rule py-20 md:py-28">
      <Reveal>
        <p className="label m-0">Trading</p>
        <h2 className="mt-5 mb-0 max-w-[24ch] text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
          Two more ways in
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-x-16 gap-y-14 md:grid-cols-2">
        {surfaces.map((surface) => (
          <Reveal key={surface.id} id={surface.id}>
            <div className="flex items-baseline justify-between gap-4 border-b border-rule-strong pb-3.5">
              <h3 className="m-0 text-2xl font-semibold tracking-tight">
                {surface.name}
              </h3>
              <span
                className={`font-mono text-sm tracking-[0.12em] uppercase ${
                  surface.status === "Coming soon" ? "text-faint" : "text-gold"
                }`}
              >
                {surface.status}
              </span>
            </div>

            <dl className="mt-2">
              {surface.facts.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between border-b border-rule py-3.5 text-base"
                >
                  <dt className="text-quiet">{label}</dt>
                  <dd className="m-0 font-mono text-paper" data-numeric="">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
