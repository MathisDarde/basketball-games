import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
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

export const playersData = pgTable("playersData", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  number: integer("number").notNull(),
  teams_history: jsonb("teams_history").notNull(), // JSON array of { period, team }
  image_link: text("image_link").notNull(),
  wikipedia_url: text("wikipedia_url").notNull(),
  awards: jsonb("awards").notNull().default("[]"), // JSON array of strings
});

export const highscores = pgTable("highscores", {
  id: text("id").primaryKey(),
  game: text("game").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  highscore: integer("score").notNull().default(0),
});

export const schema = {
  user,
  session,
  account,
  verification,
  playersData,
  highscores,
};

export type SelectUser = typeof user.$inferSelect;
