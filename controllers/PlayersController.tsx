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
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "nba_players_1990s_enriched.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      return {
        id: uuidv4(),
        name: player.name,
        period: "1990s",
        position: player.position,
        teams_history: player.teams_history ?? [],
        image_link: player.image_link ?? null,
        wikipedia_url: player.wikipedia_url ?? null,
        awards: player.awards ?? [],
      };
    });

    // Insertion multiple avec Drizzle
    const result = await db.insert(playersData).values(playersToInsert);

    return result;
  } catch (error) {
    console.error("store1990sPlayers error:", error);
    throw error;
  }
}
export async function store2000sPlayers() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "nba_players_2000s_enriched.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      return {
        id: uuidv4(),
        name: player.name,
        period: "2000s",
        position: player.position ?? null,
        teams_history: player.teams_history ?? [],
        image_link: player.image_link ?? null,
        wikipedia_url: player.wikipedia_url ?? null,
        awards: player.awards ?? [],
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
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "nba_players_2010s_enriched.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      return {
        id: uuidv4(),
        name: player.name,
        period: "2010s",
        position: player.position ?? null,
        teams_history: player.teams_history ?? [],
        image_link: player.image_link ?? null,
        wikipedia_url: player.wikipedia_url ?? null,
        awards: player.awards ?? [],
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
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "nba_players_2020s_enriched.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      return {
        id: uuidv4(),
        name: player.name,
        period: "2020s",
        position: player.position ?? null,
        teams_history: player.teams_history ?? [],
        image_link: player.image_link ?? null,
        wikipedia_url: player.wikipedia_url ?? null,
        awards: player.awards ?? [],
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
  const data = { id: uuidv4(), cardId, userId, period };

  await db.insert(cardcollection).values(data);

  const [current] = await db
    .select({ possessed: cardcollection.possessed })
    .from(cardcollection)
    .where(eq(cardcollection.cardId, cardId));

  const newPossessed = (current?.possessed ?? 0) + 1;

  await db
    .update(cardcollection)
    .set({
      possessed: newPossessed,
    })
    .where(eq(cardcollection.cardId, cardId));

  return { success: true };
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

export async function getPlayerBySlug(period: string, slug: string): Promise<PlayerData> {
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
    throw new Error(`Player not found for slug "${slug}" and period "${period}"`);
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