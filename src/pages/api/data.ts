import fs from "node:fs";
import path from "node:path";

import type { APIRoute } from "astro";

import { eq } from "drizzle-orm";

import { db } from "../../db";
import { votes } from "../../db/schema";
import { getChallenges, getJudgements, getVariantSides } from "../../lib/data";

export const GET: APIRoute = async ({ locals }) => {
  const { userId } = locals.auth();
  const challenges = getChallenges();
  const judgements = getJudgements();
  const variantSides = getVariantSides();

  let userVotes: Array<{ challengeId: string; choice: string }> = [];
  if (userId) {
    try {
      const rows = await db
        .select({ challengeId: votes.challengeId, choice: votes.choice })
        .from(votes)
        .where(eq(votes.userId, userId));
      userVotes = rows;
    } catch {
      userVotes = [];
    }
  }

  const htmlMap: Record<string, Record<string, string>> = {};
  for (const challenge of challenges) {
    htmlMap[challenge.id] = {};
    for (const variant of ["A-with-mcp", "B-without-mcp"]) {
      const filePath = path.join(
        process.cwd(),
        "src/data",
        challenge.id,
        variant,
        "output.html",
      );
      try {
        htmlMap[challenge.id][variant] = fs.readFileSync(filePath, "utf-8");
      } catch {
        htmlMap[challenge.id][variant] = "<p>Error loading HTML</p>";
      }
    }
  }

  return new Response(
    JSON.stringify({
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
