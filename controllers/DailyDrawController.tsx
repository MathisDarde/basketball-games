import { db } from "@/db";
import { dailydraws } from "@/db/schema";
import { PlayerData } from "@/interfaces/Interfaces";
import { getRandomPlayers } from "@/utils/get-random-players";
import { eq } from "drizzle-orm";
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

  const existing = await db
    .select()
    .from(dailydraws)
    .where(eq(dailydraws.userId, userId));

  const todayDraw = existing.find(
    (r) => r.date.toISOString().split("T")[0] === todayStr
  );

  if (todayDraw) {
    const selected = allPlayers.filter((p) =>
      todayDraw.playersId.includes(p.id)
    );
    return {
      players: selected,
      flippedIds: todayDraw.flippedId,
    };
  }

  // Si pas de tirage aujourd’hui, ne rien renvoyer (pas de création)
  return { players: [], flippedIds: [] };
}

export async function createDailyDraw(
  userId: string,
  allPlayers: PlayerData[]
) {
  if (allPlayers.length === 0) return { players: [], flippedIds: [] };

  const todayStr = new Date().toISOString().split("T")[0];

  const randomPlayers = getRandomPlayers({
    numberPlayers: 10,
    players: allPlayers,
  });

  const playerIds = randomPlayers.map((p) => p.id);

  await db.insert(dailydraws).values({
    id: uuidv4(),
    userId,
    date: new Date(todayStr),
    playersId: playerIds,
    flippedId: [],
  });

  return {
    players: randomPlayers,
    flippedIds: [],
  };
}

export async function flipCard(userId: string, playerId: string) {
  const todayStr = new Date().toISOString().split("T")[0];

  const draws = await db
    .select()
    .from(dailydraws)
    .where(eq(dailydraws.userId, userId));

  const draw = draws.find(
    (d) => d.date.toISOString().split("T")[0] === todayStr
  );
  if (!draw || draw.flippedId.includes(playerId)) return;

  await db
    .update(dailydraws)
    .set({
      flippedId: [...draw.flippedId, playerId],
    })
    .where(eq(dailydraws.id, draw.id));

  await storeCardInCollection(playerId, userId);
}
