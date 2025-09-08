"use server";

import { store2000sPlayers } from "@/controllers/PlayersController";
import { FormResponse } from "@/types/players";

const register2000sPlayers = async (): Promise<FormResponse> => {
  try {
    await store2000sPlayers();
    return { success: true, message: "Player stored !" };
  } catch (error) {
    console.error("store2000sPlayers error:", error);
    return {
      success: false,
      message: "An error was encountered during the registration.",
    };
  }
};

export default register2000sPlayers;
