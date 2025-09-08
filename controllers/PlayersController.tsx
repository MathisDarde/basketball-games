import { db } from "@/db";
import { cardcollection, playersData, SelectPlayersData } from "@/db/schema";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { PlayersSchemaType } from "@/types/players";
import { eq } from "drizzle-orm";
import { PeriodTypes } from "@/interfaces/Interfaces";

export async function getPlayers(
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
      "1990sdata.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      const parsedNumber = Number(player.number);
      return {
        id: uuidv4(),
        name: player.name,
        period: "1990s",
        position: player.position ?? null,
        number: isNaN(parsedNumber) ? null : parsedNumber,
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
      "2000sdata.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      const parsedNumber = Number(player.number);
      return {
        id: uuidv4(),
        name: player.name,
        period: "2000s",
        position: player.position ?? null,
        number: isNaN(parsedNumber) ? null : parsedNumber,
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
      "2010sdata.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      const parsedNumber = Number(player.number);
      return {
        id: uuidv4(),
        name: player.name,
        period: "2010s",
        position: player.position ?? null,
        number: isNaN(parsedNumber) ? null : parsedNumber,
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
      "2020sdata.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => {
      const parsedNumber = Number(player.number);
      return {
        id: uuidv4(),
        name: player.name,
        period: "2020s",
        position: player.position ?? null,
        number: isNaN(parsedNumber) ? null : parsedNumber,
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

export async function addCardToCollection(cardId: string, userId: string) {
  const data = { id: uuidv4(), cardId, userId };

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
