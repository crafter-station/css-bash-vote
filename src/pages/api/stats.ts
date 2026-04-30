import type { APIRoute } from "astro";

import { inArray, sql } from "drizzle-orm";

import { db } from "../../db";
import { challenges, votes } from "../../db/schema";
import {
  getChallengesForRound,
  getFirstLiveRound,
  getRoundBySlug,
} from "../../lib/data";

export const GET: APIRoute = async ({ url }) => {
  try {
    const roundSlug = url.searchParams.get("round");

    const round = roundSlug
      ? await getRoundBySlug(roundSlug)
      : await getFirstLiveRound();

    let challengeIds: string[] = [];
    if (round) {
      const roundChallenges = await getChallengesForRound(round.id);
      challengeIds = roundChallenges.map((c) => c.id);
    } else {
      const all = await db.select({ id: challenges.id }).from(challenges);
      challengeIds = all.map((c) => c.id);
    }

    if (challengeIds.length === 0) {
      return new Response(JSON.stringify({ stats: {}, totalVotes: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const rows = await db
      .select({
        challengeId: votes.challengeId,
        choice: votes.choice,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(votes)
      .where(inArray(votes.challengeId, challengeIds))
      .groupBy(votes.challengeId, votes.choice);

    const stats: Record<
      string,
      { left: number; right: number; tie: number; total: number }
    > = {};
    for (const row of rows) {
      if (!stats[row.challengeId]) {
        stats[row.challengeId] = { left: 0, right: 0, tie: 0, total: 0 };
      }
      const choice = row.choice as "left" | "right" | "tie";
      stats[row.challengeId][choice] = row.count;
      stats[row.challengeId].total += row.count;
    }

    const totalVotes = Object.values(stats).reduce(
      (sum, s) => sum + s.total,
      0,
    );

    return new Response(JSON.stringify({ stats, totalVotes }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ stats: {}, totalVotes: 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
