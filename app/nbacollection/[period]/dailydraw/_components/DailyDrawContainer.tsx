"use client";

import { PeriodTypes, PlayerData } from "@/interfaces/Interfaces";
import { useScreenSize } from "@/utils/use-screen-size";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LargeScreenDailyDraw } from "./LargeScreenDailyDraw";
import { MobileDailyDraw } from "./MobileDailyDraw";
import Button from "@/components/CustomButton";

type DailyDrawContainerProps = {
  players: PlayerData[];
  cardIds: string[];
  params: { period: PeriodTypes };
  flippedIds: string[];
  setFlippedIds: React.Dispatch<(value: string[]) => string[]>;
  remainingDraws: number;
  handleNewDraw: () => void;
};

export default function DailyDrawContainer({
  players,
  cardIds,
  params,
  flippedIds,
  setFlippedIds,
  remainingDraws,
  handleNewDraw,
}: DailyDrawContainerProps) {
  const { width } = useScreenSize();
  const router = useRouter();
  const { period } = params;

  const [mobileDailyDraw, setMobileDailyDraw] = useState(false);

  const handleCardClick = (player: PlayerData) => {
    if (flippedIds.includes(player.id)) return;
    setFlippedIds((prev) => [...prev, player.id]); // animation flip UI
  };

  const handleRedirect = () => router.push(`/nbacollection/${period}`);

  useEffect(() => {
    setMobileDailyDraw(width < 1024);
  }, [width]);

  return (
    <div>
      {mobileDailyDraw ? (
        <MobileDailyDraw
          players={players}
          cardIds={cardIds}
          handleCardClick={handleCardClick}
          flippedIds={flippedIds} // UI uniquement
        />
      ) : (
        <LargeScreenDailyDraw
          players={players}
          cardIds={cardIds}
          handleCardClick={handleCardClick}
          flippedIds={flippedIds} // UI uniquement
        />
      )}

      {flippedIds.length === 10 && (
        <div className="mt-4 text-center flex flex-col gap-2 items-center">
          {remainingDraws > 0 && (
            <Button onClick={handleNewDraw} size="default" theme="secondary">
              <p>
                Make a new draw ?<br />
                <span className="text-xs">
                  ({remainingDraws} free draw{remainingDraws > 1 ? "s" : ""}{" "}
                  remaining)
                </span>
              </p>
            </Button>
          )}

          <Button onClick={handleRedirect} size="large" theme="primary">
            See my collection
          </Button>
        </div>
      )}
    </div>
  );
}
