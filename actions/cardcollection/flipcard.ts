"use server";

import { flipCard } from "@/controllers/DailyDrawController";

const flipCardFunction = async (userId: string, playerId: string) => {
  try {
    const cards = await flipCard(userId, playerId);
    return cards;
  } catch (error) {
    console.error("flipCard error:", error);
    return {
      success: false,
      message: "An error was encountered during the filpCard.",
    };
  }
};

export default flipCardFunction;
