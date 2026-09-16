import Reveal from "@/components/Reveal";

const brands = [
  {
    name: "Moonbeam",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="6.8" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="13.4" cy="7.6" r="1.6" fill="currentColor" />
        <circle cx="8.4" cy="13.6" r="1" fill="currentColor" opacity="0.75" />
      </svg>
    ),
  },
  {
    name: "Polkadot",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="4.6" r="2.1" fill="currentColor" />
        <circle cx="15.6" cy="13.8" r="2.1" fill="currentColor" />
        <circle cx="4.4" cy="13.8" r="2.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "GuildFi",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 3l5 2.1v3.5c0 3.7-2.2 6.6-5 8-2.8-1.4-5-4.3-5-8V5.1L10 3Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Nova DAO",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 2.6 12.2 7.8l5.2 2.2-5.2 2.2L10 17.4 7.8 12.2 2.6 10l5.2-2.2L10 2.6Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "SpaceBridge",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M3.4 14.8c1.8-5.4 4.2-7.4 6.6-7.4s4.8 2 6.6 7.4"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <circle cx="10" cy="7.4" r="1.7" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Trusted() {
  return (
    <Reveal className="mt-5 border-y border-line px-5 pt-3 pb-[38px]">
      <p className="mb-5 text-center text-muted">
        Trusted by builders, communities, and ecosystem partners
      </p>
      <div className="grid grid-cols-2 items-center gap-[18px] min-[640px]:grid-cols-5">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="flex min-h-14 items-center justify-center gap-2.5 rounded-[14px] border border-line bg-white/[0.015] text-[rgba(205,222,236,0.72)] transition duration-200 hover:border-[rgba(160,198,220,0.34)] hover:bg-white/[0.035] hover:text-ink"
          >
            <span className="h-[18px] w-[18px] shrink-0 [&>svg]:h-full [&>svg]:w-full">
              {brand.icon}
            </span>
            <span className="text-[0.8rem] font-bold tracking-[0.08em] uppercase">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
