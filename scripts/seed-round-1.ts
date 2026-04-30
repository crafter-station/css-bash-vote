#!/usr/bin/env bun
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { CHALLENGES } from "../src/data/challenges.ts";
import summaryRaw from "../src/data/summary.json";
import {
  challenges,
  judgements,
  rounds,
  runs,
} from "../src/db/schema.ts";
import { client, db } from "./lib/db-scripts.ts";

const ROUND_SLUG = "01-layout-positioning";
const ROUND_NAME = "Layout & positioning";
const ROUND_DESCRIPTION =
  "The default. Anchor positioning, :has(), @scope, view-transitions, light-dark — features browsers shipped in the last 2 years that LLMs trained pre-2024 still mostly miss.";

const summary = summaryRaw as {
  results: Array<{
    challengeId: string;
    variant: string;
    durationMs: number;
    exitCode: number;
    htmlBytes: number;
    keywordsHit: string[];
    mcpUsed: boolean;
  }>;
  judgements: Array<{
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
    winner: string;
    verdict: string;
  }>;
  variantSides: Record<string, { left: string; right: string }>;
};

async function main() {
  const existing = await db
    .select()
    .from(rounds)
    .where(eq(rounds.slug, ROUND_SLUG));

  if (existing.length > 0) {
    console.log(`Round '${ROUND_SLUG}' already exists — skipping.`);
    await client.end();
    return;
  }

  const [round] = await db
    .insert(rounds)
    .values({
      slug: ROUND_SLUG,
      name: ROUND_NAME,
      description: ROUND_DESCRIPTION,
      status: "live",
      position: 1,
    })
    .returning();

  console.log(`Inserted round: ${round.id} — ${round.name}`);

  for (let i = 0; i < CHALLENGES.length; i++) {
    const c = CHALLENGES[i];

    await db.insert(challenges).values({
      id: c.id,
      roundId: round.id,
      position: i + 1,
      title: c.title,
      prompt: c.prompt,
      expectedFeature: c.expectedFeature,
      expectedKeywords: c.expectedKeywords,
    });

    const sides = summary.variantSides[c.id];
    for (const variant of ["A-with-mcp", "B-without-mcp"] as const) {
      const resultMeta = summary.results.find(
        (r) => r.challengeId === c.id && r.variant === variant,
      );
      const htmlPath = join(
        process.cwd(),
        "src/data",
        c.id,
        variant,
        "output.html",
      );
      let html = "<p>HTML not found</p>";
      try {
        html = readFileSync(htmlPath, "utf-8");
      } catch {
        console.warn(`  [WARN] no html for ${c.id}/${variant}`);
      }

      const side = sides.left === variant ? "left" : "right";

      await db.insert(runs).values({
        challengeId: c.id,
        variant,
        html,
        durationMs: resultMeta?.durationMs ?? null,
        exitCode: resultMeta?.exitCode ?? null,
        mcpUsed: resultMeta?.mcpUsed ?? false,
        side,
      });
    }

    const judg = summary.judgements.find((j) => j.challengeId === c.id);
    if (judg) {
      await db.insert(judgements).values({
        challengeId: c.id,
        leftScores: judg.left,
        rightScores: judg.right,
        winner: judg.winner,
        verdict: judg.verdict,
      });
    }

    console.log(`  [${i + 1}/10] ${c.id} inserted`);
  }

  console.log("Round 1 seeded successfully.");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
