import { db } from "@/db";
import { cardcollection, playersData, SelectPlayersData } from "@/db/schema";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { PlayersSchemaType } from "@/types/players";
import { and, eq, inArray } from "drizzle-orm";
import { PeriodTypes, PlayerData } from "@/interfaces/Interfaces";
import { slugifyName } from "@/utils/slugify-name";

export async function getPlayers(): Promise<SelectPlayersData[]> {
  const players = await db.select().from(playersData);

  return players.map(
    (player): SelectPlayersData => ({
      ...player,
      teams_history:
        typeof player.teams_history === "string"
          ? JSON.parse(player.teams_history)
          : player.teams_history,
      awards:
        typeof player.awards === "string"
          ? JSON.parse(player.awards)
          : player.awards,
    })
  );
}

export async function getPlayersByPeriod(
  period: PeriodTypes
): Promise<SelectPlayersData[]> {
  const players = await db
    .select()
    .from(playersData)
    .where(eq(playersData.period, period));

  return players.map(
    (player): SelectPlayersData => ({
      ...player,
      teams_history:
        typeof player.teams_history === "string"
          ? JSON.parse(player.teams_history)
          : player.teams_history,
      awards:
        typeof player.awards === "string"
          ? JSON.parse(player.awards)
          : player.awards,
    })
  );
}

export async function store1990sPlayers() {
  try {
    const period = "1990s";
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "nba_players_1990s_with_rarity.json"
    );

    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw);

    // 🧹 Étape 1 : Supprimer les anciennes entrées de cette période
    await db.delete(playersData).where(eq(playersData.period, period));
    console.log(`🗑️ Anciennes entrées supprimées pour la période ${period}`);

    // 🧩 Étape 2 : Préparer les nouvelles données
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => ({
      id: uuidv4(),
      name: player.name,
      period,
      position: player.position ?? null,
      teams_history: player.teams_history ?? [],
      face_image_url: player.face_image_url ?? null,
      wikipedia_url: player.wikipedia_url ?? null,
      awards: player.awards ?? [],
      rarity: player.rarity ?? "bronze",
    }));

    // 💾 Étape 3 : Insertion multiple
    const result = await db.insert(playersData).values(playersToInsert);
    console.log(`✅ ${playersToInsert.length} joueurs ajoutés pour ${period}`);

    return result;
  } catch (error) {
    console.error("store1990sPlayers error:", error);
    throw error;
  }
}

export async function store2000sPlayers() {
  try {
    const period = "2000s";
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "nba_players_2000s_with_rarity.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    await db.delete(playersData).where(eq(playersData.period, period));
    console.log(`🗑️ Anciennes entrées supprimées pour la période ${period}`);

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      return {
        id: uuidv4(),
        name: player.name,
        period: "2000s",
        position: player.position ?? null,
        teams_history: player.teams_history ?? [],
        face_image_url: player.face_image_url ?? null,
        wikipedia_url: player.wikipedia_url ?? null,
        awards: player.awards ?? [],
        rarity: player.rarity ?? "bronze",
      };
    });

    // Insertion multiple avec Drizzle
    const result = await db.insert(playersData).values(playersToInsert);

    return result;
  } catch (error) {
    console.error("store2000sPlayers error:", error);
    throw error;
  }
}
export async function store2010sPlayers() {
  try {
    const period = "2010s";
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "nba_players_2010s_with_rarity.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    await db.delete(playersData).where(eq(playersData.period, period));
    console.log(`🗑️ Anciennes entrées supprimées pour la période ${period}`);

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      return {
        id: uuidv4(),
        name: player.name,
        period: "2010s",
        position: player.position ?? null,
        teams_history: player.teams_history ?? [],
        face_image_url: player.face_image_url ?? null,
        wikipedia_url: player.wikipedia_url ?? null,
        awards: player.awards ?? [],
        rarity: player.rarity ?? "bronze",
      };
    });

    // Insertion multiple avec Drizzle
    const result = await db.insert(playersData).values(playersToInsert);

    return result;
  } catch (error) {
    console.error("store2010sPlayers error:", error);
    throw error;
  }
}
export async function store2020sPlayers() {
  try {
    const period = "2020s";
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "nba_players_2020s_enriched.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    await db.delete(playersData).where(eq(playersData.period, period));
    console.log(`🗑️ Anciennes entrées supprimées pour la période ${period}`);

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      return {
        id: uuidv4(),
        name: player.name,
        period: "2020s",
        position: player.position ?? null,
        teams_history: player.teams_history ?? [],
        face_image_url: player.face_image_url ?? null,
        wikipedia_url: player.wikipedia_url ?? null,
        awards: player.awards ?? [],
        rarity: player.rarity ?? "bronze",
      };
    });

    // Insertion multiple avec Drizzle
    const result = await db.insert(playersData).values(playersToInsert);

    return result;
  } catch (error) {
    console.error("store2020sPlayers error:", error);
    throw error;
  }
}

export async function addCardToCollection(
  cardId: string,
  userId: string,
  period: string
) {
  // Vérifie si la carte existe déjà pour cet utilisateur et cette période
  const existing = await db
    .select()
    .from(cardcollection)
    .where(
      and(
        eq(cardcollection.cardId, cardId),
        eq(cardcollection.userId, userId),
        eq(cardcollection.period, period)
      )
    );

  if (existing.length > 0) {
    const current = existing[0];
    const newPossessed = (current.possessed ?? 0) + 1;

    await db
      .update(cardcollection)
      .set({ possessed: newPossessed })
      .where(eq(cardcollection.id, current.id));

    return { success: true, possessed: newPossessed };
  } else {
    await db.insert(cardcollection).values({
      id: uuidv4(),
      cardId,
      userId,
      period,
      possessed: 1,
    });

    return { success: true, possessed: 1 };
  }
}

export async function getUserCards(userId: string) {
  return await db
    .select()
    .from(cardcollection)
    .where(eq(cardcollection.userId, userId));
}

export async function getUserCardsByPeriod(userId: string, period: string) {
  return await db
    .select()
    .from(cardcollection)
    .where(
      and(eq(cardcollection.userId, userId), eq(cardcollection.period, period))
    );
}

export async function getPlayerBySlug(
  period: string,
  slug: string
): Promise<PlayerData> {
  const validPeriods: PeriodTypes[] = ["1990s", "2000s", "2010s", "2020s"];

  if (!validPeriods.includes(period as PeriodTypes)) {
    throw new Error(`Invalid period "${period}"`);
  }

  const players = await db
    .select()
    .from(playersData)
    .where(eq(playersData.period, period as PeriodTypes));

  const player = players.find((p) => slugifyName(p.name) === slug);

  if (!player) {
    throw new Error(
      `Player not found for slug "${slug}" and period "${period}"`
    );
  }

  return player;
}

export async function getCardsByIds(cardIds: string[]): Promise<PlayerData[]> {
  if (cardIds.length === 0) return [];

  const cards = await db
    .select()
    .from(playersData)
    .where(inArray(playersData.id, cardIds));

  return cards;
}
