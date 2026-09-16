import Reveal from "@/components/Reveal";

const features = [
  {
    tone: "cyan",
    title: "Curated launches",
    body: "Filter high-potential projects through a transparent review framework that highlights quality, onboarding readiness, and long-term value.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="3.4" />
        <circle
          cx="24"
          cy="24"
          r="7"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeOpacity="0.55"
        />
        <circle cx="24" cy="24" r="2.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    tone: "purple",
    title: "Community sync",
    body: "Convert holders into loyal participants through reward loops, milestone checkpoints, and transparent governance participation.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="15.5" cy="15.5" r="5.6" stroke="currentColor" strokeWidth="3.2" />
        <path
          d="M6.5 33.5c0-5.6 4-9.2 9-9.2s9 3.6 9 9.2"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="33.5" cy="17" r="3.9" stroke="currentColor" strokeWidth="2.8" />
        <path
          d="M28.5 33.5c.4-3.6 2.1-5.7 4.6-5.7 2.6 0 5.6 2.5 5.6 5.7"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    tone: "orange",
    title: "Secure allocation",
    body: "Empower projects with flexible allocation models and verifiable on-chain mechanics built for fair and resilient distribution.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 6.5 37 11.8v9.6c0 8.6-5.4 15.6-13 18.6-7.6-3-13-10-13-18.6v-9.6L24 6.5Z"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          d="m17.5 23 4.6 4.6 8.9-9.2"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const toneClasses = {
  cyan: "bg-[rgba(99,230,255,0.14)] text-cyan",
  purple: "bg-[rgba(138,125,255,0.14)] text-purple",
  orange: "bg-[rgba(255,176,103,0.14)] text-orange",
};

const cardClasses =
  "rounded-3xl border border-line bg-panel p-7 shadow-[0_16px_28px_rgba(6,16,24,0.35)] transition duration-[250ms] hover:-translate-y-1 hover:border-[rgba(99,230,255,0.3)] hover:shadow-[0_24px_44px_rgba(4,10,19,0.55)]";

export default function Features() {
  return (
    <section id="features" className="pt-[100px]">
      <Reveal className="mb-7">
        <p className="mb-[18px] text-[0.78rem] font-bold tracking-[0.18em] text-cyan">
          PLATFORM FEATURES
        </p>
        <h2 className="m-0 text-[clamp(2rem,3vw,3rem)] tracking-[-0.05em]">
          Everything needed to launch with confidence
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-[22px] min-[980px]:grid-cols-3">
        {features.map((feature) => (
          <Reveal as="article" key={feature.title} className={cardClasses}>
            <div
              className={`mb-[18px] inline-flex h-[58px] w-[58px] items-center justify-center rounded-[18px] font-extrabold ${toneClasses[feature.tone]}`}
            >
              {feature.icon}
            </div>
            <h3 className="mb-3 text-[1.4rem]">{feature.title}</h3>
            <p className="m-0 leading-[1.7] text-muted">{feature.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
