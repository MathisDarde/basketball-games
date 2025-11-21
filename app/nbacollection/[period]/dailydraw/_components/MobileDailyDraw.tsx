"use client";

import { useState } from "react";
import { PlayerData } from "@/interfaces/Interfaces";
import CardDisplay from "@/components/card/CardDisplay";

type MobileDailyDrawProps = {
  players: PlayerData[];
  cardIds: string[];
  handleCardClick: (player: PlayerData) => void;
  flippedIds: string[];
};

export const MobileDailyDraw = ({
  players,
  handleCardClick,
  flippedIds,
}: MobileDailyDrawProps) => {
  const [step, setStep] = useState(flippedIds.length);

  const handleNext = async (player: PlayerData) => {
    await handleCardClick(player);
    setStep((prev) => prev + 1);
  };

  const remaining = players.length - step - 1;

  return (
    <div className="bg-light-beige">
      {/* Counter */}
      {step < players.length && (
        <div className="text-center">
          <div className="relative text-sm sm:text-base text-center bg-black/50 text-white px-2 py-1 rounded font-outfit font-light inline-flex">
            {remaining} card{remaining > 1 ? "s" : ""} remaining
          </div>
        </div>
      )}

      {step < players.length && (
        <div className="relative mx-auto mt-4 flex flex-col items-center">
          {players.map((player, index) => {
            const isActive = index === step;
            const isPast = index < step;

            return (
              <div
                key={player.id}
                className={`relative w-[250px] h-[350px] rounded-lg cursor-pointer transition-all duration-500 ease-in-out ${
                  isPast ? "opacity-0 -translate-y-[100px]" : "opacity-100"
                }`}
                style={{
                  zIndex: index === step ? 999 : players.length - index,
                  marginTop: index > 0 ? "-350px" : "0",
                  pointerEvents: isActive ? "auto" : "none",
                }}
                onClick={() => isActive && handleNext(player)}
              >
                <CardDisplay card={player} isOwned={true} />
              </div>
            );
          })}
        </div>
      )}

      <div>
        {/* Récap à la fin */}
        {step >= players.length && (
          <div className="relative bg-white items-center justify-center p-4 rounded-lg mx-6 h-[600px] overflow-y-auto">
            <h2 className="text-lg sm:text-2xl my-3 sm:my-6 font-unbounded text-center">
              Pack revealed!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:w-[550px] mx-auto place-items-center">
              {players.map((player) => {
                return (
                  <div key={player.id}>
                    <CardDisplay card={player} isOwned={true} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
