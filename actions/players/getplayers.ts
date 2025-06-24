"use server";

import { getPlayers } from "@/controllers/PlayersController";

const getAllPlayers = async () => {
  try {
    const players = await getPlayers();
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
