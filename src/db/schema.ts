import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const rounds = pgTable("rounds", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 16 }).notNull().default("live"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challenges = pgTable("challenges", {
  id: varchar("id", { length: 64 }).primaryKey(),
  roundId: integer("round_id")
    .notNull()
    .references(() => rounds.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  prompt: text("prompt").notNull(),
  expectedFeature: varchar("expected_feature", { length: 64 }).notNull(),
  expectedKeywords: jsonb("expected_keywords").$type<string[]>().notNull(),
});

export const runs = pgTable(
  "runs",
  {
    id: serial("id").primaryKey(),
    challengeId: varchar("challenge_id", { length: 64 })
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    variant: varchar("variant", { length: 32 }).notNull(),
    html: text("html").notNull(),
    durationMs: integer("duration_ms"),
    exitCode: integer("exit_code"),
    mcpUsed: boolean("mcp_used").default(false),
    side: varchar("side", { length: 8 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueRunPerVariant: uniqueIndex("uniq_challenge_variant").on(
      t.challengeId,
      t.variant,
    ),
  }),
);

export const judgements = pgTable("judgements", {
  challengeId: varchar("challenge_id", { length: 64 })
    .primaryKey()
    .references(() => challenges.id, { onDelete: "cascade" }),
  leftScores: jsonb("left_scores")
    .$type<{
      primitive: string;
      constraints: number;
      idiomatic: number;
      visual: number;
      reasoning: string;
    }>()
    .notNull(),
  rightScores: jsonb("right_scores")
    .$type<{
      primitive: string;
      constraints: number;
      idiomatic: number;
      visual: number;
      reasoning: string;
    }>()
    .notNull(),
  winner: varchar("winner", { length: 8 }).notNull(),
  verdict: text("verdict").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable(
  "votes",
  {
    userId: varchar("user_id", { length: 64 }).notNull(),
    challengeId: varchar("challenge_id", { length: 64 })
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    choice: varchar("choice", { length: 8 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.challengeId] }),
  }),
);
