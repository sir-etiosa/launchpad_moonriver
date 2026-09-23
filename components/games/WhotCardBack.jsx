import { CARD_SIZES } from "@/components/games/WhotCard";

/**
 * The face-down side of the pack, and a stacked pile of them.
 *
 * Opponents' hands are shown as full-size backs piled downward, each showing a slice of
 * the one in front — the way a dealt deck sits on a table. The pile is decorative: the
 * printed count above it is the accessible number, which is why the pile is capped. The
 * count stays true even when the stack stops growing.
 */
const MAX_VISIBLE = 3;

export function WhotCardBack({ size = "md", className = "" }) {
  const scale = CARD_SIZES[size] ?? CARD_SIZES.md;

  return (
    <div
      className={`relative rounded-lg border border-[#2a1f12] bg-[#4a3823] p-[3px] ${scale.box} ${className}`}
    >
      <span className="relative block h-full w-full rounded-md border border-[#e6d9c0]/30">
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 font-mono text-xl font-bold tracking-[0.16em] text-[#e6d9c0]/80">
          <span>WHOT</span>
          <span>WHOT</span>
        </span>
      </span>
    </div>
  );
}

export function WhotCardStack({ count, size = "md", className = "" }) {
  const scale = CARD_SIZES[size] ?? CARD_SIZES.md;

  if (count === 0) {
    return (
      <p className={`m-0 font-mono text-sm text-faint ${className}`}>no cards</p>
    );
  }

  const shown = Math.min(count, MAX_VISIBLE);

  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: shown }, (_, index) => (
        <WhotCardBack
          key={index}
          size={size}
          className={index === 0 ? "" : scale.stack}
        />
      ))}
    </div>
  );
}
