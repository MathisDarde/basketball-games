"use server";

import { getDrawsCount } from "@/controllers/DailyDrawController";

const getUserDrawsCount = async (userId: string, period: string) => {
  try {
    const drawsCount = await getDrawsCount(userId, period);
    return drawsCount;
  } catch (error) {
    console.error("getDrawsCount error:", error);
    return {
      success: false,
      message: "An error was encountered during getDrawsCount.",
    };
  }
};

export default getUserDrawsCount;
