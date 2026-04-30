import type { APIRoute } from "astro";

import { eq } from "drizzle-orm";

import { db } from "../../db";
import { challenges as challengesTable, votes } from "../../db/schema";
import {
  getAllRounds,
  getChallengesForRound,
  getFirstLiveRound,
  getHtmlMapForChallenges,
  getJudgementsForChallenges,
  getRoundBySlug,
  getVariantSidesForChallenges,
} from "../../lib/data";

export const GET: APIRoute = async ({ locals, url }) => {
  const { userId } = locals.auth();
  const roundSlug = url.searchParams.get("round");

  const round = roundSlug
    ? await getRoundBySlug(roundSlug)
    : await getFirstLiveRound();

  if (!round) {
    return new Response(JSON.stringify({ error: "No live round found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [allRounds, challenges] = await Promise.all([
    getAllRounds(),
    getChallengesForRound(round.id),
  ]);

  const challengeIds = challenges.map((c) => c.id);

  const [judgements, variantSides, htmlMap] = await Promise.all([
    getJudgementsForChallenges(challengeIds),
    getVariantSidesForChallenges(challengeIds),
    getHtmlMapForChallenges(challengeIds),
  ]);

  let userVotes: Array<{ challengeId: string; choice: string }> = [];
  let progressByRound: Record<string, number> = {};
  if (userId) {
    try {
      // Pull every vote for this user joined with the round_id of each
      // challenge so we can both filter the current round and tally
      // completion across all rounds in one query.
      const rows = await db
        .select({
          challengeId: votes.challengeId,
          choice: votes.choice,
          roundId: challengesTable.roundId,
        })
        .from(votes)
        .innerJoin(challengesTable, eq(votes.challengeId, challengesTable.id))
        .where(eq(votes.userId, userId));

      userVotes = rows
        .filter((v) => challengeIds.includes(v.challengeId))
        .map(({ challengeId, choice }) => ({ challengeId, choice }));

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

  return new Response(
    JSON.stringify({
      round: {
        slug: round.slug,
        name: round.name,
        description: round.description,
        status: round.status,
        position: round.position,
      },
      rounds: allRounds,
      challenges,
      judgements,
      variantSides,
      userVotes,
      htmlMap,
      progressByRound,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};
