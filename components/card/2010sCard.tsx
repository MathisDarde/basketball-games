import { PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import { TeamsData } from "../Teams";
import { usePlayTogetherCtx } from "../GlobalContext";
import getTeamInfosByYear from "@/utils/get-teaminfos-by-year";

type Props = {
  card: PlayerData;
};

export default function Card2010s({ card }: Props) {
  const { getTeamLogo } = usePlayTogetherCtx();

  const filteredTeams = card.teams_history.filter(({ team }) =>
    TeamsData.some((t) => t.names.includes(team))
  );
  if (filteredTeams.length === 0) return null;

  const teamDurations = filteredTeams.map((team) => {
    const [startStr, endStrRaw] = team.period.split("–");
    const startYear = parseInt(startStr, 10);
    const endYear = endStrRaw
      ? endStrRaw.trim().toLowerCase() === "present"
        ? new Date().getFullYear()
        : parseInt(endStrRaw, 10)
      : startYear;
    const duration = endYear - startYear + 1;
    return { ...team, startYear, endYear, duration };
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

  const mainColor = teamInfos?.mainColor || "#000";
  const accentColor = teamInfos?.accentColor || "#aaa";

  return (
    <div className={`${mainColor} h-full flex relative`}>
      <div className="flex w-full relative bg-gray-100 overflow-hidden">
        {/* Bloc principal : image + nom */}
        <div className="flex-1 flex flex-col">
          <div></div>
          <div className="relative flex-1 w-full overflow-hidden">
            <Image
              src={card.face_image_url ?? "/pdpdebase.png"}
              alt={card.name}
              fill
              className="object-cover"
              quality={100}
            />
          </div>
          <div
            className={`relative flex items-center gap-1 text-white text-center font-outfit p-2`}
            style={{
              backgroundColor: mainColor,
              border: "5px double white",
            }}
          >
            <div
              style={{
                backgroundColor: mainColor,
                border: "2px solid white",
              }}
              className="absolute -top-[27px] left-1/2 -translate-x-1/2 w-[65%]"
            >
              <span style={{ color: "white" }} className="text-center text-sm">
                {mainTeam.team}
              </span>
            </div>
            <div className="flex items-center justify-center w-full overflow-hidden">
              <span
                className="truncate text-center text-xl font-unbounded uppercase leading-tight"
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
          </div>
        </div>

        {/* Logo de l’équipe */}
        <div className="absolute top-2 right-2 w-13 h-13 flex items-center justify-center">
          <Image
            src={teamLogo || "/pdpdebase.png"}
            width={40}
            height={40}
            alt="Team Logo"
            className="max-w-13 max-h-13 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
