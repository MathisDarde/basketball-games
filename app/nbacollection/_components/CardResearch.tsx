"use client";

import { ChevronDown, Filter, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TeamsFilter from "./TeamsFilter";
import { rarities } from "@/components/Rarity";
import { Filters } from "@/interfaces/Interfaces";
import { TeamsData } from "@/components/Teams";

export const CardResearch = ({
  filters,
  updateFilter,
}: {
  filters: Filters;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [rarityMenuOpen, setRarityMenuOpen] = useState(false);
  const [teamsMenuOpen, setTeamsMenuOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
        setStatusMenuOpen(false);
        setRarityMenuOpen(false);
        setTeamsMenuOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  const toggleOwned = (status: "owned" | "notOwned") => {
    const next = filters.owned.includes(status)
      ? filters.owned.filter((s) => s !== status)
      : [...filters.owned, status];
    updateFilter("owned", next);
    setFilterOpen(false);
  };

  const toggleRarity = (name: string) => {
    const next = filters.rarity.includes(name)
      ? filters.rarity.filter((r) => r !== name)
      : [...filters.rarity, name];
    updateFilter("rarity", next);
    setFilterOpen(false);
  };

  const toggleTeam = (teamFullName: string) => {
    const next = filters.teams.includes(teamFullName)
      ? filters.teams.filter((t) => t !== teamFullName)
      : [...filters.teams, teamFullName];
    updateFilter("teams", next);
    setFilterOpen(false);
  };

  const clearFilter = (key: keyof Filters) => {
    switch (key) {
      case "query":
        updateFilter("query", "");
        break;
      case "owned":
        updateFilter("owned", []);
        break;
      case "rarity":
        updateFilter("rarity", []);
        break;
      case "teams":
        updateFilter("teams", []);
        break;
    }
  };

  const getAbrFromTeamName = (teamName: string) =>
    TeamsData.find((t) => t.names.includes(teamName))?.periods.at(-1)?.abr ??
    teamName;

  return (
    <>
      <div className="mx-auto max-w-[600px] relative">
        <input
          type="text"
          placeholder="Search for a card or a team"
          className="font-outfit text-sm sm:text-base rounded-sm w-full py-2 pl-4 pr-12 bg-white shadow"
          value={filters.query}
          onChange={(e) => updateFilter("query", e.target.value)}
        />
        <Filter
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setFilterOpen((p) => !p)}
        />
      </div>

      {filterOpen && (
        <div
          ref={filterRef}
          className="p-4 mx-4 mb-4 shadow-lg rounded-sm bg-white z-50 space-y-4 max-w-[600px] mx-auto"
        >
          {/* Colonne Status */}
          <div className="space-y-2">
            <div
              className="flex items-center justify-between"
              onClick={() => setStatusMenuOpen((prev) => !prev)}
            >
              <h4 className="text-sm sm:text-base font-unbounded">Status</h4>
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ease-out ${
                  statusMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {statusMenuOpen && (
              <>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-outfit font-light">
                  <input
                    type="checkbox"
                    checked={filters.owned.includes("owned")}
                    onChange={() => toggleOwned("owned")}
                  />
                  Owned
                </label>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-outfit font-light">
                  <input
                    type="checkbox"
                    checked={filters.owned.includes("notOwned")}
                    onChange={() => toggleOwned("notOwned")}
                  />
                  Not owned
                </label>
              </>
            )}
          </div>

          {/* Colonne Raretés */}
          <div className="space-y-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setRarityMenuOpen((p) => !p)}
            >
              <h4 className="text-sm sm:text-base font-unbounded">Rarity</h4>
              <ChevronDown
                size={20}
                className={rarityMenuOpen ? "rotate-180" : ""}
              />
            </div>

            {rarityMenuOpen &&
              rarities.map((rar) => (
                <button
                  key={rar.name}
                  className={`flex items-center gap-2 font-outfit text-xs sm:text-sm hover:underline ${
                    filters.rarity.includes(rar.name)
                      ? "font-bold underline"
                      : "font-light"
                  }`}
                  onClick={() => toggleRarity(rar.name)}
                >
                  <div
                    className={`w-3 h-3 ${rar.color} rounded-full border`}
                  ></div>
                  {rar.name}
                </button>
              ))}
          </div>

          {/* Colonnes bas - Teams */}
          <div className="space-y-2">
            <div
              className="flex items-center justify-between"
              onClick={() => setTeamsMenuOpen((prev) => !prev)}
            >
              <h4 className="text-sm sm:text-base font-unbounded">Teams</h4>
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ease-out ${
                  teamsMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {teamsMenuOpen && (
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                <TeamsFilter
                  selectedTeams={filters.teams}
                  onToggleTeam={toggleTeam}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mx-4 mt-2 flex flex-wrap gap-2 justify-center">
        {filters.query && (
          <div className="flex items-center gap-2 bg-accent-brown text-white font-outfit font-light px-2 py-1 rounded">
            <span className="text-sm sm:text-base">{filters.query}</span>
            <X
              size={14}
              onClick={() => clearFilter("query")}
              className="cursor-pointer hover:text-red-300"
            />
          </div>
        )}

        {filters.owned.map((s) => (
          <div
            key={s}
            className="flex items-center gap-2 bg-accent-brown text-white font-outfit text-sm font-light px-2 py-1 rounded"
          >
            <span className="text-sm sm:text-base">
              {s === "owned" ? "Owned" : "Not owned"}
            </span>
            <X
              size={14}
              onClick={() => toggleOwned(s)}
              className="cursor-pointer hover:text-red-300"
            />
          </div>
        ))}

        {filters.rarity.map((r) => (
          <div
            key={r}
            className="flex items-center gap-2 bg-accent-brown text-white font-outfit font-light px-2 py-1 rounded"
          >
            <span className="text-sm sm:text-base">{r}</span>
            <X
              size={14}
              onClick={() => toggleRarity(r)}
              className="cursor-pointer hover:text-red-300"
            />
          </div>
        ))}

        {filters.teams.map((teamFullName) => (
          <div
            key={teamFullName}
            className="flex items-center gap-2 bg-accent-brown text-white font-outfit font-light px-2 py-1 rounded"
          >
            <span className="text-sm sm:text-base">{getAbrFromTeamName(teamFullName)}</span>
            <X
              size={14}
              onClick={() => toggleTeam(teamFullName)}
              className="cursor-pointer hover:text-red-300"
            />
          </div>
        ))}
      </div>
    </>
  );
};
