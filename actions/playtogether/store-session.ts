import { storeSession } from "@/controllers/PlayTogetherSessionsController";

const handleStoreSession = async (userId: string | null, period: string, correct: boolean, streakCount: number) => {
    if (userId) {
        try {
            await storeSession(userId, period, correct, streakCount);
        } catch (err) {
            console.error("Failed to store session:", err);
        }
    }
};

export default handleStoreSession;