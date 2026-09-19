import LaunchLedger from "@/components/LaunchLedger";
import Reveal from "@/components/Reveal";
import { placeholderLaunches } from "@/lib/placeholderLaunches";

export default function Launchpad() {
  return (
    <section id="launchpad" className="border-t border-rule py-20 md:py-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label m-0">Launchpad</p>
          <h2 className="mt-5 mb-0 text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
            The ledger
          </h2>
        </div>
        <p className="m-0 font-mono text-sm leading-relaxed text-faint">
          Fill measured against the 5,000 MVR cap.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <LaunchLedger tokens={placeholderLaunches} />
      </Reveal>
    </section>
  );
}
