"use server";

import { createDailyDraw } from "@/controllers/DailyDrawController";
import { PlayerData } from "@/interfaces/Interfaces";

const createDailyDrawServer = async (
  userId: string,
  allPlayers: PlayerData[],
  period: string,
  role: string
): Promise<{ players: PlayerData[]; period: string;}> => {
  try {
    const cards = await createDailyDraw(userId, allPlayers, period, role);
    return cards;
  } catch (error) {
    console.error("createDailyDraw error:", error);
    return { players: [], period };
  }
};

export default createDailyDrawServer;
