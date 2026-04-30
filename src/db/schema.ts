import { pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

export const votes = pgTable(
  "votes",
  {
    userId: varchar("user_id", { length: 64 }).notNull(),
    challengeId: varchar("challenge_id", { length: 64 }).notNull(),
    choice: varchar("choice", { length: 8 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.challengeId] }),
  }),
);
