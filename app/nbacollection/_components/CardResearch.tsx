"use client"

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { TeamLogos } from "@/components/TeamLogos";
import { Filter } from "lucide-react"
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react";
import TeamsFilter from "./TeamsFilter";

export const CardResearch = ({ query, setQuery }: { query: string, setQuery: (value: string) => void }) => {
  const { getTeamLogo } = usePlayTogetherCtx();

  const [filterOpen, setFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const toggleFilter = () => setFilterOpen((prev) => !prev);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push("?" + params.toString()); // met à jour l’URL
  };

  function getLatestTeamLogos(teamLogos: typeof TeamLogos) {
    const latestMap = new Map<string, any>();

    teamLogos.forEach((team) => {
      const endStr = team.period.split(/[-–]/)[1]?.trim(); // gère "-" ou "–"
      const endYear =
        endStr?.toLowerCase().includes("present") || !endStr
          ? Infinity
          : parseInt(endStr, 10);

      const existing = latestMap.get(team.abr);

      if (!existing) {
        latestMap.set(team.abr, { ...team, endYear });
      } else if (endYear > existing.endYear) {
        latestMap.set(team.abr, { ...team, endYear });
      }
    });

    return Array.from(latestMap.values());
  }

  return (
    <>
      <div className="mx-4 relative">
        <input
          type="text"
          placeholder="Search for a card or a team"
          className="font-outfit text-sm rounded-sm w-full py-2 pl-4 pr-12 bg-white shadow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Filter
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={toggleFilter}
        />
      </div>

      {filterOpen && (
        <div className="p-4 mx-4 mb-4 shadow-lg rounded-sm bg-white z-50">
          <div className="grid grid-cols-2 gap-2">
            {/* Colonne gauche - Owned */}
            <div>
              <h4 className="text-sm mb-2 font-unbounded">Status</h4>
              <button
                className="block text-xs hover:underline font-outfit font-light"
                onClick={() => updateFilter("owned", "true")}
              >
                Owned
              </button>
              <button
                className="block text-xs hover:underline font-outfit font-light"
                onClick={() => updateFilter("owned", "false")}
              >
                Not Owned
              </button>
            </div>

            {/* Colonne droite - Raretés */}
            <div>
              <h4 className="text-sm mb-2 font-unbounded">Rarity</h4>
              {["Bronze", "Silver", "Gold", "Emerald", "Ruby", "Diamond"].map((rarity) => (
                <button
                  key={rarity}
                  className="block text-xs hover:underline font-outfit font-light"
                  onClick={() => updateFilter("rarity", rarity)}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>

          {/* Colonnes bas - Teams */}
          <div>
            <h4 className="text-sm mb-2 font-unbounded">Teams</h4>
            <div className="grid grid-cols-6 gap-2">
              <TeamsFilter updateFilter={updateFilter} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}