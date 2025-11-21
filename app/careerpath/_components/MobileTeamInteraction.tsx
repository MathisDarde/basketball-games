"use client";

import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import { getTeamLogo } from "@/utils/get-team-logo";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import getTeamInfosByYear from "@/utils/get-teaminfos-by-year";

// Fonction utilitaire pour normaliser les noms (supprime accents, majuscules, espaces inutiles, etc.)
const normalizeName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

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
        .map(({ team }) => {
          const normalizedTeam = normalizeName(team);
          return teams.find((t) => {
            const allNames = [t.currentName, ...(t.names || [])];
            return allNames.some(
              (name) => normalizeName(name) === normalizedTeam
            );
          });
        })
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
            className="bg-white rounded-2xl shadow-lg w-full max-w-md p-4 relative m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-4 gap-1">
              {visibleTeams.length === 0 ? (
                <p className="text-gray-500 italic">Aucune équipe disponible</p>
              ) : (
                [...visibleTeams]
                  .sort((a, b) => a.currentName.localeCompare(b.currentName))
                  .map((team, index) => {
                    const teamInfos = getTeamInfosByYear(team.periods, year);
                    const abr = teamInfos?.abr;
                    return (
                      <div
                        key={index}
                        onClick={() => onSelectTeam(team)}
                        className="cursor-pointer flex flex-col items-center justify-center p-2 border rounded hover:bg-gray-100"
                      >
                        <Image
                          src={
                            getTeamLogo(team.currentName, year) ||
                            "/pdpdebase.png"
                          }
                          width={40}
                          height={40}
                          alt={`${team.currentName} Logo`}
                          className="size-8 object-contain"
                        />
                        <p className="font-unbounded font-semibold text-sm">
                          {abr}
                        </p>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
