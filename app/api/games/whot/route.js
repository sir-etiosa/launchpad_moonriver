import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { getSql } from "@/lib/db";

export const runtime = "nodejs";

function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const ownerKey = String(body.ownerKey ?? "").trim();
    const state = body.state;

    if (!ownerKey || !state || !Array.isArray(state.players)) {
      return jsonError("ownerKey and a valid game state are required.");
    }

    const gameId = randomUUID();
    const sql = getSql();
    await sql`
      INSERT INTO whot_games (game_id, owner_key, state)
      VALUES (${gameId}, ${ownerKey}, ${JSON.stringify(state)}::jsonb)
    `;

    return NextResponse.json({ gameId, version: 0 });
  } catch (error) {
    console.error("[whot] create session failed", error);
    return jsonError("Game persistence is not configured.", 503);
  }
}

export async function GET(request) {
  try {
    const ownerKey = new URL(request.url).searchParams.get("ownerKey")?.trim();
    if (!ownerKey) return jsonError("Missing game owner.");

    const sql = getSql();
    const activeRows = await sql`
      SELECT game_id, state, version
      FROM whot_games
      WHERE owner_key = ${ownerKey}
        AND state->>'finished' = 'false'
      ORDER BY updated_at DESC
      LIMIT 1
    `;
    const historyRows = await sql`
      SELECT game_id, state, version, created_at, updated_at
      FROM whot_games
      WHERE owner_key = ${ownerKey}
        AND state->>'finished' = 'true'
      ORDER BY updated_at DESC
      LIMIT 25
    `;

    return NextResponse.json({
      active: activeRows[0]
        ? {
            gameId: activeRows[0].game_id,
            state: activeRows[0].state,
            version: activeRows[0].version,
          }
        : null,
      history: historyRows.map((row) => ({
        gameId: row.game_id,
        state: row.state,
        version: row.version,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    console.error("[whot] find session failed", error);
    return jsonError("Game persistence is not configured.", 503);
  }
}
