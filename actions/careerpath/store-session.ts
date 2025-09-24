import { storeSession } from "@/controllers/CareerPathSessionsController";

const handleStoreSession = async (
  userId: string | null,
  playerId: string,
  period: string,
  attempts: number,
  correct: boolean,
  streakCount: number,
  difficulty: string
) => {
  if (userId) {
    try {
      await storeSession(
        userId,
        playerId,
        period,
        correct,
        attempts,
        streakCount,
        difficulty
      );
    } catch (err) {
      console.error("Failed to store session:", err);
    }
  }
};

export default handleStoreSession;
