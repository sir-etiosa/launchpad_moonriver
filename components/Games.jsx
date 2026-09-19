import Reveal from "@/components/Reveal";
import { ChessPiece, Die } from "@/components/games/pieces";
import { SUIT_NAMES, SUIT_ORDER, WhotSuit } from "@/components/games/suits";

const CHESS_PIECES = ["queen", "knight", "bishop"];
const DICE_FACES = [6, 4, 5];

const tables = [
  {
    name: "Whot",
    marks: SUIT_ORDER.map((suit) => ({
      key: suit,
      label: SUIT_NAMES[suit],
      node: <WhotSuit suit={suit} className="h-8 w-8 text-quiet" />,
    })),
  },
  {
    name: "Chess",
    marks: CHESS_PIECES.map((piece) => ({
      key: piece,
      label: piece,
      node: <ChessPiece piece={piece} className="h-8 w-8 text-quiet" />,
    })),
  },
  {
    name: "Ludo",
    marks: DICE_FACES.map((face) => ({
      key: face,
      label: `die showing ${face}`,
      node: <Die face={face} className="h-8 w-8 text-quiet" />,
    })),
  },
];

export default function Games() {
  return (
    <section id="games" className="border-t border-rule py-20 md:py-28">
      <Reveal>
        <p className="label m-0">Games</p>
        <h2 className="mt-5 mb-0 max-w-[24ch] text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
          Stake MVR, take a seat
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
        {tables.map((table) => (
          <Reveal key={table.name} className="border-t border-rule pt-7">
            <h3 className="m-0 text-2xl font-semibold tracking-tight">
              {table.name}
            </h3>

            <ul className="mt-6 mb-0 flex list-none items-center gap-4 p-0">
              {table.marks.map((mark) => (
                <li key={mark.key} aria-label={mark.label}>
                  {mark.node}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
