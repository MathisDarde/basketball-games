import { PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { TeamsData } from "../Teams";
import { usePlayTogetherCtx } from "../GlobalContext";

type Props = {
    card: PlayerData;
}

export default function Card1990s({ card }: Props) {
    const { getTeamLogo } = usePlayTogetherCtx();

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
        <div className="w-full h-full rounded-tl-4xl rounded-br-4xl relative flex flex-col">
            <div className="flex items-end gap-2">
                <span className="text-lg font-righteous text-left">{firstName}</span>
                <span className="text-2xl font-righteous text-left uppercase">{lastNameParts.join(" ")}</span>
            </div>
            <div className="relative flex-1 w-full overflow-hidden">
                <Image
                    src={card.image_url ?? "/pdpdebase.png"}
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
    )
}