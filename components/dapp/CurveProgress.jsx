export default function CurveProgress({ raised, threshold }) {
  const cap = BigInt(threshold);
  const ratio = cap > 0n ? Number((BigInt(raised) * 10000n) / cap) / 10000 : 0;
  const clamped = Math.max(0, Math.min(1, ratio));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label">Bonding curve</span>
        <span className="font-mono text-sm text-quiet" data-numeric="">
          {(clamped * 100).toFixed(1)}%
        </span>
      </div>
      <div
        className="mt-2.5 h-[3px] w-full bg-raised"
        role="img"
        aria-label={`Curve filled ${(clamped * 100).toFixed(0)} percent`}
      >
        <span className="block h-full bg-brand" style={{ width: `${clamped * 100}%` }} />
      </div>
    </div>
  );
}
