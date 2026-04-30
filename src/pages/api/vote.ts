import type { APIRoute } from "astro";

import { db } from "../../db";
import { votes } from "../../db/schema";

export const POST: APIRoute = async ({ request, locals }) => {
  const { userId } = locals.auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { challengeId?: string; choice?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { challengeId, choice } = body;

  if (!challengeId || !choice || !["left", "right", "tie"].includes(choice)) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await db
      .insert(votes)
      .values({ userId, challengeId, choice })
      .onConflictDoUpdate({
        target: [votes.userId, votes.challengeId],
        set: { choice, createdAt: new Date() },
      });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "DB error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
