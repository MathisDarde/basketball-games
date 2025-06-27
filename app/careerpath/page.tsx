"use client";

import { PlayerData, usePlayTogetherCtx } from "@/components/context";
import { useEffect, useState } from "react";
import PlayerBlock from "./_components/PlayerBlock";
import TeamBlock from "./_components/TeamBlock";
import Difficulty from "@/components/Difficulty";
import SubmitGuess from "./_components/SubmitGuess";

export default function CareerPathPage() {
  const { getRandomPlayers, players, teams } = usePlayTogetherCtx();
  const [player, setPlayer] = useState<PlayerData[]>([]);
  const [droppedTeams, setDroppedTeams] = useState<(string | null)[]>([]);
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);

  const { name, image_link } = player[0] || {
    name: "",
    teams_history: [],
    image_link: "",
  };

  useEffect(() => {
    if (players.length > 0) {
      const result = getRandomPlayers({ numberPlayers: 1, players });
      setPlayer(result);
    }
  }, [players, getRandomPlayers]);

  useEffect(() => {
    if (player.length > 0 && player[0].teams_history.length > 0) {
      const filtered = player[0].teams_history
        .filter(({ team }) => teams.some((t) => team.includes(t)))
        .map(({ team }) => team);

      setDroppedTeams(Array(filtered.length).fill(null));
      setAvailableTeams(filtered);
    }
  }, [player, teams]);

  return (
    <div>
      <h1>Career path</h1>

      <Difficulty />

      <div className="flex items-center gap-16">
        <>
          <PlayerBlock
            droppedTeams={droppedTeams}
            setDroppedTeams={setDroppedTeams}
            setAvailableTeams={setAvailableTeams}
            player={player}
            name={name}
            image_link={image_link}
          />

          <TeamBlock availableTeams={availableTeams} />

          <SubmitGuess />
        </>
      </div>
    </div>
  );
}
