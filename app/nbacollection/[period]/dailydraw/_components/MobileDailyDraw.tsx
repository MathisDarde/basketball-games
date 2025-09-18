"use client";

import { useState } from "react";
import Image from "next/image";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { PlayerData } from "@/interfaces/Interfaces";

type MobileDailyDrawProps = {
    players: PlayerData[];
    teams: string[];
    handleCardClick: (player: PlayerData) => Promise<void>;
    flippedInitial: string[];
};

export const MobileDailyDraw = ({ players, teams, handleCardClick, flippedInitial }: MobileDailyDrawProps) => {
    const { formatPosition, getBackgroundClass, getLastYear, getTeamLogo } = usePlayTogetherCtx();
    const [step, setStep] = useState(flippedInitial.length);

    const handleNext = async (player: PlayerData) => {
        await handleCardClick(player);
        setStep((prev) => prev + 1);
    };

    const remaining = players.length - step;

    return (
        <div className="relative w-full max-w-xs mx-auto mt-4 h-[500px] overflow-hidden">
            {players.map((player, index) => {
                const { teams_history } = player;
                const filteredTeams = teams_history.filter(({ team }) =>
                    teams.some((t) => team.includes(t))
                );
                if (filteredTeams.length === 0) return null;

                const teamDurations = filteredTeams.map(({ team, period }) => {
                    const [startStr, endStr] = period.split("–");
                    const startYear = parseInt(startStr, 10);
                    const endYear = parseInt(endStr, 10);
                    const duration = endYear - startYear + 1;
                    return { team, startYear, endYear, duration };
                });

                const mainTeam = teamDurations.reduce((max, t) =>
                    t.duration > max.duration ? t : max
                );

                const teamLogo = getTeamLogo(mainTeam.team, mainTeam.endYear);

                const backgroundClass = getBackgroundClass(player.awards);
                const [firstName, ...lastNameParts] = player.name.split(" ");

                const isActive = index === step;
                const isPast = index < step;

                return (
                    <div
                        key={player.id}
                        className={`absolute w-full h-[400px] rounded-lg cursor-pointer transition-all duration-500 ease-in-out`}
                        style={{
                            top: isPast ? '-500px' : 0, // cartes passées complètement hors écran
                            left: 0,
                            zIndex: players.length - index,
                        }}
                        onClick={() => isActive && handleNext(player)}
                    >
                        <div className={`relative overflow-hidden h-full rounded-lg shadow-lg ${backgroundClass}`}>
                            <div className="relative flex-1 w-full">
                                <Image
                                    src={player.image_link ?? "/pdpdebase.png"}
                                    alt={player.name}
                                    fill
                                    className="object-cover"
                                    quality={100}
                                />
                            </div>
                            <div className="h-16 p-2 bg-black text-white uppercase flex items-center justify-between">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm">{firstName}</span>
                                    <span className="text-xl">{lastNameParts.join(" ")}</span>
                                </div>
                                {teamLogo && (
                                    <Image
                                        src={teamLogo}
                                        alt="Team logo"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                )}
                                <span className="px-2 py-1 bg-white text-black rounded-full text-xs">
                                    {formatPosition(player.position ?? "")}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Counter */}
            {step < players.length && (
                <div className="absolute bottom-2 right-2 text-sm bg-black/50 text-white px-2 py-1 rounded">
                    {remaining} card{remaining > 1 ? "s" : ""} remaining
                </div>
            )}

            {/* Récap à la fin */}
            {step >= players.length && (
                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-4 rounded-lg">
                    <h2 className="text-lg font-bold mb-2">Pack revealed!</h2>
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-80 w-full">
                        {players.map((player) => {
                            const [firstName, ...lastNameParts] = player.name.split(" ");
                            const filteredTeams = player.teams_history.filter(({ team }) =>
                                teams.some((t) => team.includes(t))
                            );
                            if (filteredTeams.length === 0) return null;
                            const teamDurations = filteredTeams.map(({ team, period }) => {
                                const [startStr, endStr] = period.split("–");
                                const startYear = parseInt(startStr, 10);
                                const endYear = parseInt(endStr, 10);
                                const duration = endYear - startYear + 1;
                                return { team, startYear, endYear, duration };
                            });

                            const mainTeam = teamDurations.reduce((max, t) =>
                                t.duration > max.duration ? t : max
                            );

                            const teamLogo = getTeamLogo(mainTeam.team, mainTeam.endYear);
                            const backgroundClass = getBackgroundClass(player.awards);

                            return (
                                <div
                                    key={player.id}
                                    className={`relative h-40 rounded-lg shadow-lg overflow-hidden ${backgroundClass}`}
                                >
                                    <div className="relative flex-1 w-full">
                                        <Image
                                            src={player.image_link ?? "/pdpdebase.png"}
                                            alt={player.name}
                                            fill
                                            className="object-cover"
                                            quality={100}
                                        />
                                    </div>
                                    <div className="h-12 p-1 bg-black text-white uppercase flex items-center justify-between">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs">{firstName}</span>
                                            <span className="text-sm">{lastNameParts.join(" ")}</span>
                                        </div>
                                        {teamLogo && (
                                            <Image
                                                src={teamLogo}
                                                alt="Team logo"
                                                width={30}
                                                height={30}
                                                className="rounded-full"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
