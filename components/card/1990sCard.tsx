import { PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { TeamsData } from "../Teams";
import { usePlayTogetherCtx } from "../GlobalContext";
import simplifyTeamName from "@/utils/display-teamname-only";
import getTeamInfosByYear from "@/utils/get-teaminfos-by-year";

type Props = {
    card: PlayerData;
};

export default function Card1990s({ card }: Props) {
    const { getTeamLogo } = usePlayTogetherCtx();

    const filteredTeams = card.teams_history.filter(({ team }) =>
        TeamsData.some((t) => t.names.includes(team))
    );
    if (filteredTeams.length === 0) return null;
    console.log("filteredTeams", filteredTeams)

    const teamDurations = filteredTeams.map((team) => {
        const [startStr, endStrRaw] = team.period.split("–");
        const startYear = parseInt(startStr, 10);
        const endYear = endStrRaw
            ? endStrRaw.trim().toLowerCase() === "present"
                ? new Date().getFullYear()
                : parseInt(endStrRaw, 10)
            : startYear;
        const duration = endYear - startYear + 1;
        console.log("team", team)
        return { ...team, startYear, endYear, duration };
    });

    const mainTeam = teamDurations.reduce((max, t) =>
        t.duration > max.duration ? t : max
    );
    console.log("mainTeam", mainTeam)

    const teamLogo = getTeamLogo(mainTeam.team, mainTeam.endYear);
    const [firstName, ...lastNameParts] = card.name.split(" ");

    const teamShortName = simplifyTeamName(mainTeam.team);

    const teamData = TeamsData.find(t => t.names.includes(mainTeam.team));
    const teamInfos = teamData
        ? getTeamInfosByYear(teamData.periods, mainTeam.endYear)
        : null;
    console.log("teamInfos", teamInfos)

    const mainColor = teamInfos?.mainColor || "#000";
    const accentColor = teamInfos?.accentColor || "#aaa";
    console.log("colors", mainColor, accentColor)

    return (
        <div className="flex w-full relative bg-gray-100 overflow-hidden">
            {/* Bloc principal : image + nom */}
            <div className="flex-1 flex flex-col">
                <div className="relative flex-1 w-full overflow-hidden">
                    <Image
                        src={card.image_url ?? "/pdpdebase.png"}
                        alt={card.name}
                        fill
                        className="object-cover"
                        quality={100}
                    />
                </div>
                <div className={`flex items-center gap-1 text-white p-2`} style={{ backgroundColor: mainColor }}>
                    <span className="text-base font-outfit text-left">{firstName}</span>
                    <span className="text-lg font-outfit text-left uppercase">
                        {lastNameParts.join(" ")}
                    </span>
                </div>
            </div>

            {/* Bandeau vertical de l’équipe */}
            <div className={`w-12 flex items-center justify-center px-2 pt-2 pb-17`} style={{ backgroundColor: mainColor }}>
                <span
                    className={`text-sm font-unbounded text-xl uppercase whitespace-nowrap rotate-90`}
                    style={{
                        textShadow: "1px 1px 0px rgba(255, 255, 255, 0.9)",
                        color: accentColor
                    }}
                >
                    {teamShortName}
                </span>
            </div>

            {/* Logo de l’équipe */}
            <div className="absolute bottom-2 right-2 bg-gray-300 w-16 h-16 flex items-center justify-center rounded-md shadow-md">
                <Image
                    src={teamLogo || "/pdpdebase.png"}
                    width={40}
                    height={40}
                    alt="Team Logo"
                />
            </div>
        </div>
    );
}
