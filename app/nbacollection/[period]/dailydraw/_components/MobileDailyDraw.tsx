"use client";

import { useState } from "react";
import Image from "next/image";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";

type MobileDailyDrawProps = {
  players: PlayerData[];
  teams: TeamsDataType[];
  handleCardClick: (player: PlayerData) => void;
  flippedIds: string[];
};

export const MobileDailyDraw = ({
  players,
  teams,
  handleCardClick,
  flippedIds,
}: MobileDailyDrawProps) => {
  const { formatPosition, getBackgroundClass, getTeamLogo } =
    usePlayTogetherCtx();
  const [step, setStep] = useState(flippedIds.length);

  const handleNext = async (player: PlayerData) => {
    await handleCardClick(player);
    setStep((prev) => prev + 1);
  };

  const remaining = players.length - step - 1;

  return (
    <div className="bg-light-beige">
      {/* Counter */}
      {step < players.length && (
        <div className="text-center">
          <div className="relative text-sm sm:text-base text-center bg-black/50 text-white px-2 py-1 rounded font-outfit font-light inline-flex">
            {remaining} card{remaining > 1 ? "s" : ""} remaining
          </div>
        </div>
      )}

      {step < players.length && (
        <div className="relative mx-auto mt-4 flex flex-col items-center">
          {players.map((player, index) => {
            const { teams_history } = player;
            const filteredTeams = teams_history.filter(({ team }) =>
              teams.some((t) => t.names.includes(team))
            );
            if (filteredTeams.length === 0) return null;

            const teamDurations = filteredTeams.map(({ team, period }) => {
              const [startStr, endStrRaw] = period.split("–");
              const startYear = parseInt(startStr, 10);

              const endYear = endStrRaw
                ? endStrRaw.trim().toLowerCase() === "present"
                  ? new Date().getFullYear()
                  : parseInt(endStrRaw, 10)
                : startYear;

              const duration = endYear - startYear + 1;

              return { team, startYear, endYear, duration };
            });

            const mainTeam = teamDurations.reduce((max, t) =>
              t.duration > max.duration ? t : max
            );

            const teamLogo = getTeamLogo(mainTeam.team, mainTeam.endYear);

            const backgroundClass = getBackgroundClass(player.awards);
            const [firstName, ...lastNameParts] = player.name.split(" ");

            const isActive = index === step;
            const isPast = index < step;

            return (
              <div
                key={player.id}
                className={`relative w-[250px] h-[350px] rounded-lg cursor-pointer transition-all duration-500 ease-in-out ${isPast ? "opacity-0 -translate-y-[100px]" : "opacity-100"
                  }`}
                style={{
                  zIndex: index === step ? 999 : players.length - index,
                  marginTop: index > 0 ? "-350px" : "0",
                  pointerEvents: isActive ? "auto" : "none",
                }}
                onClick={() => isActive && handleNext(player)}
              >
                <div
                  className={`relative overflow-hidden h-full rounded-lg shadow-lg ${backgroundClass}`}
                >
                  <div className="relative flex-1 w-full">
                    <Image
                      src={player.image_url ?? "/pdpdebase.png"}
                      alt={player.name}
                      fill
                      className="object-cover"
                      quality={100}
                    />
                  </div>
                  <div className="h-16 p-2 bg-black text-white uppercase flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <span className="text-sm">{firstName}</span>
                      <span className="text-xl">{lastNameParts.join(" ")}</span>
                    </div>
                    {teamLogo && (
                      <Image
                        src={teamLogo}
                        alt="Team logo"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <span className="px-2 py-1 bg-white text-black rounded-full text-xs">
                      {formatPosition(player.position ?? "")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div>
        {/* Récap à la fin */}
        {step >= players.length && (
          <div className="relative bg-white items-center justify-center p-4 rounded-lg mx-6 h-[600px] overflow-y-auto">
            <h2 className="text-lg sm:text-2xl my-3 sm:my-6 font-unbounded text-center">Pack revealed!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:w-[550px] mx-auto place-items-center">
              {players.map((player) => {
                const [firstName, ...lastNameParts] = player.name.split(" ");
                const filteredTeams = player.teams_history.filter(({ team }) =>
                  teams.some((t) => t.names.includes(team))
                );
                if (filteredTeams.length === 0) return null;

                const teamDurations = filteredTeams.map(({ team, period }) => {
                  const [startStr, endStrRaw] = period.split("–");
                  const startYear = parseInt(startStr, 10);

                  const endYear = endStrRaw
                    ? endStrRaw.trim().toLowerCase() === "present"
                      ? new Date().getFullYear()
                      : parseInt(endStrRaw, 10)
                    : startYear;

                  const duration = endYear - startYear + 1;
                  return { team, startYear, endYear, duration };
                });

                const mainTeam = teamDurations.reduce((max, t) =>
                  t.duration > max.duration ? t : max
                );

                const teamLogo = getTeamLogo(mainTeam.team, mainTeam.endYear);
                const backgroundClass = getBackgroundClass(player.awards);

                return (
                  <div
                    key={player.id}
                    className={`relative h-[350px] w-[250px] rounded-lg shadow-lg overflow-hidden ${backgroundClass}`}
                  >
                    <div className="relative flex-1 w-full">
                      <Image
                        src={player.image_url ?? "/pdpdebase.png"}
                        alt={player.name}
                        fill
                        className="object-cover"
                        quality={100}
                      />
                    </div>
                    <div className="h-12 p-1 bg-black text-white uppercase flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <span className="text-xs">{firstName}</span>
                        <span className="text-sm">
                          {lastNameParts.join(" ")}
                        </span>
                      </div>
                      {teamLogo && (
                        <Image
                          src={teamLogo}
                          alt="Team logo"
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
