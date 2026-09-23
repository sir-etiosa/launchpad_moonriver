import { NextResponse } from "next/server";

import { getSql } from "@/lib/db";

export const runtime = "nodejs";

function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function findGame(gameId, ownerKey) {
  const sql = getSql();
  const rows = await sql`
    SELECT game_id, state, version
    FROM whot_games
    WHERE game_id = ${gameId} AND owner_key = ${ownerKey}
    LIMIT 1
  `;
  return rows[0];
}

export async function GET(request, { params }) {
  try {
    const { gameId } = await params;
    const ownerKey = request.headers.get("x-whot-owner")?.trim();
    if (!ownerKey) return jsonError("Missing game owner.");

    const row = await findGame(gameId, ownerKey);
    if (!row) return jsonError("Game session not found.", 404);

    return NextResponse.json({ gameId: row.game_id, state: row.state, version: row.version });
  } catch (error) {
    console.error("[whot] load session failed", error);
    return jsonError("Game persistence is not configured.", 503);
  }
}

export async function PUT(request, { params }) {
  try {
    const { gameId } = await params;
    const ownerKey = request.headers.get("x-whot-owner")?.trim();
    const body = await request.json();
    const state = body.state;
    const expectedVersion = Number(body.version);

    if (!ownerKey || !state || !Number.isInteger(expectedVersion) || expectedVersion < 0) {
      return jsonError("owner, state, and version are required.");
    }

    const sql = getSql();
    const rows = await sql`
      UPDATE whot_games
      SET state = ${JSON.stringify(state)}::jsonb,
          version = version + 1,
          updated_at = NOW()
      WHERE game_id = ${gameId}
        AND owner_key = ${ownerKey}
        AND version = ${expectedVersion}
      RETURNING version
    `;

    if (!rows[0]) {
      const current = await findGame(gameId, ownerKey);
      return current
        ? jsonError("Game session is out of date.", 409)
        : jsonError("Game session not found.", 404);
    }

    return NextResponse.json({ version: rows[0].version });
  } catch (error) {
    console.error("[whot] save session failed", error);
    return jsonError("Game persistence is not configured.", 503);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { gameId } = await params;
    const ownerKey = request.headers.get("x-whot-owner")?.trim();
    if (!ownerKey) return jsonError("Missing game owner.");

    const sql = getSql();
    await sql`
      DELETE FROM whot_games
      WHERE game_id = ${gameId} AND owner_key = ${ownerKey}
    `;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[whot] delete session failed", error);
    return jsonError("Game persistence is not configured.", 503);
  }
}
