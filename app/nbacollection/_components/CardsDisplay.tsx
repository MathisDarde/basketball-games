"use client";

import getUserCardsCollection from "@/actions/cardcollection/getusercards";
import { usePlayTogetherCtx } from "@/components/context";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CardsDisplay() {
  const [ownedCardIds, setOwnedCardIds] = useState<string[]>([]);
  const {
    players,
    teams,
    getTeamLogo,
    formatPosition,
    getUserId,
    getBackgroundClass,
  } = usePlayTogetherCtx();

  useEffect(() => {
    async function loadCards() {
      const id_user = await getUserId();
      if (id_user) {
        const owned = await getUserCardsCollection(id_user);
        let ids: string[] = [];
        if (Array.isArray(owned)) {
          ids = owned.map((c) => c.cardId);
        }
        setOwnedCardIds(ids);
      }
    }

    loadCards();
  }, [getUserId]);

  return (
    <div>
      <p>Cards</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-[1200px]">
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
          const isOwned = ownedCardIds.includes(id);
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
          const { team } = lastTeam;
          const teamLogo = getTeamLogo(team);

          return (
            <div
              key={id}
              className={`relative overflow-hidden h-[400px] px-4 pb-4 pt-12 ${backgroundClass} rounded-lg shadow transition-shadow ${
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
                          alt={`${team} logo`}
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
                          <span className="text-sm">{nameParts[0]}</span>
                          <span className="text-xl">
                            {nameParts.slice(1).join(" ")}
                          </span>
                        </div>
                      </div>
                      <div className=" flex-1">
                        <span className="flex items-center justify-center font-righteous text-md bg-white text-black rounded-full w-full aspect-square">
                          {formatPosition(position)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-center items-center h-full text-center px-4">
                  <p className="text-xl font-bold uppercase font-righteous text-black">
                    {name}
                  </p>
                  <p className="text-sm italic text-black/60 mt-2">
                    Carte non possédée
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
