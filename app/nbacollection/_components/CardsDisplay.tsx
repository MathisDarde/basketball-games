"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { Card, Filters, PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { teams } from "@/components/Teams";
import { useState } from "react";
import { CardResearch } from "./CardResearch";
import { rarities } from "@/components/Rarity";

export default function CardsDisplay({
  ownedCards,
  players,
}: {
  ownedCards: Card[];
  players: PlayerData[];
}) {
  const { getTeamLogo, getBackgroundClass } = usePlayTogetherCtx();

  const cardIds = ownedCards.map((card) => card.cardId);

  const [filters, setFilters] = useState<Filters>({
    query: "",
    owned: [],
    rarity: [],
    teams: [],
  });

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value } as Filters));
  };

  const filteredPlayers = players.filter((player) => {
    if (
      filters.query &&
      !player.name.toLowerCase().includes(filters.query.toLowerCase())
    ) {
      return false;
    }

    if (filters.owned.length > 0) {
      const isOwned = cardIds.includes(player.id);
      const status = isOwned ? "owned" : "notOwned";
      if (!filters.owned.includes(status)) {
        return false;
      }
    }

    if (filters.rarity.length > 0) {
      const playerClass = getBackgroundClass(player.awards || []) ?? "";
      const playerRarity = rarities.find((r) =>
        playerClass.includes(r.color)
      )?.name;
      if (!playerRarity || !filters.rarity.includes(playerRarity)) {
        return false;
      }
    }

    if (filters.teams.length > 0) {
      const inAny = filters.teams.some((fTeam) =>
        player.teams_history.some(({ team }) => team.includes(fTeam))
      );
      if (!inAny) return false;
    }

    return true;
  });

  return (
    <div>
      <CardResearch filters={filters} updateFilter={updateFilter} />

      {filteredPlayers.length === 0 ? (
        <p className="text-center font-outfit text-gray-500 mt-4">
          No player was found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-screen mt-4">
          {filteredPlayers.map((player) => {
            const { id, name, position, awards, teams_history, image_link } =
              player;
            const isOwned = cardIds.includes(id);
            const uniqueCardClasses = getBackgroundClass(awards || []);
            const backgroundClass = isOwned
              ? uniqueCardClasses || "bg-gray-200"
              : "bg-gray-300";

            const filteredTeams = teams_history.filter(({ team }) =>
              teams.some((t) => team.includes(t))
            );

            if (filteredTeams.length === 0) return "Unknown";

            const teamDurations = filteredTeams.map(({ team, period }) => {
              const [startStr, endStr] = period.split("–");
              const startYear = parseInt(startStr, 10);
              const endYear = parseInt(endStr, 10);
              const duration = endYear - startYear + 1;
              return { team, startYear, endYear, duration };
            });

            const mainTeam = teamDurations.reduce((max, t) =>
              t.duration > max.duration ? t : max
            );

            const teamLogo = getTeamLogo(mainTeam.team, mainTeam.endYear);

            const [firstName, ...lastNameParts] = name.split(" ");

            return (
              <div
                key={id}
                className={`relative overflow-hidden w-[250px] h-[350px] sm:h-[400px] p-1 mx-auto ${backgroundClass} shadow transition-shadow ${isOwned ? "cursor-pointer hover:shadow-lg" : "opacity-50"
                  }`}
              >
                {isOwned ? (
                  <div className="bg-white h-full p-2 flex">
                    <div className="w-full bg-gray-200 h-full rounded-tl-4xl rounded-br-4xl p-1 relative">
                      <div className="w-full h-full bg-white rounded-tl-4xl rounded-br-4xl">
                        <Image
                          src={image_link ?? "/pdpdebase.png"}
                          width={256}
                          height={256}
                          alt={name}
                          className="h-full w-full object-cover rounded-tl-4xl rounded-br-4xl"
                        />
                        <div className="mt-auto text-center px-4 py-1 bg-gray-200 leading-5 absolute bottom-0 left-0 w-4/5">
                          <p className="font-righteous text-xs">{firstName}</p>
                          <p className="font-righteous text-md">
                            {lastNameParts}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-200 w-16 h-16 rounded-full absolute bottom-0 right-0 flex items-center justify-center border">
                        <Image
                          src={teamLogo || "/pdpdebase.png"}
                          width={50}
                          height={50}
                          alt="Team Logo"
                        />
                      </div>
                    </div>
                  </div>
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
      )}
    </div>
  );
}

// {/* Nom du joueur en haut */}
// <div className="text-center">
//   <span className="text-2xl font-righteous">{name}</span>
// </div>

// {/* Image au milieu qui prend tout l'espace restant */}
// <div className="relative flex-1 w-full overflow-hidden">
//   <Image
//     src={image_link ?? "/pdpdebase.png"}
//     alt={name}
//     fill
//     className="object-cover"
//     quality={100}
//   />
// </div>

// {/* Bloc bas avec équipe et position */}
// <div className="flex flex-col items-center justify-center gap-1">
//   <span className="flex items-center justify-center font-outfit text-md text-black rounded">
//     {mainTeam.team}
//   </span>
//   <span className="flex items-center justify-center font-outfit text-md text-black rounded italic text-sm">
//     {position}
//   </span>
// </div>
