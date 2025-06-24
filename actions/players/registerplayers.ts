"use server";

import { storePlayers } from "@/controllers/PlayersController";
import { FormResponse } from "@/types/players";

const registerPlayers = async (): Promise<FormResponse> => {
  try {
    await storePlayers();
    return { success: true, message: "Player stored !" };
  } catch (error) {
    console.error("storePlayers error:", error);
    return {
      success: false,
      message: "An error was encountered during the registration.",
    };
  }
};

export default registerPlayers;
