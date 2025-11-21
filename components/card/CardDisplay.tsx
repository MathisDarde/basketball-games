"use client";

import { PlayerData } from "@/interfaces/Interfaces";
import { usePlayTogetherCtx } from "../GlobalContext";
import Card1990s from "./1990sCard";
import Card2000s from "./2000sCard";
import Card2010s from "./2010sCard";

type CardDisplayProps = {
  card: PlayerData;
  isOwned: boolean;
  amount?: number;
  isNew?: boolean;
  onClick?: () => void;
};

export default function CardDisplay({
  card,
  isOwned,
  // amount,
  //   isNew,
  onClick,
}: CardDisplayProps) {
  const { getBackgroundClass } = usePlayTogetherCtx();

  const uniqueCardClasses = getBackgroundClass(card.rarity || "bronze");
  const backgroundClass = isOwned
    ? uniqueCardClasses || "bg-[url('/motifbackground90s.jpg')]"
    : "bg-gray-300";

  return (
    <div
      key={card.id}
      className={`relative w-[300px] h-[400px] p-2 mx-auto ${backgroundClass} shadow transition-shadow ${
        isOwned ? "cursor-pointer hover:shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      <>
        {/* {(amount ?? 0) > 1 && (
          <div className="absolute z-10 top-2/3 right-0 bg-black/60 text-white font-unbounded text-sm font-bold w-full h-10 flex items-center justify-center shadow-md">
            ×{amount}
          </div>
        )} */}
        {card.period === "1990s" ? (
          <Card1990s card={card} />
        ) : card.period === "2000s" ? (
          <Card2000s card={card} />
        ) : card.period === "2010s" ? (
          <Card2010s card={card} />
        ) : (
          <></>
        )}
      </>
    </div>
  );
}
