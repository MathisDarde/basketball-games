"use server";

import { db } from "@/db";
import { SelectCareerPathSessions, careerpath_sessions } from "@/db/schema";
import { and, desc, eq, max, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getSessions(): Promise<SelectCareerPathSessions[]> {
  return db.select().from(careerpath_sessions);
}

export async function getSessionsbyUserId(
  userId: SelectCareerPathSessions["userId"]
): Promise<SelectCareerPathSessions[]> {
  return db
    .select()
    .from(careerpath_sessions)
    .where(eq(careerpath_sessions.userId, userId));
}

export async function storeSession(
  userId: string,
  playerId: string,
  period: string,
  correct: boolean,
  attempts: number,
  streak: number,
  difficulty: string
): Promise<SelectCareerPathSessions[]> {
  const newSession = {
    id: uuidv4(),
    userId,
    playerId,
    period,
    correct,
    attempts,
    streak,
    difficulty,
    playedAt: new Date(),
  };

  await db.insert(careerpath_sessions).values(newSession);

  const sessions = await db
    .select()
    .from(careerpath_sessions)
    .where(eq(careerpath_sessions.userId, userId));

  return sessions;
}

export async function getLastStreak(userId: string | null, period: string) {
  if (!userId) return 0;

  const lastGame = await db
    .select()
    .from(careerpath_sessions)
    .where(
      and(
        eq(careerpath_sessions.userId, userId),
        eq(careerpath_sessions.period, period)
      )
    )
    .orderBy(desc(careerpath_sessions.playedAt))
    .limit(1);

  return lastGame.length ? lastGame[0].streak : 0;
}

export async function getUserPTHighestStreak(userId: string | null) {
  if (!userId) return 0;

  const result = await db
    .select({
      highestStreak: max(careerpath_sessions.streak),
    })
    .from(careerpath_sessions)
    .where(eq(careerpath_sessions.userId, userId));

  return result[0]?.highestStreak ?? 0;
}

export async function getUserGamesCount(userId: string | null) {
  if (!userId) return 0;

  const result = await db
    .select({
      gamesCount: sql<number>`COUNT(*)`.as("gamesCount"),
    })
    .from(careerpath_sessions)
    .where(eq(careerpath_sessions.userId, userId));

  return result[0]?.gamesCount ?? 0;
}
