"use server"

import { db } from "@/db";
import { SelectPlayTogetherSessions, playtogether_sessions } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getSessions(): Promise<
    SelectPlayTogetherSessions[]
> {
    return db.select().from(playtogether_sessions)
}

export async function getSessionsbyUserId(userId: SelectPlayTogetherSessions["userId"]): Promise<SelectPlayTogetherSessions[]> {
    return db.select().from(playtogether_sessions).where(eq(playtogether_sessions.userId, userId))
}

export async function storeSession(userId: string, period: string, correct: boolean, streak: number ): Promise<
    SelectPlayTogetherSessions[]
> {
    const newSession = {
        id: uuidv4(),
        userId,
        period,
        correct,
        streak,
        playedAt: new Date()
      };

      await db.insert(playtogether_sessions).values(newSession);

      const sessions = await db
        .select()
        .from(playtogether_sessions)
        .where(eq(playtogether_sessions.userId, userId))
    
      return sessions;
}

export async function getLastStreak(userId: string | null, period: string) {
    if (!userId) return 0;
    
    const lastGame = await db
      .select()
      .from(playtogether_sessions)
      .where(
        and(
          eq(playtogether_sessions.userId, userId),
          eq(playtogether_sessions.period, period)
        )
      )
      .orderBy(desc(playtogether_sessions.playedAt))
      .limit(1);
  
    return lastGame.length ? lastGame[0].streak : 0;
  }