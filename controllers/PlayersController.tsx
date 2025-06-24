import { db } from "@/app/db";
import { playersData } from "@/app/db/schema";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { PlayersSchemaType } from "@/types/players";

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
