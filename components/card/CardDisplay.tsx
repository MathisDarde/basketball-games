"use client";

import Image from "next/image";
import { PlayerData } from "@/interfaces/Interfaces";
import { usePlayTogetherCtx } from "../GlobalContext";
import { TeamsData } from "../Teams";
import Card1990s from "./1990sCard";
import Card2000s from "./2000sCard";

type CardDisplayProps = {
    card: PlayerData;
    amount?: boolean;
    isNew?: boolean;
    onClick?: () => void;
    possessed: number;
};

export default function CardDisplay({ card, amount, isNew, onClick, possessed }: CardDisplayProps) {
    const { getBackgroundClass } = usePlayTogetherCtx();

    const isOwned = possessed > 0;
    const uniqueCardClasses = getBackgroundClass(card.awards || []);
    const backgroundClass = isOwned
        ? uniqueCardClasses || "bg-[url('/motifbackground90s.jpg')]"
        : "bg-gray-300";

    return (
        <div
            key={card.id}
            className={`relative w-[250px] h-[350px] p-1 mx-auto ${backgroundClass} shadow transition-shadow ${isOwned ? "cursor-pointer hover:shadow-lg" : "opacity-50"
                }`}
            onClick={onClick}
        >
            {isOwned ? (
                <div className="bg-[#BB9754] h-full p-3 flex relative">
                    {amount && possessed > 1 && (
                        <div className="absolute z-10 top-2/3 right-0 bg-black/60 text-white font-unbounded text-sm font-bold w-full h-10 flex items-center justify-center shadow-md">
                            ×{possessed}
                        </div>
                    )}
                    {card.period === "1990s" ? (
                        <Card1990s card={card} />
                    ) : card.period === "2000s" ? (
                        <Card2000s card={card} />
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center w-full h-full text-center px-4">
                    <p className="text-xl font-bold uppercase font-unbounded text-black">{card.name}</p>
                    <p className="text-sm font-outfit italic text-black/60 mt-2">Card not collected</p>
                </div>
            )}
        </div>
    );
}
