import { authClient } from "@/utils/auth-client";
import CardsDisplay from "./_components/CardsDisplay";
import { getAllPlayers, getUserCards } from "@/controllers/PlayersController";

export default async function HappyFamiliesPage() {
  const getUserId = async () => {
    const session = await authClient.getSession();
    const user_id = session?.data?.user.id || null;
    return user_id;
  };

  const userId = await getUserId();

  if (!userId) return;

  const ownedCards = await getUserCards(userId);

  const players = await getAllPlayers();

  return (
    <div>
      <h1>NBA Cards Collection</h1>

      <CardsDisplay ownedCards={ownedCards} players={players} />
    </div>
  );
}
