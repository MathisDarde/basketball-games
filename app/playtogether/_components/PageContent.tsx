"use client";

import { PlayerData } from "@/interfaces/Interfaces";
import DisplayPlayers from "./DisplayPlayers";
import GuessingBlock from "./GuessingBlock";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { useState } from "react";

export default function PageContent({
  players,
  teams,
}: {
  players: PlayerData[];
  teams: string[];
}) {
  const { getRandomPlayers } = usePlayTogetherCtx();

  const [randomPlayers, setRandomPlayers] = useState<PlayerData[]>(() =>
    getRandomPlayers({ numberPlayers: 2, players })
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <DisplayPlayers
        players={players}
        randomPlayers={randomPlayers}
        teams={teams}
      />
      <GuessingBlock
        players={players}
        randomPlayers={randomPlayers}
        setRandomPlayers={setRandomPlayers}
      />
    </div>
  );
}
