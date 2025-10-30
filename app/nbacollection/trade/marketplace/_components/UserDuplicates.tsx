"use client";
import { useEffect, useState } from "react";
import { PlayerData, Card } from "@/interfaces/Interfaces";
import getUserCardsCollection from "@/actions/cardcollection/getusercards";
import { getUserId } from "@/utils/get-user-id";
import CardDisplay from "@/components/CardDisplay";
import Skeleton from "@/components/CustomSkeleton";
import Button from "@/components/CustomButton";

type UserDuplicatesProps = {
  cardInfos: PlayerData[];
};

export default function UserDuplicates({ cardInfos }: UserDuplicatesProps) {
  const [selectedCard, setSelectedCard] = useState<PlayerData | null>(null);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      const userId = await getUserId();
      if (!userId) return;
      const cards = await getUserCardsCollection(userId);
      setUserCards(Array.isArray(cards) ? cards : []);
      setLoading(false);
    };
    fetchCards();
  }, []);

  if (selectedCard) {
    const userCard = userCards.find((c) => c.cardId === selectedCard.id);
    return (
      <div className="bg-white p-6 rounded-lg shadow max-h-full overflow-y-auto">
        <Button
          onClick={() => setSelectedCard(null)}
          theme="discard"
          size="slim"
          className="mb-4"
        >
          ← Back
        </Button>
        <div className="flex flex-col items-center">
          <CardDisplay card={selectedCard} possessed={userCard?.possessed ?? 0} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 space-y-4 max-h-[700px] overflow-y-auto rounded-lg shadow">
      <h2 className="text-xl sm:text-2xl font-medium text-center font-unbounded">
        My duplicates
      </h2>

      <div className="grid grid-cols-6 gap-4 place-items-center">
        {loading
          ? cardInfos.map((card) => (
            <div key={card.id} className="w-[250px] h-[350px]">
              <Skeleton width="100%" height="100%" borderRadius="rounded-lg" />
            </div>
          ))
          : cardInfos.map((card) => {
            const userCard = userCards.find((c) => c.cardId === card.id);
            return (
              <CardDisplay
                key={card.id}
                card={card}
                amount={true}
                onClick={() => setSelectedCard(card)}
                possessed={userCard?.possessed ?? 0}
              />
            );
          })}
      </div>
    </div>
  );
}
