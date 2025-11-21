"use client";

import { useEffect, useState } from "react";
import { PlayerData, PeriodTypes, Card } from "@/interfaces/Interfaces";
import createDailyDrawServer from "@/actions/cardcollection/createdailydraw";
import DailyDrawContainer from "./DailyDrawContainer";
import Button from "@/components/CustomButton";
import getUserDrawsCount from "@/actions/cardcollection/getDrawsCount";
import getQuotaByRole from "@/actions/cardcollection/getuserquota";

export default function DailyDrawClient({
  initialPlayers,
  allPlayers,
  userId,
  period,
  userRole,
  ownedCards,
}: {
  initialPlayers: PlayerData[];
  allPlayers: PlayerData[];
  userId: string;
  userRole: string;
  period: PeriodTypes;
  ownedCards: Card[];
}) {
  const [players, setPlayers] = useState<PlayerData[]>(initialPlayers);
  const [flippedIds, setFlippedIds] = useState<string[]>(
    initialPlayers.length > 0 ? initialPlayers.map((p) => p.id) : [] // 🔹 recap seulement si tirage existant
  );
  const [remainingDraws, setRemainingDraws] = useState<number>(0);

  useEffect(() => {
    async function fetchQuota() {
      const quota = await getQuotaByRole(userRole);
      const drawsToday = await getUserDrawsCount(userId, period);
      const draws = typeof drawsToday === "number" ? drawsToday : 0;
      setRemainingDraws(Math.max(quota - draws, 0));
    }
    fetchQuota();
  }, [userId, period, userRole]);

  const handleDrawClick = async () => {
    if (remainingDraws <= 0) return;

    // réinitialise le tirage
    setPlayers([]);
    setFlippedIds([]);

    const newDraw = await createDailyDrawServer(
      userId,
      allPlayers,
      period,
      userRole
    );
    if (!newDraw || !newDraw.players) {
      console.error("Erreur : tirage invalide", newDraw);
      return;
    }

    setPlayers(newDraw.players);

    // recalcul du quota
    const quota = await getQuotaByRole(userRole);
    const drawsToday = await getUserDrawsCount(userId, period);
    const draws = typeof drawsToday === "number" ? drawsToday : 0;
    setRemainingDraws(Math.max(quota - draws, 0));
  };

  const cardIds = ownedCards.map((card) => card.cardId);

  if (players.length === 0) {
    return (
      <div className="text-center">
        <Button onClick={handleDrawClick} size="default" theme="primary">
          Draw my cards
        </Button>
        <p className="mt-2 text-sm text-gray-500">
          Tirages restants aujourd’hui : {remainingDraws}
        </p>
      </div>
    );
  }

  return (
    <DailyDrawContainer
      players={players}
      cardIds={cardIds}
      params={{ period }}
      flippedIds={flippedIds}
      setFlippedIds={setFlippedIds}
      remainingDraws={remainingDraws}
      handleNewDraw={handleDrawClick}
    />
  );
}
