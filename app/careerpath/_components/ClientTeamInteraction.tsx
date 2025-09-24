"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ClientTeamInteraction({
  player,
  teams,
  difficulty,
  period,
}: {
  player: PlayerData;
  teams: TeamsDataType[];
  difficulty: string;
  period: ParamValue;
}) {
  const { getTeamLogo } = usePlayTogetherCtx();

  const [visibleTeams, setVisibleTeams] = useState<
    { team: string; abr: string }[]
  >([]);
  const [logoYear, setLogoYear] = useState<number>(2025);

  useEffect(() => {
    if (difficulty === "easy") {
      setVisibleTeams(
        player.teams_history
          .filter((t) => teams.some((team) => team.currentName === t.team))
          .map((t) => {
            const franchise = teams.find((team) => team.currentName === t.team);
            const matchingPeriod = franchise?.periods.find((p) => {
              const [startStr, endStr] = p.period.includes("–")
                ? p.period.split("–")
                : p.period.split("-");
              const start = parseInt(startStr, 10);
              const end =
                !endStr || endStr === "present"
                  ? new Date().getFullYear()
                  : parseInt(endStr, 10);
              const year = parseInt(t.period.split(/–|-/).pop()!, 10);
              return start <= year && year <= end;
            });
            return { team: t.team, abr: matchingPeriod?.abr || "" };
          })
      );
    } else {
      setVisibleTeams(
        teams.map((t) => ({ team: t.currentName, abr: t.periods[0].abr }))
      );
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
    <div className="grid grid-cols-8 gap-2">
      {visibleTeams.length === 0 ? (
        <p className="text-gray-500 italic">Aucune équipe disponible</p>
      ) : (
        [...visibleTeams]
          .sort((a, b) => a.team.localeCompare(b.team))
          .map((team, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("team", team.team);
                e.dataTransfer.setData("abr", team.abr);
                e.dataTransfer.setData("source", "logo");
              }}
              className="cursor-grab flex items-center justify-center gap-2 p-1 border rounded h-16 hover:bg-gray-100"
            >
              <Image
                src={getTeamLogo(team.team, logoYear) || "/pdpdebase.png"}
                width={40}
                height={40}
                alt={`${team} Logo`}
              />
            </div>
          ))
      )}
    </div>
  );
}
