"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function MobileTeamInteraction({
  teams,
  isTeamPopupOpen,
  setIsTeamPopupOpen,
  onSelectTeam,
  player,
  difficulty,
  period,
}: {
  teams: TeamsDataType[];
  isTeamPopupOpen: boolean;
  setIsTeamPopupOpen: Dispatch<SetStateAction<boolean>>;
  onSelectTeam: (team: string) => void;
  player: PlayerData;
  difficulty: string;
  period: ParamValue;
}) {
  const { getTeamLogo } = usePlayTogetherCtx();

  const [visibleTeams, setVisibleTeams] = useState<string[]>([]);
  const [logoYear, setLogoYear] = useState<number>(2025);

  useEffect(() => {
    if (difficulty === "easy") {
      setVisibleTeams(
        player.teams_history
          .filter((t) => teams.some((team) => team.currentName === t.team))
          .map((t) => t.team)
      );
    } else {
      setVisibleTeams(teams.map((t) => t.currentName));
    }
  }, [difficulty, player.teams_history, teams]);

  useEffect(() => {
    if (typeof period === "string") {
      switch (period) {
        case "1990s":
          setLogoYear(1995);
          break;
        case "2000s":
          setLogoYear(2005);
          break;
        case "2010s":
          setLogoYear(2015);
          break;
        case "2020s":
          setLogoYear(2025);
          break;
        default:
          setLogoYear(2025);
          break;
      }
    }
  }, [period]);

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
                  .sort((a, b) => a.localeCompare(b))
                  .map((team, index) => (
                    <div
                      key={index}
                      onClick={() => onSelectTeam(team)}
                      className="cursor-pointer flex items-center justify-center gap-2 p-1 border rounded h-16 hover:bg-gray-100"
                    >
                      <Image
                        src={getTeamLogo(team, logoYear) || "/pdpdebase.png"}
                        width={40}
                        height={40}
                        alt={`${team} Logo`}
                      />
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
