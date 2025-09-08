"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import Image from "next/image";
import { useState } from "react";

export default function ClientTeamInteraction({
  teams,
  params,
}: {
  teams: string[];
  params: { period: string };
}) {
  const { getTeamLogo } = usePlayTogetherCtx();

  const { period } = params;
  const [visibleTeams] = useState(teams);

  return (
    <div className="grid grid-cols-3 gap-2">
      {visibleTeams.length === 0 ? (
        <p className="text-gray-500 italic">Aucune équipe disponible</p>
      ) : (
        visibleTeams.map((team, index) => {
          const parsePeriod = (period: string): number => {
            const normalized = period.replace("–", "-").toLowerCase();

            if (normalized.includes("-")) {
              const [, to] = normalized.split("-");

              if (to.trim() === "present") {
                return new Date().getFullYear();
              }

              return Number(to);
            }

            return Number(normalized);
          };

          const year = parsePeriod(period);
          const teamLogo = getTeamLogo(team, year);
          return (
            <div
              key={index}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("team", team);
                e.dataTransfer.setData("source", "logo");
              }}
              className="cursor-grab flex items-center gap-2 p-1 border rounded"
            >
              <Image
                src={teamLogo || "/fallback-logo.png"}
                width={40}
                height={40}
                alt="Team Logo"
              />
            </div>
          );
        })
      )}
    </div>
  );
}
