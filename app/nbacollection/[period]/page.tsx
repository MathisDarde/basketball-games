import { getPlayersByPeriod, getUserCards, getUserCardsByPeriod } from "@/controllers/PlayersController";
import { getAuthenticatedUserId } from "@/actions/user/get-connected-user-id";
import PageMenu from "../_components/PageMenu";
import CardsDisplay from "../_components/CardsDisplay";
import { PeriodTypes } from "@/interfaces/Interfaces";

export default async function NBACollectionPage(props: {
  params: Promise<{ period: PeriodTypes }>;
}) {
  const { period } = await props.params;

  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-red-500">
          Veuillez vous connecter pour voir votre collection.
        </h2>
      </div>
    );
  }

  const ownedCards = await getUserCards(userId);
  const ownedByPeriod = await getUserCardsByPeriod(userId, period)
  const players = await getPlayersByPeriod(period);

  return (
    <div>
      <h1 className="font-unbounded text-2xl text-center">
        NBA Cards Collection
      </h1>
      <PageMenu
        players={players}
        params={props.params}
        ownedByPeriod={ownedByPeriod}
      />
      <CardsDisplay ownedCards={ownedCards} players={players} period={period} />
    </div>
  );
}
