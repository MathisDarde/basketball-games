import { db } from "@/app/db";
import { cardcollection, playersData } from "@/app/db/schema";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { PlayersSchemaType } from "@/types/players";
import { eq } from "drizzle-orm";

export const getPlayers = async () => {
  return db
    .select()
    .from(playersData)
    .then((players) =>
      players.map((player) => ({
        ...player,
      }))
    );
};

export const storePlayers = async () => {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "player_data_teams_pics.json"
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    const playersArray = JSON.parse(raw); // Tableau d'objets joueurs

    // Prépare un tableau d'insertions
    const playersToInsert = playersArray.map((player: PlayersSchemaType) => ({
      id: uuidv4(),
      name: player.name,
      position: player.position,
      number: Number(player.number),
      teams_history: player.teams_history ?? [],
      image_link: player.image_link ?? "",
      wikipedia_url: player.wikipedia_url,
      awards: player.awards ?? [],
    }));

    // Insertion multiple avec Drizzle
    const result = await db.insert(playersData).values(playersToInsert);

    return result;
  } catch (error) {
    console.error("storePlayers error:", error);
    throw error;
  }
};

export const addCardToCollection = async (cardId: string, userId: string) => {
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
};

export const getUserCards = async (userId: string) => {
  return await db
    .select()
    .from(cardcollection)
    .where(eq(cardcollection.userId, userId));
};
