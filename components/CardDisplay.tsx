"use client";

import Image from "next/image";
import { usePlayTogetherCtx } from "./GlobalContext";
import { TeamsData } from "./Teams";
import { PlayerData } from "@/interfaces/Interfaces";

type CardDisplayProps = {
    card: PlayerData;
    amount?: boolean;
    isNew?: boolean;
    onClick?: () => void;
    possessed: number;
};

export default function CardDisplay({ card, amount, isNew, onClick, possessed }: CardDisplayProps) {
    const { getBackgroundClass, getTeamLogo } = usePlayTogetherCtx();

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
                    <div className="w-full h-full rounded-tl-4xl rounded-br-4xl relative flex flex-col">
                        <div className="flex items-end gap-2">
                            <span className="text-lg font-righteous text-left">{firstName}</span>
                            <span className="text-2xl font-righteous text-left uppercase">{lastNameParts.join(" ")}</span>
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
                            <span className="font-outfit text-sm text-black">{mainTeam.team}</span>
                        </div>
                        <div className="absolute bottom-0 right-0 bg-white w-16 h-16 rounded-full flex items-center justify-center">
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
                    <p className="text-xl font-bold uppercase font-unbounded text-black">{card.name}</p>
                    <p className="text-sm font-outfit italic text-black/60 mt-2">Card not collected</p>
                </div>
            )}
        </div>
    );
}
