import { fillRatio } from "@/lib/format";

export const LAUNCH_KINDS = [
  { value: "all", label: "All" },
  { value: "meme", label: "Memes" },
  { value: "launchpad", label: "Launchpads" },
];

export const LAUNCH_SORTS = [
  { value: "fill", label: "Fill" },
  { value: "raised", label: "Raised" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name" },
];

const KIND_VALUES = new Set(LAUNCH_KINDS.map((k) => k.value));
const SORT_VALUES = new Set(LAUNCH_SORTS.map((s) => s.value));

/** Hand-edited or unknown query values fall back to the default rather than rendering nothing. */
export function normalizeKind(value) {
  return KIND_VALUES.has(value) ? value : "all";
}

export function normalizeSort(value) {
  return SORT_VALUES.has(value) ? value : "fill";
}

function compareBigIntDesc(a, b) {
  const x = BigInt(a);
  const y = BigInt(b);
  if (x === y) return 0;
  return x > y ? 1 : -1;
}

const comparators = {
  fill: (a, b) => fillRatio(b.raised, b.threshold) - fillRatio(a.raised, a.threshold),
  raised: (a, b) => compareBigIntDesc(b.raised, a.raised),
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  name: (a, b) => a.name.localeCompare(b.name),
};

/**
 * Pure selection so the server can render the real rows into the HTML. Filter state
 * lives in the URL, which means the ledger is never a client-side-only render.
 */
export function selectLaunches(tokens, kind, sort) {
  const filtered = kind === "all" ? tokens : tokens.filter((t) => t.kind === kind);
  return [...filtered].sort(comparators[sort]);
}

export function kindLabel(kind) {
  return LAUNCH_KINDS.find((k) => k.value === kind)?.label.toLowerCase() ?? "launches";
}
