"use server";

import { getPlayers } from "@/controllers/PlayersController";

const getAllPlayers = async (period: string) => {
  try {
    const players = await getPlayers(period);
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
