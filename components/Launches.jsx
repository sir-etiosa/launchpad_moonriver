import Reveal from "@/components/Reveal";

const toneClasses = {
  purple: "bg-[rgba(138,125,255,0.14)] text-purple",
  cyan: "bg-[rgba(99,230,255,0.14)] text-cyan",
  orange: "bg-[rgba(255,176,103,0.14)] text-orange",
};

const cardClasses =
  "rounded-3xl border border-line bg-panel p-6 shadow-[0_16px_28px_rgba(6,16,24,0.35)] transition duration-[250ms] hover:-translate-y-1 hover:border-[rgba(99,230,255,0.3)] hover:shadow-[0_24px_44px_rgba(4,10,19,0.55)]";

const launches = [
  {
    badge: "IDO",
    tone: "purple",
    status: "Live",
    name: "Nova Drift",
    ticker: "NDX · Liquidity AI",
    body: "AI-powered liquidity orchestration for DeFi-native communities.",
    metrics: ["Raised $1.2M", "Target $1.8M"],
    coin: (
      <svg
        className="h-[50px] w-[50px] shrink-0 drop-shadow-[0_8px_16px_rgba(4,10,19,0.6)]"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="gNova"
            x1="7"
            y1="7"
            x2="37"
            y2="37"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B39DFF" />
            <stop offset="1" stopColor="#8A7DFF" />
          </linearGradient>
        </defs>
        <circle
          cx="22"
          cy="22"
          r="20.6"
          stroke="url(#gNova)"
          strokeOpacity="0.4"
          strokeWidth="1.4"
        />
        <circle
          cx="22"
          cy="22"
          r="17.6"
          fill="#0B1826"
          stroke="url(#gNova)"
          strokeWidth="1.8"
        />
        <path
          d="M22 9.2 26.2 17.9 35 22l-8.8 4.1L22 34.8 17.8 26.1 9 22l8.8-4.1L22 9.2Z"
          fill="url(#gNova)"
        />
      </svg>
    ),
  },
  {
    badge: "IGO",
    tone: "cyan",
    status: "Soon",
    name: "Zenith Grid",
    ticker: "ZGR · Gaming layer",
    body: "Cross-chain gaming utility layer built for composable in-game assets.",
    metrics: ["Whitelist open", "Starts in 4 days"],
    coin: (
      <svg
        className="h-[50px] w-[50px] shrink-0 drop-shadow-[0_8px_16px_rgba(4,10,19,0.6)]"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="gZen"
            x1="7"
            y1="7"
            x2="37"
            y2="37"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8DF0FF" />
            <stop offset="1" stopColor="#63E6FF" />
          </linearGradient>
        </defs>
        <circle
          cx="22"
          cy="22"
          r="20.6"
          stroke="url(#gZen)"
          strokeOpacity="0.4"
          strokeWidth="1.4"
        />
        <circle
          cx="22"
          cy="22"
          r="17.6"
          fill="#0B1826"
          stroke="url(#gZen)"
          strokeWidth="1.8"
        />
        <rect
          x="14.2"
          y="14.2"
          width="15.6"
          height="15.6"
          rx="4"
          stroke="url(#gZen)"
          strokeWidth="2"
        />
        <path
          d="M22 17.8v8.4M17.8 22h8.4"
          stroke="url(#gZen)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    badge: "STO",
    tone: "orange",
    status: "Featured",
    name: "Orbital Labs",
    ticker: "ORB · Research DAO",
    body: "Tokenized research funding and governance for next-gen protocol builders.",
    metrics: ["Tiered access", "7.4k registered"],
    coin: (
      <svg
        className="h-[50px] w-[50px] shrink-0 drop-shadow-[0_8px_16px_rgba(4,10,19,0.6)]"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="gOrb"
            x1="7"
            y1="7"
            x2="37"
            y2="37"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFC58F" />
            <stop offset="1" stopColor="#FFB067" />
          </linearGradient>
        </defs>
        <circle
          cx="22"
          cy="22"
          r="20.6"
          stroke="url(#gOrb)"
          strokeOpacity="0.4"
          strokeWidth="1.4"
        />
        <circle
          cx="22"
          cy="22"
          r="17.6"
          fill="#0B1826"
          stroke="url(#gOrb)"
          strokeWidth="1.8"
        />
        <circle cx="22" cy="22" r="2.8" fill="url(#gOrb)" />
        <ellipse
          cx="22"
          cy="22"
          rx="11.4"
          ry="4.2"
          stroke="url(#gOrb)"
          strokeWidth="1.8"
        />
        <ellipse
          cx="22"
          cy="22"
          rx="11.4"
          ry="4.2"
          stroke="url(#gOrb)"
          strokeWidth="1.8"
          transform="rotate(60 22 22)"
        />
        <ellipse
          cx="22"
          cy="22"
          rx="11.4"
          ry="4.2"
          stroke="url(#gOrb)"
          strokeWidth="1.8"
          transform="rotate(-60 22 22)"
        />
      </svg>
    ),
  },
];

export default function Launches() {
  return (
    <section id="launches" className="pt-[100px]">
      <Reveal className="mb-7">
        <p className="mb-[18px] text-[0.78rem] font-bold tracking-[0.18em] text-cyan">
          LIVE LAUNCHES
        </p>
        <h2 className="m-0 text-[clamp(2rem,3vw,3rem)] tracking-[-0.05em]">
          Featured projects building on Moonriver.fun
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-[22px] min-[980px]:grid-cols-3">
        {launches.map((launch) => (
          <Reveal as="article" key={launch.name} className={cardClasses}>
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-[0.4rem] text-[0.75rem] font-bold tracking-[0.08em] uppercase ${toneClasses[launch.tone]}`}
              >
                {launch.badge}
              </span>
              <span className="text-[0.82rem] font-bold text-green">
                {launch.status}
              </span>
            </div>

            <div className="mb-3.5 flex items-center gap-3.5">
              {launch.coin}
              <div>
                <h3 className="m-0 text-[1.35rem]">{launch.name}</h3>
                <span className="mt-[3px] block text-[0.74rem] tracking-[0.16em] text-[#8fa6b9] uppercase">
                  {launch.ticker}
                </span>
              </div>
            </div>
            <p className="m-0 leading-[1.7] text-muted">{launch.body}</p>
            <div className="mt-5 flex justify-between gap-4 border-t border-line pt-4 text-[0.88rem] text-muted">
              {launch.metrics.map((metric) => (
                <span key={metric}>{metric}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
