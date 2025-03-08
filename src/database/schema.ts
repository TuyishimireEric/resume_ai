// drizzle/schema.ts
import {
  pgTable,
  text,
  varchar,
  uuid,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }),
  email: text("email").unique(),
  password: text("password"),
  image: text("image"),
  role: varchar("role", { length: 30 }),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  required_staff: text("required_staff"),
  requirements: text("requirements"),
  location: text("location"),
  open_date: text("open_date"),
  close_date: text("close_date"),
  created_by: uuid("created_by")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  user_name: varchar("user_name", { length: 255 }),
  user_email: text("user_email").notNull(),
  job_id: uuid("job_id")
    .references(() => jobs.id, { onDelete: "cascade" })
    .notNull(),
  status: varchar("status", { length: 30 }),
  match_score: text("match_score"),
  resume_url: text("resume_url"),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
}, (table) => ({
  uniqueApplication: unique().on(table.user_email, table.job_id),
}));


export const session = pgTable("session", {
  session_token: varchar("session_token").primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  expires: timestamp("expires").notNull(),
});

export const accounts = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 })
    .$type<AdapterAccount["type"]>()
    .notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  idToken: text("id_token"),
  sessionState: varchar("session_state", { length: 255 }),
});
