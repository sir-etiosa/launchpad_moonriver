import { formatUnits, parseUnits } from "viem";

import {
  ERC20_USDC_DECIMALS,
  MEME_TOKEN_DECIMALS,
  NATIVE_USDC_DECIMALS,
} from "@/lib/arc";

const EMPTY = "";

function toBigInt(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "bigint") return value;
  return undefined;
}

function trim(value, maxFractionDigits) {
  if (!value.includes(".")) return value;
  const [whole, fraction] = value.split(".");
  const clipped = fraction.slice(0, maxFractionDigits).replace(/0+$/, "");
  return clipped ? `${whole}.${clipped}` : whole;
}

function format(value, decimals, maxFractionDigits) {
  const amount = toBigInt(value);
  if (amount === undefined) return EMPTY;
  return trim(formatUnits(amount, decimals), maxFractionDigits);
}

function parse(value, decimals) {
  const raw = String(value ?? "").trim();
  if (raw === "") return 0n;

  const dot = raw.indexOf(".");
  if (dot !== -1 && raw.length - dot - 1 > decimals) {
    throw new Error(
      `"${raw}" has more than ${decimals} decimal places; it would be silently truncated.`,
    );
  }

  return parseUnits(raw, decimals);
}

/**
 * Native USDC — the 18-decimal gas token. Use for anything moving through
 * `msg.value` or read as a native balance.
 */
export function formatNativeUsdc(value, { maxFractionDigits = 4 } = {}) {
  return format(value, NATIVE_USDC_DECIMALS, maxFractionDigits);
}

export function parseNativeUsdc(value) {
  return parse(value, NATIVE_USDC_DECIMALS);
}

/**
 * The 6-decimal ERC-20 USDC interface — NOT interchangeable with native USDC.
 */
export function formatErc20Usdc(value, { maxFractionDigits = 4 } = {}) {
  return format(value, ERC20_USDC_DECIMALS, maxFractionDigits);
}

export function parseErc20Usdc(value) {
  return parse(value, ERC20_USDC_DECIMALS);
}

/** Launched meme tokens are always 18 decimals. */
export function formatTokenAmount(value, { maxFractionDigits = 4 } = {}) {
  return format(value, MEME_TOKEN_DECIMALS, maxFractionDigits);
}

export function parseTokenAmount(value) {
  return parse(value, MEME_TOKEN_DECIMALS);
}

/** Compact whole-number display for large supplies: 12_400_000n -> "12.4M". */
export function formatCompactAmount(value) {
  const amount = toBigInt(value);
  if (amount === undefined) return EMPTY;

  const whole = amount / 10n ** BigInt(MEME_TOKEN_DECIMALS);
  const abs = whole < 0n ? -whole : whole;

  if (abs >= 1_000_000_000n) return `${trim(formatUnits(whole, 0), 0)}`;
  if (abs >= 1_000_000n) return `${(Number(whole) / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000n) return `${(Number(whole) / 1_000).toFixed(1)}K`;

  return whole.toString();
}

export function shortenAddress(address, { lead = 6, tail = 4 } = {}) {
  if (!address) return EMPTY;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

export function formatPercent(fraction, { maxFractionDigits = 1 } = {}) {
  if (typeof fraction !== "number" || Number.isNaN(fraction)) return EMPTY;
  return `${(fraction * 100).toFixed(maxFractionDigits)}%`;
}

/** Curve fill as a 0..1 fraction, clamped so a comment/rounding overshoot cannot exceed 1. */
export function fillRatio(raised, threshold) {
  const cap = BigInt(threshold ?? 0);
  if (cap <= 0n) return 0;
  return Math.min(1, Number((BigInt(raised) * 10000n) / cap) / 10000);
}
