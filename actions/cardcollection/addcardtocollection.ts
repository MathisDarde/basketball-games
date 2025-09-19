"use server";

import { addCardToCollection } from "@/controllers/PlayersController";

const storeCardInCollection = async (cardId: string, userId: string, period: string) => {
  try {
    await addCardToCollection(cardId, userId, period);
    return { success: true, message: "Card stored !" };
  } catch (error) {
    console.error("storeCardInCollection error:", error);
    return {
      success: false,
      message: "An error was encountered during the storage.",
    };
  }
};

export default storeCardInCollection;
