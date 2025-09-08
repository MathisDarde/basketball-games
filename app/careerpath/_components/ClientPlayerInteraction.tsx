"use client";

import { PlayerData } from "@/interfaces/Interfaces";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ClientPlayerInteraction({
  player,
  teams,
}: {
  player: PlayerData;
  teams: string[];
}) {
  const { getTeamLogo } = usePlayTogetherCtx();
  const [droppedTeams, setDroppedTeams] = useState<(string | null)[]>([]);
  const [, setAvailableTeams] = useState<string[]>([]);

  useEffect(() => {
    const filtered = player.teams_history
      .filter(({ team }) => teams.some((t) => team.includes(t)))
      .map(({ team }) => team);

    setDroppedTeams(Array(filtered.length).fill(null));
    setAvailableTeams(filtered);
  }, [player, teams]);

  return (
    <div className="flex gap-2 mt-4">
      {droppedTeams.map((team, index) => (
        <div
          key={index}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const draggedTeam = e.dataTransfer.getData("team");
            const source = e.dataTransfer.getData("source");
            const fromIndexStr = e.dataTransfer.getData("index");

            if (!draggedTeam) return;

            setDroppedTeams((prev) => {
              const next = [...prev];

              if (source === "logo") {
                // Le logo vient de la colonne de droite → assignation simple
                if (next.includes(draggedTeam)) return prev;
                next[index] = draggedTeam;
              }

              if (source === "box") {
                const fromIndex = parseInt(fromIndexStr, 10);
                if (isNaN(fromIndex)) return prev;

                // Échange les deux positions
                const temp = next[index];
                next[index] = next[fromIndex];
                next[fromIndex] = temp;
              }

              return next;
            });

            if (source === "logo") {
              setAvailableTeams((prev) =>
                prev.filter((t) => t !== draggedTeam)
              );
            }
          }}
          onDragStart={(e) => {
            if (!team) return;
            e.dataTransfer.setData("source", "box");
            e.dataTransfer.setData("index", index.toString());
            e.dataTransfer.setData("team", team);
          }}
          draggable={!!team}
          className="border border-dashed w-20 h-20 flex justify-center items-center relative"
        >
          {team ? (
            <>
              <Image
                src={getTeamLogo(team) || "/fallback-logo.png"}
                width={40}
                height={40}
                alt="Team Logo"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDroppedTeams((prev) => {
                    const next = [...prev];
                    next[index] = null;
                    return next;
                  });
                  setAvailableTeams((prev) => [...prev, team]);
                }}
                className="absolute top-0 right-0 text-red-500 font-bold px-1"
              >
                ×
              </button>
            </>
          ) : (
            <span className="text-gray-400 text-sm">Drop here</span>
          )}
        </div>
      ))}
    </div>
  );
}
