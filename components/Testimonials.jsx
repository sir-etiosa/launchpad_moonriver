import Reveal from "@/components/Reveal";

const quotes = [
  {
    body: "Moonriver.fun gave our team a launch experience that felt premium, transparent, and investor-ready from day one.",
    author: "Ada Chen, Founder, Nova Drift",
  },
  {
    body: "The platform balance between governance, community, and operational visibility made our token rollout feel professional.",
    author: "Lio Mendes, Product Lead, Beacon Labs",
  },
];

export default function Testimonials() {
  return (
    <section className="pt-[100px]">
      <Reveal className="mb-7">
        <p className="mb-[18px] text-[0.78rem] font-bold tracking-[0.18em] text-cyan">
          COMMUNITY
        </p>
        <h2 className="m-0 text-[clamp(2rem,3vw,3rem)] tracking-[-0.05em]">
          Builders love the clarity and speed
        </h2>
      </Reveal>

      <Reveal className="grid grid-cols-1 gap-[22px] min-[980px]:grid-cols-2">
        {quotes.map((quote) => (
          <blockquote
            key={quote.author}
            className="rounded-3xl border border-line bg-panel p-[26px] text-[1.05rem] leading-[1.7] text-muted shadow-[0_16px_28px_rgba(6,16,24,0.35)]"
          >
            {`“${quote.body}”`}
            <footer className="mt-3.5 font-bold text-ink">
              — {quote.author}
            </footer>
          </blockquote>
        ))}
      </Reveal>
    </section>
  );
}
