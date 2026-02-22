import { pgTable, uuid, bigint, varchar, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const reviewStatus = pgEnum('status', ["pending", "running", "completed", "failed"]);

export const reviews = pgTable('reviews', (t) => ({
  id: t.uuid('id').defaultRandom().primaryKey(),
  pr_id: t.bigint('pr_id', { mode: "number" }).notNull(),
  pr_title: t.varchar('pr_title').notNull(),
  pr_url: t.text('pr_url').notNull(),
  pr_opened: t.boolean().notNull(),
  repo_id: t.bigint('repo_id', { mode: "number" }).notNull(),
  status: reviewStatus('status'),
  review: t.text('review'),
  created_at: t.timestamp().defaultNow().notNull()
}));
