"use client";

import { PeriodTypes, PlayerData } from "@/interfaces/Interfaces";
import { getRandomPlayers } from "@/utils/get-random-players";
import { useEffect, useState } from "react";
import DisplayPlayers from "./DisplayPlayers";
import GuessingBlock from "./GuessingBlock";

export default function PageContent({
  players,
  teams,
  period,
}: {
  players: PlayerData[];
  teams: string[];
  period: PeriodTypes;
}) {
  const storageKey = `randomPlayers-${period}`;
  const [randomPlayers, setRandomPlayers] = useState<PlayerData[]>([]);

  // Charger depuis localStorage si dispo
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setRandomPlayers(JSON.parse(saved));
    } else {
      const newPlayers = getRandomPlayers({ numberPlayers: 2, players });
      setRandomPlayers(newPlayers);
      localStorage.setItem(storageKey, JSON.stringify(newPlayers));
    }
  }, [period, players, storageKey]);

  // Sauvegarder quand ça change
  useEffect(() => {
    if (randomPlayers.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(randomPlayers));
    }
  }, [randomPlayers, storageKey]);

  // Nettoyage quand on quitte la page
  useEffect(() => {
    return () => {
      localStorage.removeItem(storageKey);
    };
  }, [storageKey]);

  return (
    <div key={period} className={`flex flex-col items-center gap-4`}>
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
