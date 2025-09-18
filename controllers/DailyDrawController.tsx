import { db } from "@/db";
import { dailydraws, dailydraws_players } from "@/db/schema";
import { PlayerData } from "@/interfaces/Interfaces";
import { getRandomPlayers } from "@/utils/get-random-players";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import storeCardInCollection from "@/actions/cardcollection/addcardtocollection";

export async function getDailyDraw(
  userId: string,
  allPlayers: PlayerData[]
): Promise<{
  players: PlayerData[];
  flippedIds: string[];
}> {
  const todayStr = new Date().toISOString().split("T")[0];

  const todayDraw = await db
    .select()
    .from(dailydraws)
    .where(eq(dailydraws.userId, userId))
    .then((draws) =>
      draws.find((r) => r.date.toISOString().split("T")[0] === todayStr)
    );

  if (!todayDraw) {
    return { players: [], flippedIds: [] };
  }

  const drawPlayers = await db
    .select()
    .from(dailydraws_players)
    .where(eq(dailydraws_players.dailydrawId, todayDraw.id));

  const selectedPlayers = allPlayers.filter((p) =>
    drawPlayers.some((dp) => dp.playerId === p.id)
  );

  const flippedIds = drawPlayers.filter((dp) => dp.flipped).map((dp) => dp.playerId);

  return { players: selectedPlayers, flippedIds };
}

export async function createDailyDraw(
  userId: string,
  allPlayers: PlayerData[]
) {
  if (allPlayers.length === 0) return { players: [], flippedIds: [] };

  const todayStr = new Date().toISOString().split("T")[0];

  const existingDraw = await db
    .select()
    .from(dailydraws)
    .where(eq(dailydraws.userId, userId))
    .then((draws) =>
      draws.find((r) => r.date.toISOString().split("T")[0] === todayStr)
    );

  if (existingDraw) {
    return getDailyDraw(userId, allPlayers);
  }

  const randomPlayers = getRandomPlayers({ numberPlayers: 10, players: allPlayers });

  const drawId = uuidv4();

  await db.insert(dailydraws).values({
    id: drawId,
    userId,
    date: new Date(todayStr),
    period: randomPlayers[0].period,
  });

  const playersRows = randomPlayers.map((p) => ({
    dailydrawId: drawId,
    playerId: p.id,
    flipped: false,
  }));

  await db.insert(dailydraws_players).values(playersRows);

  return { players: randomPlayers, flippedIds: [] };
}

export async function flipCard(userId: string, playerId: string) {
  const todayStr = new Date().toISOString().split("T")[0];

  const draw = await db
    .select()
    .from(dailydraws)
    .where(eq(dailydraws.userId, userId))
    .then((draws) =>
      draws.find((d) => d.date.toISOString().split("T")[0] === todayStr)
    );

  if (!draw) return;

  const drawPlayer = await db
    .select()
    .from(dailydraws_players)
    .where(eq(dailydraws_players.dailydrawId, draw.id))
    .then((rows) => rows.find((r) => r.playerId === playerId));

  if (!drawPlayer || drawPlayer.flipped) return;

  await db
    .update(dailydraws_players)
    .set({ flipped: true })
    .where(
      and(eq(dailydraws_players.dailydrawId, draw.id), eq(dailydraws_players.playerId, playerId))
    );

  await storeCardInCollection(playerId, userId);
}
