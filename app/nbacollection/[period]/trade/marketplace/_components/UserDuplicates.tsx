"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { TeamsData } from "@/components/Teams";
import { Card, PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { useState } from "react";

type UserDuplicatesProps = {
  usersCards: Card[];
  cardInfos: PlayerData[];
  cardIds: string[];
};

export default function UserDuplicates({
  usersCards,
  cardIds,
  cardInfos,
}: UserDuplicatesProps) {
  const { getBackgroundClass, getTeamLogo } = usePlayTogetherCtx();

  const [selectedCard, setSelectedCard] = useState<PlayerData | null>(null);

  if (selectedCard) {
    return (
      <div className="bg-white p-6 rounded-lg shadow max-h-[700px] overflow-y-auto">
        <button
          onClick={() => setSelectedCard(null)}
          className="mb-4 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
        <div className="flex flex-col items-center text-center">
          <Image
            src={selectedCard.image_link ?? "/pdpdebase.png"}
            alt={selectedCard.name}
            width={200}
            height={300}
            className="rounded-lg shadow"
          />
          <h2 className="font-unbounded text-xl mt-4">{selectedCard.name}</h2>
          <p className="text-sm text-gray-600">
            {selectedCard.position} — {selectedCard.period}
          </p>
          <div className="mt-6">
            <p>➡️ Ici tu peux ajouter le résumé, les options d’échange, etc.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 space-y-4 max-h-[700px] overflow-y-auto rounded-lg shadow">
      <h2 className="text-xl sm:text-2xl font-medium text-center font-unbounded">
        My duplicates
      </h2>

      {/* seed invisible pour garder les classes Tailwind */}
      <div className="hidden">
          bg-amber-700 bg-slate-100 bg-yellow-400 bg-emerald-400 bg-red-500 bg-cyan-300
          text-amber-700 text-slate-100 text-yellow-400 text-emerald-400 text-red-500 text-cyan-300
        </div>

      <div className="grid grid-cols-4 gap-4 place-items-center">
        {cardInfos.map((card) => {
          const userCard = usersCards.find((c) => c.cardId === card.id); // 👈 carte du user
          const possessed = userCard?.possessed ?? 0; // 👈 nombre possédé
          const isOwned = possessed > 0;

          const uniqueCardClasses = getBackgroundClass(card.awards || []);
          const backgroundClass = isOwned
            ? uniqueCardClasses || "bg-[url('/motifbackground90s.jpg')]"
            : "bg-gray-300";

          const filteredTeams = card.teams_history.filter(({ team }) =>
            TeamsData.some((t) => t.names.includes(team))
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
          const [firstName, ...lastNameParts] = card.name.split(" ");

          return (
            <div
              key={card.id}
              className={`relative w-[250px] h-[350px] p-1 mx-auto ${backgroundClass} shadow transition-shadow ${
                isOwned ? "cursor-pointer hover:shadow-lg" : "opacity-50"
              }`}
              onClick={() => setSelectedCard(card)}
            >
              {/* 🔴 Nombre possédé */}
              {possessed > 1 && (
                <div className="absolute z-10 top-2/3 right-0 bg-black opacity-50 text-white font-unbounded text-sm font-bold w-full h-10 flex items-center justify-center shadow-md">
                  ×{possessed}
                </div>
              )}

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

                  <div className="relative flex-1 w-full overflow-hidden">
                    <Image
                      src={card.image_link ?? "/pdpdebase.png"}
                      alt={card.name}
                      fill
                      className="object-cover rounded-t-full"
                      quality={100}
                    />
                  </div>

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
            </div>
          );
        })}
      </div>
    </div>
  );
}
