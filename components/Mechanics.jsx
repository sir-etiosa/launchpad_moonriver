import Reveal from "@/components/Reveal";

const mechanics = [
  {
    step: "01",
    title: "Bonding curve",
    body: "Every token opens on a curve quoted in MVR. Price steps up with each buy until it graduates.",
  },
  {
    step: "02",
    title: "1:1 while young",
    body: "Opt in at launch. While it is ungraduated, the token swaps unit for unit with every other opted-in token — straight across, no curve in the middle.",
  },
  { step: "03", title: "Graduate at 5,000 MVR", body: "The curve closes and the pool opens." },
];

export default function Mechanics() {
  return (
    <section id="mechanics" className="border-t border-rule py-20 md:py-28">
      <Reveal>
        <p className="label m-0">How a launch works</p>
        <h2 className="mt-5 mb-0 max-w-[24ch] text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
          Three rules
        </h2>
      </Reveal>

      <dl className="mt-14 grid grid-cols-1 gap-px md:grid-cols-3">
        {mechanics.map((item) => (
          <Reveal
            key={item.step}
            className="border-t border-rule pt-7 md:border-t-0 md:pr-10 md:odd:border-t md:odd:border-rule"
          >
            <dt className="flex items-baseline gap-4">
              <span className="font-mono text-base text-gold" data-numeric="">
                {item.step}
              </span>
              <span className="text-xl font-semibold tracking-tight">
                {item.title}
              </span>
            </dt>
            <dd className="m-0 mt-3 max-w-[36ch] text-base leading-[1.6] text-quiet">
              {item.body}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
