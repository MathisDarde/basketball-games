import { TeamsData } from "@/components/Teams";
import Image from "next/image";

export function getLatestTeamLogos(teamsData: typeof TeamsData) {
  return teamsData.map((team) => {
    const latestPeriod = team.periods[0];
    return {
      team: team.currentName,
      abr: latestPeriod.abr,
      logo: latestPeriod.logo,
    };
  });
}

export default function TeamsFilter({
  selectedTeams,
  onToggleTeam,
}: {
  selectedTeams: string[];
  onToggleTeam: (team: string) => void;
}) {
  const latestTeams = getLatestTeamLogos(TeamsData);

  return (
    <>
      {latestTeams.map((team) => (
        <button
          key={`${team.team}-${team.abr}`}
          className={`flex flex-col items-center gap-1 text-left text-xs hover:underline ${
            selectedTeams.includes(team.abr) ? "font-bold underline" : ""
          }`}
          onClick={() => onToggleTeam(team.team)}
        >
          <Image
            src={team.logo || "/pdpdebase.png"}
            width={30}
            height={30}
            alt={`${team.team} Logo`}
            className="w-8 h-8 object-contain"
          />
          <span className="font-light sm:font-medium font-unbounded">{team.abr}</span>
        </button>
      ))}
    </>
  );
}
