"use client";
import { useEffect, useState } from "react";
import { PlayerData, Card } from "@/interfaces/Interfaces";
import getUserCardsCollection from "@/actions/cardcollection/getusercards";
import { getUserId } from "@/utils/get-user-id";
import Skeleton from "@/components/CustomSkeleton";
import CardDisplay from "@/components/card/CardDisplay";

type UserDuplicatesProps = {
  cardInfos: PlayerData[];
};

export default function UserDuplicates({ cardInfos }: UserDuplicatesProps) {
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

  return (
    <div className="bg-white p-6 space-y-4 max-h-[700px] overflow-y-auto rounded-lg shadow">
      <h2 className="text-xl sm:text-2xl font-medium text-center font-unbounded">
        My duplicates
      </h2>

        {cardInfos.length == 0 && (
          <p className="text-center font-outfit text-gray-400 italic">You do not possess any duplicate of a card. Indeed, the trading feature is not available for you yet.</p>
        )}
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
                possessed={userCard?.possessed ?? 0}
              />
            );
          })}
      </div>
    </div>
  );
}
