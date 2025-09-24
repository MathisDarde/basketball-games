"use client";

import { useState } from "react";
import {
  PlayerData,
  PeriodTypes,
  TeamsDataType,
} from "@/interfaces/Interfaces";
import createDailyDrawServer from "@/actions/cardcollection/createdailydraw";
import DailyDrawContainer from "./DailyDrawContainer";

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
  teams: TeamsDataType[];
  userId: string;
  period: PeriodTypes;
}) {
  const [players, setPlayers] = useState<PlayerData[]>(initialPlayers);
  const [flippedIds, setFlippedIds] = useState<string[]>(flippedInitial);

  const handleDrawClick = async () => {
    const newDraw = await createDailyDrawServer(userId, allPlayers, period);
    setPlayers(newDraw.players);
    setFlippedIds(newDraw.flippedIds);
  };

  if (players.length === 0) {
    return (
      <div className="text-center">
        <button
          onClick={handleDrawClick}
          className="px-6 py-2 bg-dark-purple text-white rounded font-outfit"
        >
          Tirer mes cartes
        </button>
      </div>
    );
  }

  return (
    <DailyDrawContainer
      players={players}
      teams={teams}
      flippedInitial={flippedIds}
      userId={userId}
      params={{ period }}
    />
  );
}
