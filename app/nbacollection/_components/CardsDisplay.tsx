"use client";

import { Card, Filters, PlayerData } from "@/interfaces/Interfaces";
import { useState } from "react";
import { CardResearch } from "./CardResearch";
import Link from "next/link";
import { slugifyName } from "@/utils/slugify-name";
import CardDisplay from "@/components/card/CardDisplay";

export default function CardsDisplay({
  ownedCards,
  players,
  period,
}: {
  ownedCards: Card[];
  players: PlayerData[];
  period: string;
}) {
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
      const playerRarity = player.rarity?.toLowerCase(); // normalise
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
    <div className="p-6">
      <CardResearch filters={filters} updateFilter={updateFilter} />

      {filteredPlayers.length === 0 ? (
        <p className="text-center font-outfit text-gray-500 mt-4 text-base sm:text-lg italic">
          No player was found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:max-w-[625px] lg:max-w-[950px] 2xl:max-w-[1250px] mx-auto mt-4">
          {filteredPlayers.map((player) => {
            const { id, name } = player;
            const isOwned = cardIds.includes(id);

            return (
              <Link
                href={`/nbacollection/${period}/${slugifyName(name)}`}
                key={id}
              >
                {isOwned ? (
                  <CardDisplay card={player} isOwned={isOwned} />
                ) : (
                  <div className="flex flex-col justify-center items-center text-center px-4 w-[300px] h-[400px] bg-gray-300 rounded-lg mx-auto">
                    <p className="text-xl font-bold uppercase font-unbounded text-gray-600">
                      {name}
                    </p>
                    <p className="text-sm font-outfit italic text-black/60 mt-2">
                      Card not collected
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
