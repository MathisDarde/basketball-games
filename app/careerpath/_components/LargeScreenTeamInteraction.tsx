"use client";

import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import getAbrForYear from "@/utils/get-abr-by-year";
import { getTeamLogo } from "@/utils/get-team-logo";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LargeScreenTeamInteraction({
  player,
  teams,
  difficulty,
  year,
}: {
  player: PlayerData;
  teams: TeamsDataType[];
  difficulty: string;
  year: number;
}) {
  const [visibleTeams, setVisibleTeams] = useState<TeamsDataType[]>([]);

  useEffect(() => {
    if (difficulty === "easy") {
      // Affiche uniquement les équipes que le joueur a eues
      const filteredTeams = player.teams_history
        .map((t) => teams.find((team) => team.currentName === t.team))
        .filter((team): team is TeamsDataType => !!team); // retire les undefined
      setVisibleTeams(filteredTeams);
    } else {
      // Affiche toutes les équipes
      setVisibleTeams(teams);
    }
  }, [difficulty, player.teams_history, teams]);

  return (
    <div className="grid grid-cols-8 gap-2 max-w-[850px] mx-auto">
      {visibleTeams.length === 0 ? (
        <p className="text-gray-500 italic">Aucune équipe disponible</p>
      ) : (
        [...visibleTeams]
          .sort((a, b) => a.currentName.localeCompare(b.currentName))
          .map((team, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "team",
                  JSON.stringify({ currentName: team.currentName, periods: team.periods, names: team.names, conference: team.conference, division: team.division })
                );
                e.dataTransfer.setData("source", "largeScreen");
              }}
              className="cursor-grab flex flex-col items-center justify-center gap-2 p-2 border rounded hover:bg-gray-100 transition-transform active:scale-95"
            >
              <Image
                src={getTeamLogo(team.currentName, year) || "/pdpdebase.png"}
                width={40}
                height={40}
                alt={`${team.currentName} Logo`}
                className="size-10 object-contain"
              />
              <p className="font-unbounded font-semibold">{getAbrForYear(team.periods, year)}</p>
            </div>
          ))
      )}
    </div>
  );
}
