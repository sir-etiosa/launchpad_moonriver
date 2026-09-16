import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

const metrics = [
  { value: "12.8M", label: "TVL across launches" },
  { value: "240k", label: "Verified community members" },
  { value: "96%", label: "Retention after launch" },
];

const chartBars = ["36%", "56%", "52%", "68%", "76%", "92%"];

export default function Hero() {
  return (
    <section className="grid min-h-auto grid-cols-1 items-center gap-9 pt-8 pb-8 min-[980px]:min-h-[760px] min-[980px]:grid-cols-[1.15fr_1fr] min-[980px]:pt-[58px]">
      <Reveal className="order-1">
        <p className="mb-[18px] text-[0.78rem] font-bold tracking-[0.18em] text-cyan">
          LAUNCHPAD ON ARC
        </p>
        <h1 className="m-0 max-w-[680px] text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.95] tracking-[-0.06em]">
          Build momentum for the next wave of{" "}
          <span className="bg-[linear-gradient(92deg,#63e6ff_10%,#8a7dff_90%)] bg-clip-text text-transparent">
            on-chain upside.
          </span>
        </h1>
        <p className="mt-6 max-w-[640px] text-[1.08rem] leading-[1.7] text-muted">
          Moonriver.fun helps promising communities launch, scale, and grow on the
          Arc testnet — with transparent token mechanics, curated onboarding, and
          rewards that actually make users money.
        </p>

        <div className="my-8 flex flex-wrap items-center gap-3.5">
          <Button href="#launches" variant="primary">
            Explore Launches
          </Button>
          <Button href="#features" variant="secondary">
            See Platform
          </Button>
        </div>

        <ul className="mt-[34px] grid list-none grid-cols-1 gap-3.5 p-0 min-[640px]:grid-cols-3">
          {metrics.map((metric) => (
            <li
              key={metric.label}
              className="rounded-[18px] border border-line bg-[rgba(16,31,44,0.84)] px-[18px] pt-[18px] pb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <strong className="mb-2 block text-[1.45rem]">{metric.value}</strong>
              <span className="text-[0.9rem] text-muted">{metric.label}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="relative order-2 block min-h-[560px] min-[980px]:flex min-[980px]:items-center min-[980px]:justify-center">
        <svg
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 aspect-square w-full max-w-[620px] -translate-x-1/2 -translate-y-1/2"
          viewBox="0 0 620 620"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="ringGrad"
              x1="60"
              y1="60"
              x2="560"
              y2="560"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#63E6FF" />
              <stop offset="1" stopColor="#8A7DFF" />
            </linearGradient>
          </defs>
          <circle
            cx="310"
            cy="310"
            r="282"
            stroke="url(#ringGrad)"
            strokeWidth="1.4"
            strokeOpacity="0.4"
            strokeDasharray="2 10"
          />
          <circle
            cx="310"
            cy="310"
            r="216"
            stroke="url(#ringGrad)"
            strokeWidth="1.2"
            strokeOpacity="0.3"
            strokeDasharray="1 7"
          />
          <circle
            cx="310"
            cy="310"
            r="150"
            stroke="url(#ringGrad)"
            strokeWidth="1"
            strokeOpacity="0.16"
          />
          <g className="orbit-spin">
            <circle cx="310" cy="94" r="4.5" fill="#63E6FF" />
          </g>
          <g className="orbit-spin-reverse">
            <circle cx="310" cy="28" r="3.4" fill="#8A7DFF" opacity="0.95" />
          </g>
          <g fill="#CFE9F7">
            <circle cx="96" cy="140" r="2" opacity="0.8" />
            <circle cx="524" cy="196" r="1.6" opacity="0.6" />
            <circle cx="560" cy="420" r="2.1" opacity="0.7" />
            <circle cx="120" cy="470" r="1.5" opacity="0.55" />
            <circle cx="310" cy="26" r="1.8" opacity="0.9" />
            <circle cx="472" cy="540" r="1.4" opacity="0.5" />
            <circle cx="172" cy="66" r="1.3" opacity="0.5" />
            <circle cx="460" cy="80" r="1.8" opacity="0.6" />
          </g>
        </svg>

        <div className="relative z-[1] w-[min(100%,560px)] rounded-[26px] border border-line bg-linear-to-b from-[rgba(15,27,39,0.96)] to-[rgba(11,22,31,0.92)] p-[18px] shadow-[0_28px_50px_rgba(4,10,19,0.8)]">
          <div className="mb-4 flex gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-purple" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange" />
          </div>

          <div className="rounded-[22px] border border-[rgba(160,198,220,0.12)] bg-linear-to-b from-[rgba(20,35,51,0.98)] to-[rgba(12,20,31,1)] p-[22px]">
            <div className="mb-[18px] flex items-center justify-between text-[1.05rem] font-bold">
              <span>Moonriver IDO</span>
              <span className="rounded-full border border-[rgba(106,240,185,0.28)] bg-[rgba(106,240,185,0.12)] px-[0.7rem] py-[0.38rem] text-[0.72rem] tracking-[0.06em] text-green">
                Live
              </span>
            </div>

            <div className="mb-6">
              <div className="mb-2.5 flex justify-between text-muted">
                <span>Raised</span>
                <span>$2.4M / $3.0M</span>
              </div>
              <div className="h-3.5 overflow-hidden rounded-full bg-[rgba(139,170,196,0.14)]">
                <span className="block h-full w-[81%] rounded-full bg-linear-to-r from-purple via-cyan to-green" />
              </div>
            </div>

            <div className="mt-5 mb-7 grid h-[150px] grid-cols-6 items-end gap-2.5">
              {chartBars.map((height, index) => (
                <span
                  key={index}
                  className="block rounded-t-xl rounded-b-[4px] bg-linear-to-b from-[rgba(99,230,255,0.9)] to-[rgba(138,125,255,0.4)]"
                  style={{ height }}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-2.5 min-[640px]:grid-cols-3">
              <div className="rounded-[14px] border border-[rgba(160,198,220,0.12)] bg-white/[0.02] px-3 py-3.5">
                <small className="mb-2 block text-muted">Participants</small>
                <strong className="text-[1.04rem]">18,462</strong>
              </div>
              <div className="rounded-[14px] border border-[rgba(160,198,220,0.12)] bg-white/[0.02] px-3 py-3.5">
                <small className="mb-2 block text-muted">Price</small>
                <strong className="text-[1.04rem]">$0.025</strong>
              </div>
              <div className="rounded-[14px] border border-[rgba(160,198,220,0.12)] bg-white/[0.02] px-3 py-3.5">
                <small className="mb-2 block text-muted">APY</small>
                <strong className="text-[1.04rem]">14.2%</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex min-w-[185px] flex-col gap-[5px] rounded-[18px] border border-[rgba(160,198,220,0.15)] bg-[rgba(18,34,49,0.9)] px-[18px] py-4 shadow-[0_16px_32px_rgba(2,7,13,0.5)] backdrop-blur-[12px] min-[980px]:absolute min-[980px]:-right-3 min-[980px]:top-14 min-[980px]:z-[2] min-[980px]:mt-0">
          <div className="flex items-center gap-2">
            <svg
              className="h-[26px] w-[26px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="gNeon"
                  x1="4"
                  y1="4"
                  x2="20"
                  y2="20"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7DF5C6" />
                  <stop offset="1" stopColor="#52D9A2" />
                </linearGradient>
              </defs>
              <circle
                cx="12"
                cy="12"
                r="10.6"
                fill="#0B1826"
                stroke="url(#gNeon)"
                strokeWidth="1.6"
              />
              <path
                d="M9.6 11.2V9.8a2.4 2.4 0 0 1 4.8 0v1.4"
                stroke="url(#gNeon)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect
                x="8.9"
                y="11.2"
                width="6.2"
                height="5.2"
                rx="1.7"
                stroke="url(#gNeon)"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="13.5" r="1" fill="url(#gNeon)" />
            </svg>
            <span className="text-[0.72rem] tracking-[0.06em] text-muted uppercase">
              Active Round
            </span>
          </div>
          <strong className="text-[1.3rem]">Neon Vault</strong>
          <small className="text-muted">3.8x oversubscribed</small>
        </div>

        <div className="mt-4 flex min-w-[185px] flex-col gap-[5px] rounded-[18px] border border-[rgba(160,198,220,0.15)] bg-[rgba(18,34,49,0.9)] px-[18px] py-4 shadow-[0_16px_32px_rgba(2,7,13,0.5)] backdrop-blur-[12px] min-[980px]:absolute min-[980px]:-left-2.5 min-[980px]:bottom-[76px] min-[980px]:z-[2] min-[980px]:mt-0">
          <div className="flex items-center gap-2">
            <svg
              className="h-[26px] w-[26px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3.2"
                y="4.8"
                width="17.6"
                height="14.4"
                rx="3.8"
                fill="rgba(99, 230, 255, 0.14)"
                stroke="#63E6FF"
                strokeWidth="1.4"
              />
              <circle cx="7.4" cy="12" r="1.1" fill="#63E6FF" />
              <path
                d="M14.8 12.6h3.4"
                stroke="#63E6FF"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M11.6 12.6h1.4"
                stroke="#63E6FF"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
            <span className="text-[0.72rem] tracking-[0.06em] text-muted uppercase">
              Community
            </span>
          </div>
          <strong className="text-[1.3rem]">+42.1K</strong>
          <small className="text-muted">new wallets this week</small>
        </div>
      </Reveal>
    </section>
  );
}
