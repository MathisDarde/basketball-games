"use server";

import { store2020sPlayers } from "@/controllers/PlayersController";
import { FormResponse } from "@/types/players";

const register2020sPlayers = async (): Promise<FormResponse> => {
  try {
    await store2020sPlayers();
    return { success: true, message: "Player stored !" };
  } catch (error) {
    console.error("store2020sPlayers error:", error);
    return {
      success: false,
      message: "An error was encountered during the registration.",
    };
  }
};

export default register2020sPlayers;
