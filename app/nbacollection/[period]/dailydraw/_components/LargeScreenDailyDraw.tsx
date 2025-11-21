"use client";

import CardDisplay from "@/components/card/CardDisplay";
import { PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";

type LargeScreenDailyDrawProps = {
  players: PlayerData[];
  cardIds: string[];
  handleCardClick: (player: PlayerData) => void;
  flippedIds: string[];
};

export const LargeScreenDailyDraw = ({
  players,
  handleCardClick,
  flippedIds,
}: LargeScreenDailyDrawProps) => {
  return (
    <div className="grid grid-cols-3 2xl:grid-cols-4 gap-4 max-w-[950px] 2xl:max-w-[1250px] mx-auto mt-4">
      {players.map((player) => {
        const isFlipped = flippedIds.includes(player.id);

        return (
          <div
            key={player.id}
            className="relative w-[300px] h-[400px] cursor-pointer border rounded overflow-hidden"
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
              <CardDisplay card={player} isOwned={true} />
            )}
          </div>
        );
      })}
    </div>
  );
};
