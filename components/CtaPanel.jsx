import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

export default function CtaPanel() {
  return (
    <Reveal className="mt-[100px] flex flex-col items-start justify-between gap-5 rounded-3xl border border-line bg-linear-to-br from-[rgba(138,125,255,0.18)] to-[rgba(99,230,255,0.12)] px-8 py-7 shadow-[0_16px_28px_rgba(6,16,24,0.35)] min-[980px]:flex-row min-[980px]:items-center">
      <div>
        <p className="mb-[18px] text-[0.78rem] font-bold tracking-[0.18em] text-cyan">
          READY TO LAUNCH
        </p>
        <h2 className="m-0 text-[clamp(2rem,3vw,3rem)] tracking-[-0.05em]">
          Turn your community into the next big Web3 story.
        </h2>
      </div>
      <Button href="#" variant="primary">
        Book a Strategy Call
      </Button>
    </Reveal>
  );
}
