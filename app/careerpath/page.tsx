"use client";

import { PlayerData, usePlayTogetherCtx } from "@/components/context";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CareerPathPage() {
  const {
    getRandomPlayers,
    players,
    teams,
    getTeamLogo,
    setDifficulty,
    difficulty,
    streakCount,
  } = usePlayTogetherCtx();
  const [player, setPlayer] = useState<PlayerData[]>([]);
  const [droppedTeams, setDroppedTeams] = useState<(string | null)[]>([]);
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);

  const { name, teams_history, image_link } = player[0] || {
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
    if (teams_history.length > 0) {
      const filtered = teams_history
        .filter(({ team }) => teams.some((t) => team.includes(t)))
        .map(({ team }) => team);

      setDroppedTeams(Array(filtered.length).fill(null));
      setAvailableTeams(filtered);
    }
  }, [teams_history, teams]);

  return (
    <div>
      <h1>Career path</h1>

      <div className="flex justify-between items-center">
        <select
          name="difficulty"
          onChange={(e) => setDifficulty(Number(e.target.value))}
        >
          <option value="0" defaultChecked>
            Easy
          </option>
          <option value="1">Medium</option>
          <option value="2">Hard</option>
        </select>

        <p>Streak : {streakCount}</p>
      </div>

      <div className="flex items-center gap-16">
        {difficulty === 0 ? (
          <>
            <div className="flex flex-col justify-center items-center border rounded-md p-4">
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
                      const source = e.dataTransfer.getData("source");
                      const draggedTeam = e.dataTransfer.getData("team");
                      const sourceIndex = e.dataTransfer.getData("index");

                      setDroppedTeams((prev) => {
                        const newState = [...prev];

                        if (source === "box") {
                          const fromIndex = parseInt(sourceIndex, 10);
                          const toIndex = index;

                          // Échange entre deux box
                          const temp = newState[toIndex];
                          newState[toIndex] = newState[fromIndex];
                          newState[fromIndex] = temp;
                        } else if (source === "logo") {
                          // Empêcher doublon
                          if (newState.includes(draggedTeam)) return prev;

                          // Remet l'équipe remplacée dans la liste de droite
                          const previousTeam = newState[index];
                          if (previousTeam) {
                            setAvailableTeams((prev) => {
                              // On ne rajoute que si elle n’y est pas déjà
                              if (prev.includes(previousTeam)) return prev;
                              return [...prev, previousTeam];
                            });
                          }

                          // Met la nouvelle équipe dans la box
                          newState[index] = draggedTeam;

                          // Supprime cette équipe de la liste de droite
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
            </div>

            <div className="flex flex-col border rounded-md p-4">
              {availableTeams.length === 0 ? (
                <p className="text-gray-500 italic">Aucune équipe disponible</p>
              ) : (
                availableTeams.map((team, index) => {
                  const teamLogo = getTeamLogo(team);
                  return (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("team", team);
                        e.dataTransfer.setData("source", "logo");
                      }}
                      className="cursor-grab flex items-center gap-2 p-1"
                    >
                      <Image
                        src={teamLogo || "/fallback-logo.png"}
                        width={25}
                        height={25}
                        alt="Team Logo"
                      />
                      <p>{team}</p>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
