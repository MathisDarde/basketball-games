"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { Card, PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { teams } from "@/components/Teams";

export default function CardsDisplay({
  ownedCards,
  players,
  params,
}: {
  ownedCards: Card[];
  players: PlayerData[];
  params: { period: string };
}) {
  const { getTeamLogo, formatPosition, getBackgroundClass } =
    usePlayTogetherCtx();

  const { period } = params;

  const cardIds = ownedCards.map((card) => card.cardId);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-screen">
        {players.map((player) => {
          const {
            id,
            name,
            number,
            position,
            awards,
            teams_history,
            image_link,
          } = player;
          const isOwned = cardIds.includes(id);
          const nameParts = name.split(" ");
          const uniqueCardClasses = getBackgroundClass(awards || []);
          const backgroundClass = isOwned
            ? uniqueCardClasses || "bg-gray-200"
            : "bg-gray-300";

          const filteredTeams = teams_history.filter(({ team }) =>
            teams.some((t) => team.includes(t))
          );

          if (filteredTeams.length === 0) return "Unknown";

          const lastTeam = filteredTeams[filteredTeams.length - 1];
          const year =
            period === "1990s"
              ? 1995
              : period === "2000s"
              ? 2005
              : period === "2010s"
              ? 2015
              : 2025;

          const teamLogo = getTeamLogo(lastTeam.team, year);

          return (
            <div
              key={id}
              className={`relative overflow-hidden w-[250px] h-[350px] sm:h-[400px] mx-auto px-4 pb-4 pt-12 ${backgroundClass} rounded-lg shadow transition-shadow ${
                isOwned ? "cursor-pointer hover:shadow-lg" : "opacity-50"
              }`}
            >
              {isOwned ? (
                <>
                  <div className="relative text-sm text-gray-600 flex items-center gap-2">
                    <div className="absolute -top-9 -left-1">
                      {teamLogo && (
                        <Image
                          src={teamLogo}
                          alt={`${lastTeam.team} logo`}
                          width={50}
                          height={50}
                          className="inline-block size-14 object-fit"
                        />
                      )}
                    </div>
                  </div>
                  <div className="absolute right-4 top-3 rounded-full w-14 h-14 bg-black flex items-center justify-center">
                    <p className="italic font-unbounded text-lg text-white">{`#${number}`}</p>
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
                      <div className="flex gap-2 justify-center items-center text-center font-unbounded flex-5 ">
                        <div className="flex flex-col items-center">
                          <span className="text-xs">{nameParts[0]}</span>
                          <span className="text-lg">
                            {nameParts.slice(1).join(" ")}
                          </span>
                        </div>
                      </div>
                      <div className=" flex-1">
                        <span className="flex items-center justify-center font-righteous text-md bg-white text-black rounded-full w-full aspect-square">
                          {formatPosition(position ?? "")}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-center items-center w-full h-full text-center px-4">
                  <p className="text-xl font-bold uppercase font-unbounded text-black">
                    {name}
                  </p>
                  <p className="text-sm font-outfit italic text-black/60 mt-2">
                    Card not collected
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
