/**
 * Shared presentation for the 404 and the runtime error boundary, so the two surfaces
 * cannot drift apart. Copy follows the recovery rule: say what happened, say it is not
 * the reader's fault, and offer the way out.
 */
export default function ErrorState({ code, title, body, detail, children }) {
  return (
    <div className="flex min-h-[62vh] flex-col justify-center py-20">
      <p className="m-0 font-mono text-sm tracking-[0.16em] text-brand uppercase">
        {code}
      </p>

      <h1 className="mt-5 mb-0 max-w-[22ch] text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance">
        {title}
      </h1>

      <p className="mt-5 mb-0 max-w-[56ch] text-sm leading-[1.75] text-quiet">
        {body}
      </p>

      {detail ? (
        <p className="mt-6 mb-0 font-mono text-sm break-all text-faint" data-numeric="">
          {detail}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-rule pt-8">
        {children}
      </div>
    </div>
  );
}
