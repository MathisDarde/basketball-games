import { db } from "@/db";
import { dailydraws, dailydraws_players } from "@/db/schema";
import { PlayerData } from "@/interfaces/Interfaces";
import { getRandomPlayers } from "@/utils/get-random-players";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import storeCardInCollection from "@/actions/cardcollection/addcardtocollection";

export async function getDailyDraw(
  userId: string,
  allPlayers: PlayerData[],
  period: string,
  isAdmin: boolean | null
): Promise<{
  players: PlayerData[];
  flippedIds: string[];
  period: string;
}> {
  const todayStr = new Date().toISOString().split("T")[0];

  // ✅ Si admin, on ne filtre pas sur la date
  const draws = await db
    .select()
    .from(dailydraws)
    .where(eq(dailydraws.userId, userId));

  const todayDraw = isAdmin
    ? draws[0] // admin : dernier tirage ou aucun
    : draws.find(
        (r) =>
          r.date.toISOString().split("T")[0] === todayStr &&
          r.period === period
      );

  if (!todayDraw) return { players: [], flippedIds: [], period };

  const drawPlayers = await db
    .select()
    .from(dailydraws_players)
    .where(eq(dailydraws_players.dailydrawId, todayDraw.id));

  const selectedPlayers = allPlayers.filter((p) =>
    drawPlayers.some((dp) => dp.playerId === p.id)
  );

  const flippedIds = drawPlayers.filter((dp) => dp.flipped).map((dp) => dp.playerId);

  return { players: selectedPlayers, flippedIds, period };
}

export async function createDailyDraw(
  userId: string,
  allPlayers: PlayerData[],
  period: string,
  isAdmin: boolean | null
): Promise<{ players: PlayerData[]; flippedIds: string[]; period: string }> {
  const todayStr = new Date().toISOString().split("T")[0];

  const draws = await db
    .select()
    .from(dailydraws)
    .where(eq(dailydraws.userId, userId));

  const existingDraw = draws.find(
    (r) =>
      r.date.toISOString().split("T")[0] === todayStr &&
      r.period === period
  );

  // ✅ admin = pas de limite journalière
  if (existingDraw && !isAdmin) {
    return getDailyDraw(userId, allPlayers, period, isAdmin);
  }

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
    flipped: false,
  }));

  await db.insert(dailydraws_players).values(playersRows);

  return { players: randomPlayers, flippedIds: [], period };
}


// remplace ta flipCard par ceci
export async function flipCard(userId: string, playerId: string, period: string) {
  // 1) récupérer tous les tirages de l'utilisateur pour ce period, triés du plus récent au plus ancien
  const draws = await db
    .select()
    .from(dailydraws)
    .where(eq(dailydraws.userId, userId))
    .then((rows) =>
      // filtrer sur le period et trier par date descendante (plus récent en premier)
      rows
        .filter((r) => r.period === period)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
    );

  if (!draws || draws.length === 0) {
    // pas de tirage du tout
    return;
  }

  // 2) trouver le premier draw qui contient le playerId
  let foundDraw = null;
  let foundDrawPlayer = null;

  for (const d of draws) {
    const rows = await db
      .select()
      .from(dailydraws_players)
      .where(eq(dailydraws_players.dailydrawId, d.id))
      .then((rows) => rows);

    const dp = rows.find((r) => r.playerId === playerId);
    if (dp) {
      foundDraw = d;
      foundDrawPlayer = dp;
      break;
    }
  }

  if (!foundDraw || !foundDrawPlayer) {
    // le player n'appartient à aucun des tirages trouvés -> rien à flip
    return;
  }

  // 3) si déjà flip, on retourne
  if (foundDrawPlayer.flipped) return;

  // 4) update la ligne précise (on s'assure d'utiliser dailydrawId + playerId dans le WHERE)
  await db
    .update(dailydraws_players)
    .set({ flipped: true })
    .where(
      and(
        eq(dailydraws_players.dailydrawId, foundDraw.id),
        eq(dailydraws_players.playerId, playerId)
      )
    );

  // 5) maintenant on ajoute la carte à la collection
  await storeCardInCollection(playerId, userId, period);
}

