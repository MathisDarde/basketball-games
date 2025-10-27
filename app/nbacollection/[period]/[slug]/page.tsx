import { getAuthenticatedUserId } from "@/actions/user/get-connected-user-id";
import { getPlayerBySlug, getUserCards } from "@/controllers/PlayersController";
import InfoDisplay from "./_components/InfoDisplay";

export default async function SingleCardPage({ params }: { params: { period: string, slug: string } }) {
    const player = await getPlayerBySlug(params.slug);

    const userId = await getAuthenticatedUserId();
    if(!userId) return;

    const ownedCards = await getUserCards(userId);
    const cardIds = ownedCards.map((card) => card.cardId);

    const isOwned = cardIds.includes(player.id);
    
    return (
      <div className="p-6">
      <InfoDisplay period={params.period} player={player} isOwned={isOwned} />
      </div>
    )
}