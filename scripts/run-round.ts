#!/usr/bin/env bun
import { closeDb, runRound } from "./lib/run-round.ts";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: bun scripts/run-round.ts <slug>");
  console.error("  e.g. bun scripts/run-round.ts 02-animations-motion");
  process.exit(1);
}

const envPath = `${process.env.HOME}/.config/last30days/.env`;
const fs = await import("node:fs");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

try {
  await runRound(slug);
} finally {
  await closeDb();
}
