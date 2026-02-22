import { sub } from "date-fns";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, pgEnum } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const repositories=pgTable('repositories',(t)=>({
  id:t.bigint("id",{mode:"number"}).primaryKey(),
  name:t.text().notNull(),
  full_name:t.text().notNull(),
  private:t.boolean().notNull(),
  installation_id:t.bigint('installation_id',{mode:"number"}).notNull().references(()=>installations.id,{onDelete:'cascade'}),
  created_at:t.timestamp('created_at').defaultNow().notNull()
}))

export const installations=pgTable("installations",(t)=>({
  id:t.bigint("id",{mode:"number"}).primaryKey(),
  account_login:t.text('account_login').notNull(),
  account_id:t.bigint('account_id',{mode:'number'}).notNull(),
  created_at:t.timestamp('created_at').defaultNow().notNull()
}))

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const reviewStatus=pgEnum('status',["pending","running","completed","failed"])
export const reviews=pgTable('reviews',(t)=>({
  id:t.uuid('id').defaultRandom().primaryKey(),
  pr_id:t.bigint('pr_id',{mode:"number"}).notNull(),
  pr_title:t.varchar('pr_title').notNull(),
  pr_url:t.text('pr_url').notNull(),
  pr_opened:t.boolean().notNull(),
  repo_id:t.bigint('repo_id',{mode:"number"}).notNull(),
  status:reviewStatus('status'),
  review:t.text('review'),
  created_at:t.timestamp().defaultNow().notNull()
})) 


export const planEnum=pgEnum('plan_enum',['free','pro','enterprise'])
export const subscriptionStatusEnum=pgEnum('subscription_status_enum',['active','on_hold','cancelled','expired','pending' ,'paused','failed'])
export const subscriptions=pgTable('subscriptions',(t)=>({
  id:t.uuid('id').defaultRandom().primaryKey(),
  user_id:t.text('user_id').notNull().references(()=>user.id,{onDelete:'cascade'}),
  subscription_id:t.text('subscription_id').notNull(),
  product_id:t.text('product_id').notNull(),
  plan:planEnum('plan').notNull(),
  created_at:t.timestamp().defaultNow().notNull(),
  status: subscriptionStatusEnum('status').notNull(),
  cancelled_at:t.timestamp('cancelled_at'),
  next_billing_date:t.timestamp('current_period_end'),
  cancel_at_next_billing_date:t.boolean().notNull(),
}))