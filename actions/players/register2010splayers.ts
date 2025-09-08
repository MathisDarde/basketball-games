"use server";

import { store2010sPlayers } from "@/controllers/PlayersController";
import { FormResponse } from "@/types/players";

const register2010sPlayers = async (): Promise<FormResponse> => {
  try {
    await store2010sPlayers();
    return { success: true, message: "Player stored !" };
  } catch (error) {
    console.error("store2010sPlayers error:", error);
    return {
      success: false,
      message: "An error was encountered during the registration.",
    };
  }
};

export default register2010sPlayers;
