import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import {
  challenges as challengesTable,
  judgements as judgementsTable,
  rounds,
  runs as runsTable,
} from "../../src/db/schema.ts";
import { client, db } from "./db-scripts.ts";

const HOME_WITH_MCP = "/tmp/css-bash-demo/codex-with-mcp";
const HOME_WITHOUT_MCP = "/tmp/css-bash-demo/codex-without-mcp";

const VARIANTS = [
  { id: "A-with-mcp" as const, home: HOME_WITH_MCP },
  { id: "B-without-mcp" as const, home: HOME_WITHOUT_MCP },
];

const SHARED_PROMPT_SUFFIX = `

You may have access to a "css-bash" MCP server with tools like \`intent\`, \`baseline\`, \`support\`, \`whatsnew\`, \`recipe\`, and \`view\`, plus a virtual filesystem of CSS features. If those tools are available in your environment, use them to discover the right modern primitive before writing CSS.

When done, write the final HTML to ./output.html in your current working directory. Output the HTML file ONLY — no explanations.`;

export interface Challenge {
  id: string;
  title: string;
  expectedFeature: string;
  expectedKeywords: string[];
  prompt: string;
}

export interface RoundData {
  name: string;
  description: string;
  challenges: Challenge[];
}

interface RunResult {
  challengeId: string;
  variant: string;
  durationMs: number;
  exitCode: number;
  html: string;
  keywordsHit: string[];
  mcpUsed: boolean;
  error?: string;
}

