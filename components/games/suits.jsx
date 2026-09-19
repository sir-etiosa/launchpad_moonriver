/**
 * The five Whot shapes. Whot calls a suit by its shape, and the Nigerian names differ
 * from the British ones, so both are exported.
 *
 * These are solid forms, not outlines: the shape is filled edge to edge so no card stock
 * shows through the middle. The cross is a polygon rather than two strokes for the same
 * reason — stroked arms leave a hollow centre.
 */
export const SUIT_ORDER = ["circle", "triangle", "cross", "square", "star"];

export const SUIT_SHAPES = {
  circle: <circle cx="12" cy="12" r="7.5" />,
  triangle: <path d="M12 4.2l7.8 14.4H4.2z" />,
  cross: <path d="M9 4.2h6v4.8h4.8v6H15v4.8H9V15H4.2V9H9z" />,
  square: <rect x="4.6" y="4.6" width="14.8" height="14.8" />,
  star: (
    <path d="M12 3.2l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.8z" />
  ),
};

export const SUIT_NAMES = {
  circle: "Ball",
  triangle: "Angle",
  cross: "Cross",
  square: "Carpet",
  star: "Star",
};

export function WhotSuit({ suit, className = "h-5 w-5" }) {
  const shape = SUIT_SHAPES[suit];
  if (!shape) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {shape}
    </svg>
  );
}
