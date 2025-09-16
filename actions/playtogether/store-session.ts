import { storeSession } from "@/controllers/PlayTogetherSessionsController";

const handleStoreSession = async (userId: string | null, period: string, correct: boolean, streakCount: number, difficulty: string) => {
    if (userId) {
        try {
            await storeSession(userId, period, correct, streakCount, difficulty);
        } catch (err) {
            console.error("Failed to store session:", err);
        }
    }
};

export default handleStoreSession;