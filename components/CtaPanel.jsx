import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

export default function CtaPanel() {
  return (
    <Reveal className="border-t border-rule py-20 md:py-28">
      <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div>
          <p className="label m-0">Ready when you are</p>
          <h2 className="mt-5 mb-0 max-w-[18ch] text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.06] font-semibold tracking-[-0.035em]">
            Bring a token, a deck, or a position.
          </h2>
        </div>
        <Button as="a" href="/app" variant="primary" className="shrink-0">
          Open the app
        </Button>
      </div>
    </Reveal>
  );
}
