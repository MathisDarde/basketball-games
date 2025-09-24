import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  profilepicture: text("profilepicture"),
  favorite_team: text("favorite_team").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  admin: boolean("admin").default(false),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

type TeamHistoryEntry = {
  period: string;
  team: string;
};

type PeriodType = "1990s" | "2000s" | "2010s" | "2020s";

export const playersData = pgTable("playersData", {
  id: text("id").primaryKey(),
  period: text("period").$type<PeriodType>().notNull(),
  name: text("name").notNull(),
  position: text("position"),
  teams_history: jsonb("teams_history").$type<TeamHistoryEntry[]>().notNull(),
  image_link: text("image_link"),
  wikipedia_url: text("wikipedia_url").notNull(),
  awards: jsonb("awards")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
});

export const cardcollection = pgTable("cardcollection", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cardId: text("cardId")
    .notNull()
    .references(() => playersData.id, { onDelete: "cascade" }),
  period: text("period").notNull(),
  possessed: integer("possessed").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailydraws = pgTable("dailydraws", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  period: text("period").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const dailydraws_players = pgTable(
  "dailydraws_players",
  {
    dailydrawId: text("dailydrawId")
      .notNull()
      .references(() => dailydraws.id, { onDelete: "cascade" }),
    playerId: text("playerId")
      .notNull()
      .references(() => playersData.id, { onDelete: "cascade" }),
    flipped: boolean("flipped").notNull().default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.dailydrawId, table.playerId] }),
  })
);

export const playtogether_sessions = pgTable("playtogether_sessions", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  period: text("period").notNull(),
  correct: boolean("correct").notNull(),
  streak: integer("streak").notNull(),
  difficulty: text("difficulty").notNull(),
  playedAt: timestamp("playedAt").notNull().defaultNow(),
});

export const careerpath_sessions = pgTable("careerpath_sessions", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  playerId: text("playerId")
    .notNull()
    .references(() => playersData.id, { onDelete: "cascade" }),
  difficulty: text("difficulty").notNull(),
  period: text("period").notNull(),
  correct: boolean("correct").notNull(),
  attempts: integer("attempts").notNull(),
  streak: integer("streak").notNull(),
  playedAt: timestamp("playedAt").notNull().defaultNow(),
});

export const schema = {
  user,
  session,
  account,
  verification,
  playersData,
  cardcollection,
  dailydraws,
};

export type SelectUser = typeof user.$inferSelect;

export type SelectPlayersData = typeof playersData.$inferSelect;

export type SelectCardCollection = typeof cardcollection.$inferSelect;

export type SelectDailyDraws = typeof dailydraws.$inferSelect;

export type SelectPlayTogetherSessions =
  typeof playtogether_sessions.$inferSelect;

export type SelectCareerPathSessions = typeof careerpath_sessions.$inferSelect;
