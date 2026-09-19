import Reveal from "@/components/Reveal";

const faqs = [
  {
    question: "What is MVR?",
    answer:
      "Moonriver's own token, and the second currency the platform takes. It sits beside the USDC already in your wallet rather than replacing it: buy into a launch, stake a seat at a Whot table, or cover a launchpad subscription in either one.",
    open: true,
  },
  {
    question: "How does a launch work?",
    answer:
      "Your token opens on a bonding curve quoted in MVR. The curve sets the price, so there is no application, no listing review, and no market maker to negotiate with.",
  },
  {
    question: "What happens at graduation?",
    answer:
      "Once the curve reaches 5,000 MVR the token leaves it for Uniswap. The MVR raised seeds the pool, the curve closes, and 1:1 trading stops.",
  },
  {
    question: "How does 1:1 trading work?",
    answer:
      "A creator ticks the box at launch. While the token is still on its curve it swaps unit for unit against other opted-in tokens. The flag cannot be added afterwards.",
  },
  {
    question: "How do the staked games settle?",
    answer:
      "Stakes go into MVR escrow before the first card. When the game ends, the result is signed and settled on-chain in one transaction: winner takes the pot, second place keeps their stake, and the house takes one percent of the winner's share.",
  },
  {
    question: "Do I need ETH for gas?",
    answer:
      "No. Arc pays gas in USDC, so one balance covers your fees and your position.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="border-t border-rule py-20 md:py-28">
      <Reveal>
        <p className="label m-0">Questions</p>
        <h2 className="mt-5 mb-0 text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
          What people ask first
        </h2>
      </Reveal>

      <div className="mt-14 max-w-[70ch]">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            open={faq.open}
            className="group border-t border-rule last:border-b"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-xl font-medium tracking-tight [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-2xl leading-none text-gold transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-0 mb-7 max-w-[66ch] text-base leading-[1.75] text-quiet">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
