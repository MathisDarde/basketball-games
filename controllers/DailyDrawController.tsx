import { db } from "@/db";
import { dailydraws, dailydraws_players } from "@/db/schema";
import { PlayerData } from "@/interfaces/Interfaces";
import { getRandomPlayers } from "@/utils/get-random-players";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import storeCardInCollection from "@/actions/cardcollection/addcardtocollection";
import getQuotaByRole from "@/actions/cardcollection/getuserquota";

export async function getDailyDraw(
  userId: string,
  allPlayers: PlayerData[],
  period: string,
  role: string
): Promise<{ players: PlayerData[]; period: string }> {
  const todayStr = new Date().toISOString().split("T")[0];

  const drawsToday = await db
    .select()
    .from(dailydraws)
    .where(and(eq(dailydraws.userId, userId), eq(dailydraws.period, period)))
    .then(rows => rows.filter(r => r.date.toISOString().split("T")[0] === todayStr));

  if (drawsToday.length === 0) {
    return { players: [], period }; // Aucun tirage aujourd'hui
  }

  // Récupère le dernier tirage d’aujourd’hui
  const lastDraw = drawsToday[drawsToday.length - 1];

  const drawPlayers = await db
    .select()
    .from(dailydraws_players)
    .where(eq(dailydraws_players.dailydrawId, lastDraw.id));

  // Map sur tous les joueurs pour récupérer les infos complètes
  const playerMap = new Map(allPlayers.map(p => [p.id, p]));
  const players = drawPlayers.map(dp => playerMap.get(dp.playerId)!);

  // ❌ On ne touche plus à storeCardInCollection ici
  // Toutes les cartes sont déjà possédées si le tirage existait

  return { players, period };
}


export async function createDailyDraw(
  userId: string,
  allPlayers: PlayerData[],
  period: string,
  role: string
): Promise<{ players: PlayerData[]; period: string }> {
  const todayStr = new Date().toISOString().split("T")[0];

  // récupère les tirages d'aujourd'hui pour cette période
  const drawsToday = await db
    .select()
    .from(dailydraws)
    .where(and(eq(dailydraws.userId, userId), eq(dailydraws.period, period)))
    .then((rows) => rows.filter((r) => r.date.toISOString().split("T")[0] === todayStr));

  const quota = await getQuotaByRole(role);

  // si quota atteint, retourne le dernier tirage existant
  if (drawsToday.length >= quota) {
    const lastDraw = drawsToday[drawsToday.length - 1];

    const drawPlayers = await db
      .select()
      .from(dailydraws_players)
      .where(eq(dailydraws_players.dailydrawId, lastDraw.id));

    // reconstruction du tirage en gardant les doublons
    const playerMap = new Map(allPlayers.map(p => [p.id, p]));
    const selectedPlayers = drawPlayers.map(dp => playerMap.get(dp.playerId)!);

    // toutes les cartes sont enregistrées dans la collection
    for (const p of selectedPlayers) {
      await storeCardInCollection(p.id, userId, period);
    }

    return { players: selectedPlayers, period };
  }

  // sinon, créer un nouveau tirage
  const randomPlayers = getRandomPlayers({ numberPlayers: 10, players: allPlayers });
  const drawId = uuidv4();

  await db.insert(dailydraws).values({
    id: drawId,
    userId,
    date: new Date(todayStr),
    period,
  });

  const playersRows = randomPlayers.map((p) => ({
    dailydrawId: drawId,
    playerId: p.id,
  }));

  await db.insert(dailydraws_players).values(playersRows);

  // enregistre immédiatement toutes les cartes dans la collection
  for (const p of randomPlayers) {
    await storeCardInCollection(p.id, userId, period);
  }

  return { players: randomPlayers, period };
}

export async function getDrawsCount(userId: string, period: string): Promise<number> {
  const todayStr = new Date().toISOString().split("T")[0];

  const draws = await db
    .select()
    .from(dailydraws)
    .where(eq(dailydraws.userId, userId));

  const todayDraws = draws.filter(
    (d) => d.period === period && d.date.toISOString().split("T")[0] === todayStr
  );

  return todayDraws.length;
}
