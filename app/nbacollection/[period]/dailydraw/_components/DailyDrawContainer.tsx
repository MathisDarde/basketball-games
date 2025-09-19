"use client";

import flipCardFunction from "@/actions/cardcollection/flipcard";
import { PeriodTypes, PlayerData } from "@/interfaces/Interfaces";
import { useScreenSize } from "@/utils/use-screen-size";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LargeScreenDailyDraw } from "./LargeScreenDailyDraw";
import { MobileDailyDraw } from "./MobileDailyDraw";

export default function DailyDrawContainer({
  players,
  teams,
  flippedInitial,
  userId,
  params,
}: {
  players: PlayerData[];
  teams: string[];
  flippedInitial: string[];
  userId: string;
  params: { period: PeriodTypes };
}) {
  const { width } = useScreenSize();

  const { period } = params;

  const [mobileDailyDraw, setMobileDailyDraw] = useState(false);
  const [flippedIds, setFlippedIds] = useState<string[]>(flippedInitial);
  const router = useRouter();

  const handleCardClick = async (player: PlayerData) => {
    if (flippedIds.includes(player.id)) return;

    await flipCardFunction(userId, player.id, period);
    setFlippedIds((prev) => [...prev, player.id]);
  };

  const handleRedirectAndStore = () => {
    router.push(`/nbacollection/${period}`);
  };

  useEffect(() => {
    if (width < 1024) {
      setMobileDailyDraw(true);
    } else {
      setMobileDailyDraw(false);
    }
  }, [width]);

  return (
    <div>
      {mobileDailyDraw ? (
        <MobileDailyDraw players={players} teams={teams} handleCardClick={handleCardClick} flippedInitial={flippedIds} />
      ) : (
        <LargeScreenDailyDraw players={players} teams={teams} handleCardClick={handleCardClick} flippedInitial={flippedIds} />
      )}

      {flippedIds.length === 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={handleRedirectAndStore}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-unbounded rounded cursor-pointer"
          >
            Voir ma collection
          </button>
        </div>
      )}
    </div>
  );
}
