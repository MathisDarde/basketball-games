import { getAuthenticatedUser } from "@/actions/user/get-connected-user";
import { ProfileContent } from "./_components/ProfileContent";
import { getUserGamesCount, getUserHighestStreak } from "@/controllers/PlayTogetherSessionsController";

export default async function ProfilePage() {
    const user = await getAuthenticatedUser();

    if(!user)
        return;

    const highestStreak = await getUserHighestStreak(user?.id);

    const totalPlayTogetherGames = await getUserGamesCount(user?.id);

    return (
        <div className="px-8 pb-8 space-y-2">
            <h1 className="text-center font-unbounded text-2xl">Profile</h1>

            <ProfileContent user={user} highestStreak={highestStreak} totalPlayTogetherGames={totalPlayTogetherGames} />
        </div>
    )
}