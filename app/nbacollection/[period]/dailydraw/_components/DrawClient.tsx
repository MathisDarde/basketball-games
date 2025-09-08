"use client";

import { useState } from "react";
import DailyDraw from "./DailyDraw";
import { PlayerData, PeriodTypes } from "@/interfaces/Interfaces";
import createDailyDrawServer from "@/actions/cardcollection/createdailydraw";

export default function DailyDrawClient({
  initialPlayers,
  flippedInitial,
  allPlayers,
  teams,
  userId,
  period,
}: {
  initialPlayers: PlayerData[];
  flippedInitial: string[];
  allPlayers: PlayerData[];
  teams: string[];
  userId: string;
  period: PeriodTypes;
}) {
  const [players, setPlayers] = useState<PlayerData[]>(initialPlayers);
  const [flippedIds, setFlippedIds] = useState<string[]>(flippedInitial);

  const handleDrawClick = async () => {
    const newDraw = await createDailyDrawServer(userId, allPlayers);
    setPlayers(newDraw.players);
    setFlippedIds(newDraw.flippedIds);
  };

  if (players.length === 0) {
    return (
      <button
        onClick={handleDrawClick}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        Tirer mes cartes
      </button>
    );
  }

  return (
    <DailyDraw
      players={players}
      teams={teams}
      flippedInitial={flippedIds}
      userId={userId}
      params={{ period }}
    />
  );
}
