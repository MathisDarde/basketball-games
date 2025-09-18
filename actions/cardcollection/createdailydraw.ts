"use server";

import { createDailyDraw } from "@/controllers/DailyDrawController";
import { PlayerData } from "@/interfaces/Interfaces";

const createDailyDrawServer = async (
  userId: string,
  allPlayers: PlayerData[],
  period: string
): Promise<{ players: PlayerData[]; flippedIds: string[]; period: string; }> => {
  try {
    const cards = await createDailyDraw(userId, allPlayers, period);
    return cards;
  } catch (error) {
    console.error("createDailyDraw error:", error);
    return { players: [], flippedIds: [], period };
  }
};

export default createDailyDrawServer;
