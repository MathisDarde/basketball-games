"use server";

import { createDailyDraw } from "@/controllers/DailyDrawController";
import { PlayerData } from "@/interfaces/Interfaces";

const createDailyDrawServer = async (
  userId: string,
  allPlayers: PlayerData[]
): Promise<{ players: PlayerData[]; flippedIds: string[] }> => {
  try {
    const cards = await createDailyDraw(userId, allPlayers);
    return cards;
  } catch (error) {
    console.error("createDailyDraw error:", error);
    return { players: [], flippedIds: [] };
  }
};

export default createDailyDrawServer;
