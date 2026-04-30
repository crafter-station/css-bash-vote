import type { APIRoute } from "astro";

import { eq, inArray, sql } from "drizzle-orm";

import { db } from "../../../db";
import { challenges as challengesTable, votes } from "../../../db/schema";
import {
  getAllRounds,
  getChallengesForRound,
  getJudgementsForChallenges,
  getVariantSidesForChallenges,
} from "../../../lib/data";

export const GET: APIRoute = async ({ locals }) => {
  const { userId } = locals.auth();

  const allRounds = await getAllRounds();

  const challengesPerRound = await Promise.all(
    allRounds.map((r) => getChallengesForRound(r.id)),
  );

  const allChallenges = challengesPerRound.flat();
  const allChallengeIds = allChallenges.map((c) => c.id);

  const [allJudgements, allVariantSides, voteRows] = await Promise.all([
    getJudgementsForChallenges(allChallengeIds),
    getVariantSidesForChallenges(allChallengeIds),
    allChallengeIds.length > 0
      ? db
          .select({
            challengeId: votes.challengeId,
            choice: votes.choice,
            count: sql<number>`cast(count(*) as int)`,
          })
          .from(votes)
          .where(inArray(votes.challengeId, allChallengeIds))
          .groupBy(votes.challengeId, votes.choice)
      : Promise.resolve([]),
  ]);

  const allStats: Record<string, { left: number; right: number; tie: number; total: number }> = {};
  for (const row of voteRows) {
    if (!allStats[row.challengeId]) {
      allStats[row.challengeId] = { left: 0, right: 0, tie: 0, total: 0 };
    }
    const choice = row.choice as "left" | "right" | "tie";
    allStats[row.challengeId][choice] = row.count;
    allStats[row.challengeId].total += row.count;
  }

  let userVotes: Array<{ challengeId: string; choice: string }> = [];
  let progressByRound: Record<string, number> = {};

  if (userId) {
    try {
      const rows = await db
        .select({
          challengeId: votes.challengeId,
          choice: votes.choice,
          roundId: challengesTable.roundId,
        })
        .from(votes)
        .innerJoin(challengesTable, eq(votes.challengeId, challengesTable.id))
        .where(eq(votes.userId, userId));

      userVotes = rows.map(({ challengeId, choice }) => ({ challengeId, choice }));

      const countByRoundId: Record<number, number> = {};
      for (const r of rows) {
        countByRoundId[r.roundId] = (countByRoundId[r.roundId] ?? 0) + 1;
      }
      progressByRound = Object.fromEntries(
        allRounds.map((r) => [r.slug, countByRoundId[r.id] ?? 0]),
      );
    } catch {
      userVotes = [];
      progressByRound = {};
    }
  }

  const challengesByRound = Object.fromEntries(
    allRounds.map((r, i) => [r.slug, challengesPerRound[i]]),
  );

  return new Response(
    JSON.stringify({
      rounds: allRounds,
      challengesByRound,
      allJudgements,
      allVariantSides,
      allStats,
      userVotes,
      progressByRound,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
};
