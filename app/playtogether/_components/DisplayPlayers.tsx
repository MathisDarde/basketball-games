"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { TeamLogos } from "@/components/TeamLogos";
import { PlayerData, TeamHistory } from "@/interfaces/Interfaces";
import Image from "next/image";
import { useRef } from "react";

export default function DisplayPlayers({
  players,
  randomPlayers,
  teams,
  difficulty,
}: {
  players: PlayerData[];
  randomPlayers: PlayerData[];
  teams: string[];
  difficulty: string;
}) {
  const { getTeamLogo, endedRound, getLastYear } =
    usePlayTogetherCtx();

  const hasInitialized = useRef(false);

  if (
    !hasInitialized.current &&
    players.length > 0 &&
    randomPlayers.length === 0
  ) {
    localStorage.setItem("randomPlayers", JSON.stringify(randomPlayers));
    hasInitialized.current = true;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {randomPlayers.map((player: PlayerData, index: number) => {
        const { name, image_link, teams_history, position } = player;

        const allYears = teams_history
          .map(({ period }) => {
            const parts = period.includes("–")
              ? period.split("–")
              : period.split("-");

            let start: number;
            let end: number;

            if (parts.length === 1) {
              start = end = parseInt(parts[0], 10);
            } else {
              const [startRaw, endRaw] = parts;
              start = parseInt(startRaw, 10);
              end =
                endRaw === "present"
                  ? new Date().getFullYear()
                  : parseInt(endRaw, 10);
            }

            return { start, end };
          })
          .filter(({ start, end }) => !isNaN(start) && !isNaN(end));

        let activePeriod = "";
        if (allYears.length > 0) {
          const minStart = Math.min(...allYears.map(({ start }) => start));
          const maxEnd = Math.max(...allYears.map(({ end }) => end));

          if (minStart === maxEnd) {
            activePeriod = `${minStart}`;
          } else if (maxEnd === new Date().getFullYear()) {
            activePeriod = `${minStart}-present`;
          } else {
            activePeriod = `${minStart}-${maxEnd}`;
          }
        }

        return (
          <div key={index} className="player-card p-4 w-[300px]">
            {(difficulty != "hard" || endedRound) ? (
              <Image
                src={image_link || "/pdpdebase.png"}
                alt={name}
                width={75}
                height={75}
                className="rounded-full mb-4 mx-auto"
              />
            ) : (
              <Image
                src="/playersilhouette.png"
                alt={name}
                width={75}
                height={75}
                className="rounded-full mb-4 mx-auto"
              />
            )}

<div className="space-y-1">
            <h2
              className={`text-xl font-regular font-unbounded text-center`}
            >
              {name}
            </h2>

            <p className="font-outfit font-light text-center text-sm">{position}</p>

            {(difficulty === "easy" || endedRound) && (
              <p className="text-sm text-center font-outfit font-light">
                Active Period: {activePeriod}
              </p>
            )}
            </div>

            {endedRound && (
              <div className="grid grid-cols-3 gap-1 mt-4">
                {teams_history
                  .filter(({ team }) => teams.some((t) => team.includes(t)))
                  .map((singleTeam: TeamHistory, teamIndex: number) => {
                    const { team, period } = singleTeam;
                    const year = getLastYear(period);
                    const teamLogo: string | undefined = getTeamLogo(
                      team,
                      year
                    );

                    const abrevation = TeamLogos.find(
                      (t) => t.team === team
                    )?.abr;

                    return (
                      <div key={teamIndex} className="team-history">
                        <div className="flex flex-col shadow-lg gap-2 items-center p-2 rounded-md bg-[#FFFBF4] border border-accent-brown">
                          {teamLogo && (
                            <Image
                              src={teamLogo}
                              alt={`${team} logo`}
                              width={50}
                              height={50}
                              className="team-logo h-10 w-auto object-contain"
                            />
                          )}
                          <p className={`font-bold uppercase font-unbounded`}>
                            {abrevation}
                          </p>
                          <p className={`text-xs font-outfit font-light`}>
                            {period.replace("present", new Date().getFullYear().toString())}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
