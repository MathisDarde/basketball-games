import { PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { TeamsData } from "../Teams";
import { usePlayTogetherCtx } from "../GlobalContext";
import getTeamInfosByYear from "@/utils/get-teaminfos-by-year";

type Props = {
  card: PlayerData;
};

export default function Card2000s({ card }: Props) {
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

  const teamData = TeamsData.find((t) => t.names.includes(mainTeam.team));
  const teamInfos = teamData
    ? getTeamInfosByYear(teamData.periods, mainTeam.endYear)
    : null;
  console.log("teamInfos", teamInfos);

  const mainColor = teamInfos?.mainColor || "#000";
  const accentColor = teamInfos?.accentColor || "#aaa";
  console.log("colors", mainColor, accentColor);

  return (
    <div
      className="h-full flex relative"
      style={{ backgroundColor: mainColor }}
    >
      <div className="w-full h-full rounded-tl-4xl rounded-br-4xl relative flex flex-col p-4">
        <div className="relative flex-1 w-full overflow-hidden rounded-md">
          <Image
            src={card.face_image_url ?? "/pdpdebase.png"}
            alt={card.name}
            fill
            className="object-cover border-3 rounded-md"
            style={{ borderColor: accentColor }}
            quality={100}
          />
        </div>
        <div className="absolute left-0 bottom-10 bg-white w-full h-[55px] flex items-center">
          <div className="min-w-[61px] flex items-center justify-center">
            <Image
              src={teamLogo || "/pdpdebase.png"}
              width={40}
              height={40}
              alt="Team Logo"
              className="size-11 object-contain"
            />
          </div>
          <div
            className="flex flex-col items-end justify-center text-right flex-7 pr-3 w-full h-full"
            style={{ backgroundColor: mainColor }}
          >
            <div className="flex items-center justify-center max-w-[200px] overflow-hidden">
              <span
                className="truncate text-center text-xl font-righteous uppercase leading-tight"
                style={{
                  color: accentColor,
                  textShadow: "1px 1px 0px rgba(255, 255, 255, 0.9)",
                  display: "block",
                  whiteSpace: "nowrap",
                }}
              >
                <span className="normal-case text-base">{firstName}</span>{" "}
                {lastNameParts.join(" ")}
              </span>
            </div>
            <span
              className="font-outfit italic text-xs"
              style={{ color: "#ffffff" }}
            >
              {mainTeam.team}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
