/**
 * Marks for the non-Whot tables, drawn as hairlines to sit alongside the Whot shapes.
 *
 * These are simplified silhouettes rather than accurate piece sets: at 32px the job is
 * to say "chess" and "ludo" at a glance, not to be a diagram.
 */
export function ChessPiece({ piece, className = "h-8 w-8" }) {
  if (piece === "queen") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M5.6 9.2l2.2 7.4h8.4l2.2-7.4-3.3 2.6L12 6l-3.1 5.8z" />
        <path d="M7.6 19.6h8.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (piece === "knight") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M8.4 19.8h10.2v-2.9c0-3.7-2-6.2-4.4-8l.9-2.7-3.5 1.5-2.4-1 .6 4.4c-1.2 1.3-2 3.1-2 5v3.7z" />
        <circle cx="15.2" cy="10.9" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (piece === "bishop") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <circle cx="12" cy="5.3" r="1.7" />
        <path d="M12 8.6c-2.4 2.3-3.8 4.5-3.8 6.6 0 1.4.9 2.5 1.9 3h3.8c1-.5 1.9-1.6 1.9-3 0-2.1-1.4-4.3-3.8-6.6z" />
        <path d="M8.2 19.8h7.6" strokeLinecap="round" />
        <path d="M10 9.6L12 7.4" strokeLinecap="round" />
      </svg>
    );
  }

  return null;
}

const PIPS = {
  4: [
    [7.8, 7.8],
    [16.2, 7.8],
    [7.8, 16.2],
    [16.2, 16.2],
  ],
  5: [
    [7.8, 7.8],
    [16.2, 7.8],
    [12, 12],
    [7.8, 16.2],
    [16.2, 16.2],
  ],
  6: [
    [7.8, 7.8],
    [16.2, 7.8],
    [7.8, 12],
    [16.2, 12],
    [7.8, 16.2],
    [16.2, 16.2],
  ],
};

export function Die({ face, className = "h-8 w-8" }) {
  const pips = PIPS[face] ?? [];

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="3.2"
        y="3.2"
        width="17.6"
        height="17.6"
        rx="4.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {pips.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" fill="currentColor" />
      ))}
    </svg>
  );
}
