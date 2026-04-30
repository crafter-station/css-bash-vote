import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { eq, and, inArray } from "drizzle-orm";
import OpenAI from "openai";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  challenges as challengesTable,
  judgements as judgementsTable,
  runs as runsTable,
  votes as votesTable,
} from "../src/db/schema.ts";
import * as schema from "../src/db/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");

const pg = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(pg, { schema });

const HOME_WITH_MCP = "/tmp/css-bash-demo/codex-with-mcp";
const HOME_WITHOUT_MCP = "/tmp/css-bash-demo/codex-without-mcp";

const VARIANTS = [
  { id: "A-with-mcp" as const, home: HOME_WITH_MCP },
  { id: "B-without-mcp" as const, home: HOME_WITHOUT_MCP },
] as const;

const SHARED_PROMPT_SUFFIX = `

You may have access to a "css-bash" MCP server with tools like \`intent\`, \`baseline\`, \`support\`, \`whatsnew\`, \`recipe\`, and \`view\`, plus a virtual filesystem of CSS features. If those tools are available in your environment, use them to discover the right modern primitive before writing CSS.

When done, write the final HTML to ./output.html in your current working directory. Output the HTML file ONLY — no explanations.`;

interface Challenge {
  id: string;
  title: string;
  expectedFeature: string;
  expectedKeywords: string[];
  prompt: string;
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

async function reRunChallenge(challengeId: string): Promise<void> {
  console.log(`\n=== re-run: ${challengeId} ===`);

  const existingChallenge = await db
    .select()
    .from(challengesTable)
    .where(eq(challengesTable.id, challengeId));

  if (existingChallenge.length === 0) {
    throw new Error(`Challenge ${challengeId} not found in DB`);
  }

  const isLegacyRound1 = /^\d{2}-[a-z]/.test(challengeId) && !/^\d{2}-\d{2}-/.test(challengeId);

  let challenge: Challenge | undefined;
  if (isLegacyRound1) {
    const legacy = await import("../src/data/challenges.ts") as { CHALLENGES: Challenge[] };
    challenge = legacy.CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      throw new Error(`Challenge ${challengeId} not found in legacy challenges.ts`);
    }
  } else {
    const roundSlug = challengeId.slice(0, 2) === "02"
      ? "02-animations-motion"
      : challengeId.slice(0, 2) === "03"
      ? "03-forms-inputs"
      : challengeId.slice(0, 2) === "04"
      ? "04-color-theming"
      : challengeId.slice(0, 2) === "05"
      ? "05-typography-text"
      : "06-responsive-container";

    const roundModule = await import(
      `../src/data/challenges/${roundSlug}.ts`
    ) as { CHALLENGES: Challenge[] };

    challenge = roundModule.CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      throw new Error(`Challenge ${challengeId} not found in TS file for round ${roundSlug}`);
    }
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const tmpBase = join("/tmp", "css-bash-rerun", challengeId);
  await mkdir(tmpBase, { recursive: true });

  console.log("  Running A-with-mcp and B-without-mcp in parallel...");

  const results = await Promise.all(
    VARIANTS.map(async (variant) => {
      const workDir = join(tmpBase, variant.id);
      const r = await runAgent(challenge, variant, workDir);
      const status = r.error ? "ERR" : "OK ";
      console.log(
        `  ${status} ${r.variant.padEnd(15)} ${(r.durationMs / 1000).toFixed(1)}s  ${r.html.length}B  mcp=${r.mcpUsed ? "yes" : "no"}`,
      );
      return r;
    }),
  );

  const a = results.find((r) => r.variant === "A-with-mcp");
  const b = results.find((r) => r.variant === "B-without-mcp");
  if (!a || !b) throw new Error("Missing run results");

  console.log("  Running blind judge...");
  const aIsLeft = Math.random() < 0.5;
  const leftVariant = aIsLeft ? "A-with-mcp" : "B-without-mcp";
  const rightVariant = aIsLeft ? "B-without-mcp" : "A-with-mcp";
  const leftHtml = aIsLeft ? a.html : b.html;
  const rightHtml = aIsLeft ? b.html : a.html;

  const judg = await judgeBlind(openai, challenge, leftHtml, rightHtml);
  console.log(
    `  L:${judg.left.primitive}/${judg.left.constraints}/${judg.left.idiomatic}/${judg.left.visual}  R:${judg.right.primitive}/${judg.right.constraints}/${judg.right.idiomatic}/${judg.right.visual}  → ${judg.winner}`,
  );

  console.log("  Updating DB...");

  await db
    .update(challengesTable)
    .set({
      title: challenge.title,
      prompt: challenge.prompt,
      expectedFeature: challenge.expectedFeature,
      expectedKeywords: challenge.expectedKeywords,
    })
    .where(eq(challengesTable.id, challengeId));

  await db
    .delete(runsTable)
    .where(eq(runsTable.challengeId, challengeId));

  await db
    .delete(judgementsTable)
    .where(eq(judgementsTable.challengeId, challengeId));

  for (const variant of VARIANTS) {
    const r = results.find((res) => res.variant === variant.id);
    if (!r) continue;
    const side = (variant.id === "A-with-mcp") === aIsLeft ? "left" : "right";
    await db.insert(runsTable).values({
      challengeId,
      variant: variant.id,
      html: r.html || "<p>No output generated</p>",
      durationMs: r.durationMs,
      exitCode: r.exitCode,
      mcpUsed: r.mcpUsed,
      side,
    });
  }

  await db.insert(judgementsTable).values({
    challengeId,
    leftScores: judg.left,
    rightScores: judg.right,
    winner: judg.winner,
    verdict: judg.verdict,
  });

  console.log(`  Done: ${challengeId}`);
}

const challengeId = process.argv[2];
if (!challengeId) {
  console.error("Usage: bun scripts/re-run-challenge.ts <challenge-id>");
  process.exit(1);
}

reRunChallenge(challengeId)
  .catch((err) => {
    console.error("FATAL:", err);
    process.exit(1);
  })
  .finally(() => pg.end());
