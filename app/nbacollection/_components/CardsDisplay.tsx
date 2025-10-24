"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { Card, Filters, PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { useState } from "react";
import { CardResearch } from "./CardResearch";
import { rarities } from "@/components/Rarity";
import { TeamsData } from "@/components/Teams";
import "@/css/rainbow.css";

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
    setFilters((prev) => ({ ...prev, [key]: value }) as Filters);
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
            const { id, name, awards, teams_history, image_link } = player;
            const isOwned = cardIds.includes(id);
            const uniqueCardClasses = getBackgroundClass(awards || []);
            const backgroundClass = isOwned
              ? uniqueCardClasses || "bg-[url('/motifbackground90s.jpg')]"
              : "bg-gray-300";

            const filteredTeams = teams_history.filter(({ team }) =>
              TeamsData.some((t) => t.names.includes(team))
            );

            if (filteredTeams.length === 0) return "Unknown";

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

            const [firstName, ...lastNameParts] = name.split(" ");

            return (
              <div
                key={id}
                className={`relative overflow-hidden w-[250px] h-[350px] sm:h-[400px] p-1 mx-auto ${backgroundClass} shadow transition-shadow ${
                  isOwned ? "cursor-pointer hover:shadow-lg" : "opacity-50"
                }`}
              >
                {isOwned ? (
                  <div className="bg-[#BB9754] h-full p-3 flex">
                    <div className="w-full h-full rounded-tl-4xl rounded-br-4xl relative flex flex-col">
                      <div className="flex items-end gap-2">
                        <span className="text-lg font-righteous text-left">
                          {firstName}
                        </span>
                        <span className="text-2xl font-righteous text-left uppercase">
                          {lastNameParts.join("")}
                        </span>
                      </div>
                      {/* Image au milieu qui prend tout l'espace restant */}
                      <div className="relative flex-1 w-full overflow-hidden">
                        <Image
                          src={image_link ?? "/pdpdebase.png"}
                          alt={name}
                          fill
                          className="object-cover rounded-t-full"
                          quality={100}
                        />
                      </div>
                      {/* Bloc bas avec équipe et position */}
                      <div className="bg-white px-2 py-1 rounded-br-full">
                        <span className="font-outfit text-sm text-black">
                          {mainTeam.team}
                        </span>
                      </div>

                      <div className="absolute bottom-0 right-0 bg-white w-16 h-16 aspect-square rounded-full flex items-center justify-center">
                        <Image
                          src={teamLogo || "/pdpdebase.png"}
                          width={40}
                          height={40}
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
