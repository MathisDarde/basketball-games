"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { TeamsData } from "@/components/Teams";
import { PlayerData, TeamHistory } from "@/interfaces/Interfaces";
import Image from "next/image";
import { useRef } from "react";

export default function DisplayPlayers({
  players,
  randomPlayers,
  difficulty,
}: {
  players: PlayerData[];
  randomPlayers: PlayerData[];
  difficulty: string;
}) {
  const { endedRound } = usePlayTogetherCtx();

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
    <div className="flex flex-col md:flex-row md:items-start items-center gap-6 md:gap-10 lg:gap-12 xl:gap-24">
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
          <div
            key={index}
            className="player-card p-4 w-[300px] sm:w-[400px] md:w-[300px] lg:w-[400px]"
          >
            {difficulty != "hard" || endedRound ? (
              <Image
                src={image_link || "/pdpdebase.png"}
                alt={name}
                width={128}
                height={128}
                className="rounded-full mb-4 mx-auto w-28 sm:w-32 xl:w-36"
              />
            ) : (
              <Image
                src="/playersilhouette.png"
                alt={name}
                width={128}
                height={128}
                className="rounded-full mb-4 mx-auto w-28 sm:w-32 xl:w-36"
              />
            )}

            <div className="space-y-1">
              <h2
                className={`text-xl sm:text-2xl font-regular font-unbounded text-center`}
              >
                {name}
              </h2>

              <p className="font-outfit font-light text-center text-sm sm:text-base">
                {position}
              </p>

              {(difficulty === "easy" || endedRound) && (
                <p className="text-sm sm:text-base text-center font-outfit font-light">
                  Active Period: {activePeriod}
                </p>
              )}
            </div>

            {endedRound && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-1 mt-4">
                {teams_history
                  .filter(({ team }) =>
                    TeamsData.some((franchise) =>
                      franchise.names.includes(team)
                    )
                  )
                  .map((singleTeam: TeamHistory, teamIndex: number) => {
                    const { team, period } = singleTeam;

                    let endYear: number;
                    if (period.includes("–") || period.includes("-")) {
                      const parts = period.includes("–")
                        ? period.split("–")
                        : period.split("-");
                      const endStr = parts[1];
                      endYear =
                        endStr === "present"
                          ? new Date().getFullYear()
                          : parseInt(endStr, 10);
                    } else {
                      endYear = parseInt(period, 10);
                    }

                    const franchise = TeamsData.find((f) =>
                      f.names.includes(team)
                    );

                    const matchingPeriod = franchise?.periods.find((p) => {
                      const [startStr, endStr] = p.period.includes("–")
                        ? p.period.split("–")
                        : p.period.split("-");
                      const start = parseInt(startStr, 10);
                      const end =
                        endStr === undefined || endStr === "present"
                          ? new Date().getFullYear()
                          : parseInt(endStr, 10);
                      return start <= endYear && endYear <= end;
                    });

                    const abrevation = matchingPeriod?.abr;
                    const teamLogo = matchingPeriod?.logo;

                    return (
                      <div key={teamIndex} className="team-history">
                        <div className="flex flex-col shadow-lg gap-2 items-center p-2 rounded-md bg-[#FFFBF4] border border-accent-brown">
                          {teamLogo && (
                            <Image
                              src={teamLogo}
                              alt={`${team} logo`}
                              width={128}
                              height={128}
                              className="team-logo h-10 lg:h-15 w-auto object-contain"
                            />
                          )}
                          <p
                            className={`font-bold uppercase font-unbounded lg:text-lg`}
                          >
                            {abrevation}
                          </p>
                          <p
                            className={`text-xs font-outfit font-light lg:text-sm`}
                          >
                            {period.replace(
                              "present",
                              new Date().getFullYear().toString()
                            )}
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
