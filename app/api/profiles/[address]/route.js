import { NextResponse } from "next/server";

import { getSql } from "@/lib/db";

export const runtime = "nodejs";

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const DEFAULT_NAME = "You";

function normalizeAddress(address) {
  return String(address ?? "").trim().toLowerCase();
}

function validAddress(address) {
  return ADDRESS_PATTERN.test(address);
}

function cleanName(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 24);
}

function errorResponse(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request, { params }) {
  try {
    const { address } = await params;
    const walletAddress = normalizeAddress(address);
    if (!validAddress(walletAddress)) return errorResponse("Invalid wallet address.");

    const sql = getSql();
    const rows = await sql`
      SELECT wallet_address, display_name
      FROM profiles
      WHERE wallet_address = ${walletAddress}
      LIMIT 1
    `;

    return NextResponse.json({
      walletAddress,
      displayName: rows[0]?.display_name ?? DEFAULT_NAME,
    });
  } catch (error) {
    console.error("[profile] load failed", error);
    return errorResponse("Profile storage is not configured.", 503);
  }
}

export async function PUT(request, { params }) {
  try {
    const { address } = await params;
    const walletAddress = normalizeAddress(address);
    const displayName = cleanName((await request.json()).displayName);

    if (!validAddress(walletAddress)) return errorResponse("Invalid wallet address.");
    if (displayName.length < 2) {
      return errorResponse("Display name must be at least 2 characters.");
    }

    const sql = getSql();
    const rows = await sql`
      INSERT INTO profiles (wallet_address, display_name)
      VALUES (${walletAddress}, ${displayName})
      ON CONFLICT (wallet_address)
      DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = NOW()
      RETURNING wallet_address, display_name
    `;

    return NextResponse.json({
      walletAddress: rows[0].wallet_address,
      displayName: rows[0].display_name,
    });
  } catch (error) {
    console.error("[profile] save failed", error);
    return errorResponse("Profile storage is not configured.", 503);
  }
}
