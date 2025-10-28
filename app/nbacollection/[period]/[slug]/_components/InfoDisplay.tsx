"use client"

import Button from "@/components/CustomButton";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { TeamsData } from "@/components/Teams";
import { PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import Link from "next/link";

type InfoDisplayProps = {
    period: string;
    player: PlayerData;
    isOwned: boolean;
}

export default function InfoDisplay({ period, player, isOwned }: InfoDisplayProps) {
    const { getBackgroundClass, getTeamLogo } = usePlayTogetherCtx();

    const uniqueCardClasses = getBackgroundClass(player.awards || []);
    const backgroundClass = isOwned
        ? uniqueCardClasses || "bg-[url('/motifbackground90s.jpg')]"
        : "bg-gray-300";

    const filteredTeams = player.teams_history.filter(({ team }) =>
        TeamsData.some((t) => t.names.includes(team))
    );

    if (filteredTeams.length === 0) return "Unknown";

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

    const [firstName, ...lastNameParts] = player.name.split(" ");

    return (
        <>
            <div
                className={`relative overflow-hidden w-[250px] h-[350px] sm:h-[400px] p-1 mx-auto ${backgroundClass} shadow transition-shadow ${isOwned ? "cursor-pointer hover:shadow-lg" : "opacity-50"
                    }`}
            >
                {isOwned ? (
                    <div className="bg-[#BB9754] h-full p-3 flex">
                        <div className="w-full h-full rounded-tl-4xl rounded-br-4xl relative flex flex-col">
                            <div className="flex items-end gap-2">
                                <span className="text-lg font-unbounded text-left">
                                    {firstName}
                                </span>
                                <span className="text-2xl font-unbounded text-left uppercase">
                                    {lastNameParts.join("")}
                                </span>
                            </div>
                            {/* Image au milieu qui prend tout l'espace restant */}
                            <div className="relative flex-1 w-full overflow-hidden">
                                <Image
                                    src={player.image_link ?? "/pdpdebase.png"}
                                    alt={player.name}
                                    fill
                                    className="object-cover rounded-t-full"
                                    quality={100}
                                />
                            </div>
                            {/* Bloc bas avec équipe et position */}
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

                ) : (
                    <div className="flex flex-col justify-center items-center w-full h-full text-center px-4">
                        <p className="text-xl font-bold uppercase font-unbounded text-black">
                            {player.name}
                        </p>
                        <p className="text-sm font-outfit italic text-black/60 mt-2">
                            Card not collected
                        </p>
                    </div>
                )}
            </div>

            {isOwned ? (
                <div className="text-center my-4">
                    <p className="font-unbounded text-xl">{player.name} ({player.period})</p>
                    <p className="font-outfit text-sm">{player.position}</p>

                    <div className="flex flex-col items-start gap-2 font-outfit">
                        <h3 className="text-base underline">Career</h3>
                        {filteredTeams.map((team) => {
                            let endYear: number;
                            if (team.period.includes("–") || team.period.includes("-")) {
                                const parts = team.period.includes("–")
                                    ? team.period.split("–")
                                    : team.period.split("-");
                                const endStr = parts[1];
                                endYear =
                                    endStr?.trim().toLowerCase() === "present"
                                        ? new Date().getFullYear()
                                        : parseInt(endStr, 10);
                            } else {
                                endYear = parseInt(team.period, 10);
                            }

                            const logo = getTeamLogo(team.team, endYear);

                            return (
                                <div key={team.team + team.period} className="flex flex-row items-center gap-2">
                                    <Image
                                        src={logo || "/pdpdebase.png"}
                                        alt={`${team.team} logo`}
                                        width={50}
                                        height={50}
                                        className="w-10 h-10 object-contain"
                                    />
                                    <div className="flex flex-col items-start justify-center">
                                        <p className="text-sm">{team.team}</p>
                                        <p className="text-sm">{team.period}</p>
                                    </div>
                                </div>
                            );
                        })}

                        <h3 className="text-base underline">Awards</h3>
                        {player.awards && player.awards.length > 0 ? (
                            player.awards.map((award, index) => (
                                <p key={index} className="text-sm text-left">
                                    {award}
                                </p>
                            ))
                        ) : (
                            <p className="text-sm font-outfit italic text-gray-500">
                                This player has received no award.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-center my-4 font-outfit text-sm">You do not possess this card. Please get it in your collection to see this player's details.</p>

                    <Link href={`/nbacollection/${period}/dailydraw`}>
                        <Button size="default" theme="primary">
                            Go to my daily draw
                        </Button>
                    </Link>
                </>
            )}
        </>
    );
}