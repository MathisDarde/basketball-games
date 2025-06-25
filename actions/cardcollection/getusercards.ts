"use server";

import { getUserCards } from "@/controllers/PlayersController";

const getUserCardsCollection = async (userId: string) => {
  try {
    const cards = await getUserCards(userId);
    return cards;
  } catch (error) {
    console.error("getUserCardsCollection error:", error);
    return {
      success: false,
      message: "An error was encountered during the recup.",
    };
  }
};

export default getUserCardsCollection;
