"use server";

import { getPlayersByPeriod } from "@/controllers/PlayersController";
import { PeriodTypes } from "@/interfaces/Interfaces";

const getAllPlayers = async (period: PeriodTypes) => {
  try {
    const players = await getPlayersByPeriod(period);
    return players;
  } catch (error) {
    console.error("getAllPlayers error:", error);
    return {
      success: false,
      message: "An error was encountered during the recup.",
    };
  }
};

export default getAllPlayers;
