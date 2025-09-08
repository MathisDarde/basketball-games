"use client";

import flipCardFunction from "@/actions/cardcollection/flipcard";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { PeriodTypes, PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DailyDraw({
  players,
  teams,
  flippedInitial,
  userId,
  params,
}: {
  players: PlayerData[];
  teams: string[];
  flippedInitial: string[];
  userId: string;
  params: { period: PeriodTypes };
}) {
  const { getTeamLogo, formatPosition, getBackgroundClass } =
    usePlayTogetherCtx();

  const { period } = params;

  const [flippedIds, setFlippedIds] = useState<string[]>(flippedInitial);
  const router = useRouter();

  const handleCardClick = async (player: PlayerData) => {
    if (flippedIds.includes(player.id)) return;

    await flipCardFunction(userId, player.id);
    setFlippedIds((prev) => [...prev, player.id]);
  };

  const handleRedirectAndStore = () => {
    router.push("/nbacollection");
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {players.map((player) => {
          const isFlipped = flippedIds.includes(player.id);
          const { name, image_link, teams_history, number, position } = player;
          const backgroundClass = getBackgroundClass(player.awards);

          // filtrer teams valides
          const filteredTeams = teams_history.filter(({ team }) =>
            teams.some((t) => team.includes(t))
          );
          if (filteredTeams.length === 0) return null;

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

          const lastTeam = filteredTeams[filteredTeams.length - 1];
          const year = parsePeriod(period);
          const teamLogo = getTeamLogo(lastTeam.team, year);

          const [firstName, ...lastNameParts] = name.split(" ");

          return (
            <div
              key={player.id}
              className="relative w-[288px] h-[400px] cursor-pointer border rounded overflow-hidden"
              onClick={() => handleCardClick(player)}
            >
              {!isFlipped ? (
                <div className="relative w-full h-full">
                  <Image
                    src="/cardback.png"
                    alt="Back of the card"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`relative overflow-hidden h-[400px] px-4 pb-4 pt-12 ${backgroundClass} rounded-lg shadow transition-shadow`}
                >
                  <div className="relative text-sm text-gray-600 flex items-center gap-2">
                    <div className="absolute -top-9 -left-1">
                      {teamLogo && (
                        <Image
                          src={teamLogo}
                          alt={`Team Logo`}
                          width={50}
                          height={50}
                          className="inline-block size-14 object-fit"
                        />
                      )}
                    </div>
                  </div>
                  <div className="absolute right-4 top-3 rounded-full w-14 h-14 bg-black flex items-center justify-center">
                    <p className=" italic font-righteous text-2xl text-white">{`#${number}`}</p>
                  </div>
                  <div
                    className={`bg-[url('/motifbackground90s.jpg')] bg-cover bg-center w-full h-full rounded-t-full flex flex-col overflow-hidden`}
                  >
                    <div className="flex-1 relative w-full">
                      <Image
                        src={image_link ? image_link : "/pdpdebase.png"}
                        alt={name}
                        fill
                        className="object-cover"
                        quality={100}
                      />
                    </div>
                    <div className="h-fit p-2 bg-black text-white uppercase flex items-center justify-center">
                      <div className="flex gap-2 justify-center items-center text-center font-righteous flex-5 ">
                        <div className="flex flex-col items-center">
                          <span className="text-sm">{firstName}</span>
                          <span className="text-xl">{lastNameParts}</span>
                        </div>
                      </div>
                      <div className=" flex-1">
                        <span className="flex items-center justify-center font-righteous text-md bg-white text-black rounded-full w-full aspect-square">
                          {formatPosition(position ?? "")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {flippedIds.length === 5 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleRedirectAndStore}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded mt-4 cursor-pointer"
          >
            Voir ma collection
          </button>
        </div>
      )}
    </>
  );
}
