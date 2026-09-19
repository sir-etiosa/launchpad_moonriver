/**
 * Social marks, drawn at the same optical weight as the rest of the system's glyphs.
 *
 * X is a solid logotype because that is what the mark is; Instagram is drawn as hairline
 * geometry to match the card and suit iconography. Both inherit `currentColor` so they
 * pick up the surrounding text colour and hover state.
 */
export function SocialIcon({ name, className = "h-5 w-5" }) {
  if (name === "X") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={className}
        aria-hidden="true"
      >
        <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.5" cy="6.5" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return null;
}

export function SocialLink({ name, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Moonriver.fun on ${name} (opens in a new tab)`}
      className="text-quiet transition-colors duration-150 hover:text-paper"
    >
      <SocialIcon name={name} />
    </a>
  );
}