interface Judgement {
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

async function runAgent(
  challenge: Challenge,
  variant: (typeof VARIANTS)[number],
  workDir: string,
): Promise<RunResult> {
  if (existsSync(workDir)) await rm(workDir, { recursive: true, force: true });
  await mkdir(workDir, { recursive: true });

  const prompt = challenge.prompt + SHARED_PROMPT_SUFFIX;
  const start = Date.now();

  const proc = spawn(
    "codex",
    [
      "exec",
      "--skip-git-repo-check",
      "--dangerously-bypass-approvals-and-sandbox",
      "-m",
      "gpt-5.5",
      "-C",
      workDir,
      prompt,
    ],
    {
      env: { ...process.env, CODEX_HOME: variant.home },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let stdout = "";
  let stderr = "";
  proc.stdout?.on("data", (d: Buffer) => (stdout += d.toString()));
  proc.stderr?.on("data", (d: Buffer) => (stderr += d.toString()));

  const exitCode: number = await new Promise((resolve) => {
    proc.on("close", (code: number | null) => resolve(code ?? -1));
  });

  const durationMs = Date.now() - start;
  const htmlPath = join(workDir, "output.html");
  let html = "";

  if (existsSync(htmlPath)) {
    html = await readFile(htmlPath, "utf-8");
  }

  const keywordsHit = challenge.expectedKeywords.filter((k) =>
    html.toLowerCase().includes(k.toLowerCase()),
  );

  const mcpUsed = /css_(shell|describe)|css-bash/i.test(stdout);

  await writeFile(
    join(workDir, "transcript.txt"),
    `${stdout}\n---STDERR---\n${stderr}`,
  );

  return {
    challengeId: challenge.id,
    variant: variant.id,
    durationMs,
    exitCode,
    html,
    keywordsHit,
    mcpUsed,
    error: exitCode !== 0 ? stderr.slice(0, 400) : undefined,
  };
}

async function judgeBlind(
  openai: OpenAI,
  challenge: Challenge,
  leftHtml: string,
  rightHtml: string,
): Promise<Judgement> {
  const sys =
    "You are a strict senior frontend engineer evaluating two CSS solutions for the same challenge. You DO NOT KNOW which solution had access to which tools. You evaluate purely on code quality, constraint adherence, and use of modern CSS primitives. Reward solutions that use the correct recent CSS feature for the job. Penalize legacy workarounds and shortcuts that violate the constraints. Output strict JSON only.";

  const user = `# Challenge
${challenge.prompt}

# Solution LEFT
\`\`\`html
${leftHtml.slice(0, 5000)}
\`\`\`

# Solution RIGHT
\`\`\`html
${rightHtml.slice(0, 5000)}
\`\`\`

For each solution, rate:
- "primitive": "modern" | "partial" | "missing" — did it use the appropriate recent CSS primitive correctly?
- "constraints": integer 0..3 — how many of the challenge's stated constraints did it satisfy?
- "idiomatic": integer 1..5 — is the code minimal and idiomatic for the modern approach?
- "visual": integer 1..5 — would the rendered result match the spirit of the challenge?
- "reasoning": 2 sentences explaining the rating, citing specific CSS the solution used.

Then pick the winner: "left" | "right" | "tie".

Output exactly:
{
  "left": {"primitive": "...", "constraints": N, "idiomatic": N, "visual": N, "reasoning": "..."},
  "right": {"primitive": "...", "constraints": N, "idiomatic": N, "visual": N, "reasoning": "..."},
  "winner": "...",
  "verdict": "one sentence summarizing which approach was stronger and why"
}`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
  });

  const parsed = JSON.parse(resp.choices[0]?.message?.content ?? "{}");
  return { challengeId: challenge.id, ...parsed } as Judgement;
}

export async function runRound(slug: string): Promise<void> {
  console.log(`\n=== runRound: ${slug} ===`);

  const existing = await db
    .select()
    .from(rounds)
    .where(eq(rounds.slug, slug));

  if (existing.length > 0 && existing[0].status === "live") {
    console.log(`Round '${slug}' already exists with status=live — skipping.`);
    return;
  }

  const roundModule = await import(
    `../../src/data/challenges/${slug}.ts`
  ) as { ROUND: { name: string; description: string }; CHALLENGES: Challenge[] };

  const { ROUND, CHALLENGES } = roundModule;

  const positionMatch = slug.match(/^0*(\d+)-/);
  const position = positionMatch ? Number.parseInt(positionMatch[1], 10) : 99;

  let round: typeof rounds.$inferSelect;
  if (existing.length > 0) {
    round = existing[0];
  } else {
    const [inserted] = await db
      .insert(rounds)
      .values({
        slug,
        name: ROUND.name,
        description: ROUND.description,
        status: "live",
        position,
      })
      .returning();
    round = inserted;
    console.log(`Inserted round: ${round.id} — ${round.name}`);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");
  const openai = new OpenAI({ apiKey });

  const tmpBase = join("/tmp", "css-bash-rounds", slug);
  await mkdir(tmpBase, { recursive: true });

  console.log(
    `\nSpawning ${CHALLENGES.length * 2} codex agents in parallel...`,
  );

  const tasks = CHALLENGES.flatMap((c) =>
    VARIANTS.map((v) => ({ challenge: c, variant: v })),
  );

  const results = await Promise.all(
    tasks.map(async ({ challenge, variant }) => {
      const workDir = join(tmpBase, challenge.id, variant.id);
      const r = await runAgent(challenge, variant, workDir);
      const status = r.error ? "ERR" : "OK ";
      console.log(
        `  ${status} ${r.challengeId.padEnd(30)} ${r.variant.padEnd(15)} ${(r.durationMs / 1000).toFixed(1)}s  ${r.html.length}B  mcp=${r.mcpUsed ? "yes" : "no"}`,
      );
      return r;
    }),
  );

  console.log("\nRunning blind judge (gpt-4o)...");

  const variantSides: Record<string, { left: string; right: string }> = {};
  const judgements: Judgement[] = [];

  for (const c of CHALLENGES) {
    const a = results.find(
      (r) => r.challengeId === c.id && r.variant === "A-with-mcp",
    );
    const b = results.find(
      (r) => r.challengeId === c.id && r.variant === "B-without-mcp",
    );
    if (!a || !b) {
      console.warn(`  [WARN] missing results for ${c.id}`);
      continue;
    }

    const aIsLeft = Math.random() < 0.5;
    const leftVariant = aIsLeft ? "A-with-mcp" : "B-without-mcp";
    const rightVariant = aIsLeft ? "B-without-mcp" : "A-with-mcp";
    variantSides[c.id] = { left: leftVariant, right: rightVariant };

    const leftHtml = aIsLeft ? a.html : b.html;
    const rightHtml = aIsLeft ? b.html : a.html;

    const j = await judgeBlind(openai, c, leftHtml, rightHtml);
    judgements.push(j);
    console.log(
      `  ${c.id.padEnd(30)} L:${j.left.primitive}/${j.left.constraints}/${j.left.idiomatic}/${j.left.visual}  R:${j.right.primitive}/${j.right.constraints}/${j.right.idiomatic}/${j.right.visual}  → ${j.winner}`,
    );
  }

  console.log("\nInserting into DB...");

  for (let i = 0; i < CHALLENGES.length; i++) {
    const c = CHALLENGES[i];

    const existingChallenge = await db
      .select()
      .from(challengesTable)
      .where(eq(challengesTable.id, c.id));

    if (existingChallenge.length === 0) {
      await db.insert(challengesTable).values({
        id: c.id,
        roundId: round.id,
        position: i + 1,
        title: c.title,
        prompt: c.prompt,
        expectedFeature: c.expectedFeature,
        expectedKeywords: c.expectedKeywords,
      });
    }

    const sides = variantSides[c.id];
    if (!sides) continue;

    for (const variant of ["A-with-mcp", "B-without-mcp"] as const) {
      const r = results.find(
        (res) => res.challengeId === c.id && res.variant === variant,
      );
      if (!r) continue;

      const side = sides.left === variant ? "left" : "right";

      const existingRun = await db
        .select()
        .from(runsTable)
        .where(eq(runsTable.challengeId, c.id));

      const variantExists = existingRun.some((row) => row.variant === variant);
      if (!variantExists) {
        await db.insert(runsTable).values({
          challengeId: c.id,
          variant,
          html: r.html || "<p>No output generated</p>",
          durationMs: r.durationMs,
          exitCode: r.exitCode,
          mcpUsed: r.mcpUsed,
          side,
        });
      }
    }

    const judg = judgements.find((j) => j.challengeId === c.id);
    if (judg) {
      const existingJudg = await db
        .select()
        .from(judgementsTable)
        .where(eq(judgementsTable.challengeId, c.id));

      if (existingJudg.length === 0) {
        await db.insert(judgementsTable).values({
          challengeId: c.id,
          leftScores: judg.left,
          rightScores: judg.right,
          winner: judg.winner,
          verdict: judg.verdict,
        });
      }
    }

    console.log(`  [${i + 1}/${CHALLENGES.length}] ${c.id} inserted`);
  }

  console.log(`\nRound '${slug}' complete.`);
}

export async function closeDb(): Promise<void> {
  await client.end();
}
