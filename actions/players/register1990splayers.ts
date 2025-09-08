"use server";

import { store1990sPlayers } from "@/controllers/PlayersController";
import { FormResponse } from "@/types/players";

const register1990sPlayers = async (): Promise<FormResponse> => {
  try {
    await store1990sPlayers();
    return { success: true, message: "Player stored !" };
  } catch (error) {
    console.error("store1990sPlayers error:", error);
    return {
      success: false,
      message: "An error was encountered during the registration.",
    };
  }
};

export default register1990sPlayers;
