"use client";

import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import getAbrForYear from "@/utils/get-abr-by-year";
import { getTeamLogo } from "@/utils/get-team-logo";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function MobileTeamInteraction({
  teams,
  isTeamPopupOpen,
  setIsTeamPopupOpen,
  onSelectTeam,
  player,
  difficulty,
  year,
}: {
  teams: TeamsDataType[];
  isTeamPopupOpen: boolean;
  setIsTeamPopupOpen: Dispatch<SetStateAction<boolean>>;
  onSelectTeam: (team: TeamsDataType) => void;
  player: PlayerData;
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
    <>
      {isTeamPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsTeamPopupOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-5 gap-2">
              {visibleTeams.length === 0 ? (
                <p className="text-gray-500 italic">Aucune équipe disponible</p>
              ) : (
                [...visibleTeams]
                  .sort((a, b) => a.currentName.localeCompare(b.currentName))
                  .map((team, index) => (
                    <div
                      key={index}
                      onClick={() => onSelectTeam(team)}
                      className="cursor-pointer flex flex-col items-center justify-center p-2 border rounded hover:bg-gray-100"
                    >
                      <Image
                        src={getTeamLogo(team.currentName, year) || "/pdpdebase.png"}
                        width={40}
                        height={40}
                        alt={`${team.currentName} Logo`}
                        className="size-10 object-contain"
                      />
                      <p className="font-unbounded">{getAbrForYear(team.periods, year)}</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
