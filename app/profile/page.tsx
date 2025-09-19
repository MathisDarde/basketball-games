import { getAuthenticatedUser } from "@/actions/user/get-connected-user";
import { ProfileContent } from "./_components/ProfileContent";
import { getUserGamesCount, getUserPTHighestStreak } from "@/controllers/PlayTogetherSessionsController";
import { getPlayers, getUserCards } from "@/controllers/PlayersController";

export default async function ProfilePage() {
    const user = await getAuthenticatedUser();

    if(!user)
        return;

    {/* Play Together */}
    const PTHighestStreak = await getUserPTHighestStreak(user?.id);
    const totalPlayTogetherGames = await getUserGamesCount(user?.id);

    {/* NBA Collection */}
    const players = await getPlayers();
    const totalPlayers = players.length;
    const cards = await getUserCards(user.id);
    const totalCards = cards.length;

    return (
        <div className="px-8 pb-8 space-y-2">
            <h1 className="text-center font-unbounded text-2xl">Profile</h1>

            <ProfileContent user={user} PTHighestStreak={PTHighestStreak} totalPlayTogetherGames={totalPlayTogetherGames} totalCards={totalCards} totalPlayers={totalPlayers} />
        </div>
    )
}