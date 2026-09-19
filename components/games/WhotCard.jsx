import { WhotSuit } from "@/components/games/suits";

/**
 * Every symbol is the same brown, on white stock. The shape itself is what distinguishes
 * a card, not its colour, so there is exactly one ink on this deck.
 *
 * Layout: index at the top-right, symbol through the middle, index again at the
 * bottom-left rotated 180°, so the card reads correctly from either end of the table.
 *
 * A Whot has no symbol, so it prints the word instead with a heavier edge.
 *
 * `stack` is the negative top margin used to pile face-down cards: the stack shows a
 * slice of every card behind the front one, the way a dealt deck sits on a table.
 * Stacking them sideways at this size reads as a striped bar, not a hand.
 */
const INK = "#4a3823";

export const CARD_SIZES = {
  sm: {
    box: "h-[10.5rem] w-[7.5rem] px-1 py-1",
    number: "text-xl",
    suit: "h-24 w-24",
    word: "text-sm tracking-[0.18em]",
    stack: "-mt-[9.25rem]",
  },
  md: {
    box: "h-[13rem] w-[9.5rem] px-1 py-1",
    number: "text-xl",
    suit: "h-36 w-36",
    word: "text-2xl tracking-[0.24em]",
    stack: "-mt-[11.5rem]",
  },
  lg: {
    box: "h-[16rem] w-[12rem] px-1.5 py-1.5",
    number: "text-3xl",
    suit: "h-44 w-44",
    word: "text-4xl tracking-[0.26em]",
    stack: "-mt-[13.5rem]",
  },
};

export default function WhotCard({
  card,
  size = "md",
  muted = false,
  className = "",
}) {
  const scale = CARD_SIZES[size] ?? CARD_SIZES.md;
  const isWild = card.number === 20;

  return (
    <div
      className={`flex flex-col justify-between rounded-lg border bg-white ${
        scale.box
      } ${isWild ? "border-[#4a3823]/70" : "border-[#4a3823]/25"} ${
        muted ? "opacity-35" : ""
      } ${className}`}
    >
      <span
        className={`self-end font-mono leading-none font-semibold ${scale.number}`}
        style={{ color: INK }}
        data-numeric=""
      >
        {card.number}
      </span>

      <span className="flex flex-1 items-center justify-center" style={{ color: INK }}>
        {isWild ? (
          <span className={`font-mono leading-none font-bold ${scale.word}`}>WHOT</span>
        ) : (
          <WhotSuit suit={card.suit} className={scale.suit} />
        )}
      </span>

      <span
        className={`rotate-180 self-start font-mono leading-none font-semibold ${scale.number}`}
        style={{ color: INK }}
        data-numeric=""
      >
        {card.number}
      </span>
    </div>
  );
}
