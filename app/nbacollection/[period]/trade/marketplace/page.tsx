import { getAuthenticatedUser } from "@/actions/user/get-connected-user"
import { getCardsByIds, getUserCards } from "@/controllers/PlayersController";
import UserDuplicates from "./_components/UserDuplicates";
import HowDoesItWork from "./_components/HowDoesItWork";

export default async function MarketplacePage() {
    const user = await getAuthenticatedUser();
    if (!user) return;

    const usersCards = await getUserCards(user.id);

    const duplicates = usersCards.filter(
        (card) => card.possessed !== null && card.possessed >= 2
    );

    const cardIds = duplicates.map((c) => c.cardId);
    const cardsInfo = await getCardsByIds(cardIds);

    return (
        <div className="p-6 sm:p-10 h-screen">
            <h1 className="font-unbounded text-center text-2xl md:text-3xl 2xl:text-4xl">Marketplace</h1>
            <div className="flex flex-col lg:flex-row items-start gap-10">
                <div className="flex-1">
                    <UserDuplicates usersCards={usersCards} cardIds={cardIds} cardInfos={cardsInfo} />
                </div>
                <div>
                    <HowDoesItWork />
                </div>
            </div>
        </div>
    )
}