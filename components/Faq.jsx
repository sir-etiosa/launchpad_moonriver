import Reveal from "@/components/Reveal";

const faqs = [
  {
    question: "Who can apply to launch?",
    answer:
      "Projects with strong tokenomics, a clear roadmap, and a verified community can apply.",
    open: true,
  },
  {
    question: "Does this support multiple chains?",
    answer:
      "Yes. The platform is designed to expand across ecosystems while staying community-first.",
  },
  {
    question: "Can I customize my launch page?",
    answer:
      "Absolutely. Teams can tailor branding, staking mechanics, and investor messaging.",
  },
];

export default function Faq() {
  return (
    <Reveal id="faq" className="pt-[100px]">
      <div className="mb-7">
        <p className="mb-[18px] text-[0.78rem] font-bold tracking-[0.18em] text-cyan">
          FAQ
        </p>
        <h2 className="m-0 text-[clamp(2rem,3vw,3rem)] tracking-[-0.05em]">
          Questions teams usually ask
        </h2>
      </div>

      <div className="grid gap-[18px]">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            open={faq.open}
            className="group rounded-3xl border border-line bg-panel px-[22px] py-5 shadow-[0_16px_28px_rgba(6,16,24,0.35)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span className="h-[9px] w-[9px] shrink-0 rotate-[45deg] border-r-2 border-b-2 border-muted transition duration-[250ms] group-open:-rotate-[135deg] group-open:border-cyan" />
            </summary>
            <p className="mt-3 leading-[1.7] text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </Reveal>
  );
}
