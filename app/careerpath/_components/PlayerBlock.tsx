"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { useState } from "react";

export default function PlayerBlock({
  players,
  teams,
}: {
  players: PlayerData[];
  teams: string[];
}) {
  const { getTeamLogo, difficulty, getRandomPlayers } = usePlayTogetherCtx();

  const [droppedTeams, setDroppedTeams] = useState<(string | null)[]>([]);
  const [, setAvailableTeams] = useState<string[]>([]);

  const playerArr = getRandomPlayers({ numberPlayers: 1, players });
  const { teams_history, image_link, name } = playerArr[0] || {};

  if (teams_history.length > 0) {
    const filteredTeams = teams_history
      .filter(({ team }) => teams.some((t) => team.includes(t)))
      .map(({ team }) => team);

    setDroppedTeams(Array(filteredTeams.length).fill(null));
    setAvailableTeams(filteredTeams);
  }

  return (
    <div className="flex flex-col justify-center items-center border rounded-md p-4">
      {difficulty === 0 || difficulty === 1 ? (
        <>
          <Image
            src={image_link}
            width={100}
            height={100}
            alt="Player picture"
          />
          <p className="text-center">{name}</p>

          <div className="flex items-center justify-center gap-2">
            {droppedTeams.map((team, index) => (
              <div
                key={index}
                className="border border-dashed h-20 w-20 flex items-center justify-center relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  console.log(team);

                  const source = e.dataTransfer.getData("source");
                  const draggedTeam = e.dataTransfer.getData("team");
                  const sourceIndex = e.dataTransfer.getData("index");

                  setDroppedTeams((prev) => {
                    const newState = [...prev];

                    if (source === "box") {
                      const fromIndex = parseInt(sourceIndex, 10);
                      const toIndex = index;
                      const temp = newState[toIndex];
                      newState[toIndex] = newState[fromIndex];
                      newState[fromIndex] = temp;
                    } else if (source === "logo") {
                      if (newState.includes(draggedTeam)) return prev;

                      const previousTeam = newState[index];
                      if (previousTeam) {
                        setAvailableTeams((prev) => {
                          if (prev.includes(previousTeam)) return prev;
                          return [...prev, previousTeam];
                        });
                      }

                      newState[index] = draggedTeam;

                      setAvailableTeams((prev) =>
                        prev.filter((t) => t !== draggedTeam)
                      );
                    }

                    return newState;
                  });
                }}
                draggable={!!team}
                onDragStart={(e) => {
                  if (!team) return;
                  e.dataTransfer.setData("source", "box");
                  e.dataTransfer.setData("index", index.toString());
                  e.dataTransfer.setData("team", team);
                }}
              >
                {team ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDroppedTeams((prev) => {
                          const newState = [...prev];
                          newState[index] = null;
                          return newState;
                        });
                        setAvailableTeams((prev) => [...prev, team]);
                      }}
                      className="absolute top-0 right-0 text-red-500 hover:text-red-700 font-bold px-1"
                    >
                      ×
                    </button>
                    <Image
                      src={getTeamLogo(team) || "/fallback-logo.png"}
                      width={40}
                      height={40}
                      alt="Team Logo"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Drop here</span>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <Image
            src={image_link}
            width={100}
            height={100}
            alt="Player picture"
          />
          <p className="text-center">{name}</p>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-32 grid grid-cols-5 gap-2 items-start justify-start"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const source = e.dataTransfer.getData("source");
              const draggedTeam = e.dataTransfer.getData("team");

              if (source === "logo") {
                // Vérifier si l'équipe n'est pas déjà dans la zone
                if (droppedTeams.filter(Boolean).includes(draggedTeam)) return;

                // Ajouter l'équipe à la première position libre
                setDroppedTeams((prev) => {
                  const newState = [...prev];
                  const firstNullIndex = newState.indexOf(null);

                  if (firstNullIndex !== -1) {
                    newState[firstNullIndex] = draggedTeam;
                  } else {
                    // Si pas de position libre, ajouter à la fin
                    newState.push(draggedTeam);
                  }

                  return newState;
                });

                setAvailableTeams((prev) =>
                  prev.filter((t) => t !== draggedTeam)
                );
              }
            }}
          >
            {droppedTeams.filter(Boolean).length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-center">
                  Déposez les équipes ici
                  <br />
                  <small>Autant que vous voulez</small>
                </span>
              </div>
            ) : (
              droppedTeams.filter(Boolean).map((team, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-center bg-white border rounded-lg p-2 shadow-sm"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("source", "free-zone");
                    e.dataTransfer.setData("team", team!);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDroppedTeams((prev) => prev.filter((t) => t !== team));
                      setAvailableTeams((prev) => [...prev, team!]);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                  <Image
                    src={getTeamLogo(team!) || "/fallback-logo.png"}
                    width={30}
                    height={30}
                    alt="Team Logo"
                  />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
