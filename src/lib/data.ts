import { asc, eq, inArray } from "drizzle-orm";

import { db } from "../db";
import { challenges, judgements, rounds, runs } from "../db/schema";

export interface Judgement {
  challengeId: string;
  left: {
    primitive: string;
    constraints: number;
    idiomatic: number;
    visual: number;
    reasoning: string;
  };
  right: {
    primitive: string;
    constraints: number;
    idiomatic: number;
    visual: number;
    reasoning: string;
  };
  winner: "left" | "right" | "tie";
  verdict: string;
}

export interface VariantSide {
  left: string;
  right: string;
}

export interface RoundMeta {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  status: string;
  position: number;
}

export interface ChallengeRow {
  id: string;
  title: string;
  expectedFeature: string;
  expectedKeywords: string[];
  prompt: string;
}

export async function getAllRounds(): Promise<RoundMeta[]> {
  const rows = await db
    .select({
      id: rounds.id,
      slug: rounds.slug,
      name: rounds.name,
      description: rounds.description,
      status: rounds.status,
      position: rounds.position,
    })
    .from(rounds)
    .where(eq(rounds.status, "live"))
    .orderBy(asc(rounds.position));
  return rows;
}

export async function getRoundBySlug(slug: string) {
  const rows = await db.select().from(rounds).where(eq(rounds.slug, slug));
  return rows[0] ?? null;
}

export async function getFirstLiveRound() {
  const rows = await db
    .select()
    .from(rounds)
    .where(eq(rounds.status, "live"))
    .orderBy(asc(rounds.position))
    .limit(1);
  return rows[0] ?? null;
}

export async function getChallengesForRound(
  roundId: number,
): Promise<ChallengeRow[]> {
  const rows = await db
    .select({
      id: challenges.id,
      title: challenges.title,
      expectedFeature: challenges.expectedFeature,
      expectedKeywords: challenges.expectedKeywords,
      prompt: challenges.prompt,
    })
    .from(challenges)
    .where(eq(challenges.roundId, roundId))
    .orderBy(asc(challenges.position));
  return rows as ChallengeRow[];
}

export async function getJudgementsForChallenges(
  challengeIds: string[],
): Promise<Judgement[]> {
  if (challengeIds.length === 0) return [];
  const rows = await db
    .select()
    .from(judgements)
    .where(inArray(judgements.challengeId, challengeIds));

  return rows.map((r) => ({
    challengeId: r.challengeId,
    left: r.leftScores as Judgement["left"],
    right: r.rightScores as Judgement["right"],
    winner: r.winner as "left" | "right" | "tie",
    verdict: r.verdict,
  }));
}

export async function getVariantSidesForChallenges(
  challengeIds: string[],
): Promise<Record<string, VariantSide>> {
  if (challengeIds.length === 0) return {};
  const rows = await db
    .select({
      challengeId: runs.challengeId,
      variant: runs.variant,
      side: runs.side,
      html: runs.html,
    })
    .from(runs)
    .where(inArray(runs.challengeId, challengeIds));

  const result: Record<string, VariantSide> = {};

  for (const r of rows) {
    if (!result[r.challengeId]) {
      result[r.challengeId] = { left: "", right: "" };
    }
    if (r.side === "left") result[r.challengeId].left = r.variant;
    else result[r.challengeId].right = r.variant;
  }
  return result;
}

export async function getHtmlMapForChallenges(
  challengeIds: string[],
): Promise<Record<string, Record<string, string>>> {
  if (challengeIds.length === 0) return {};
  const rows = await db
    .select({
      challengeId: runs.challengeId,
      variant: runs.variant,
      html: runs.html,
    })
    .from(runs)
    .where(inArray(runs.challengeId, challengeIds));

  const result: Record<string, Record<string, string>> = {};

  for (const r of rows) {
    if (!result[r.challengeId]) result[r.challengeId] = {};
    result[r.challengeId][r.variant] = r.html;
  }
  return result;
}
