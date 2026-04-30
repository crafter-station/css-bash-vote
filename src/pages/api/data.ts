import type { APIRoute } from "astro";

import { eq } from "drizzle-orm";

import { db } from "../../db";
import { votes } from "../../db/schema";
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
  if (userId && challengeIds.length > 0) {
    try {
      const rows = await db
        .select({ challengeId: votes.challengeId, choice: votes.choice })
        .from(votes)
        .where(eq(votes.userId, userId));
      userVotes = rows.filter((v) => challengeIds.includes(v.challengeId));
    } catch {
      userVotes = [];
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
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};
