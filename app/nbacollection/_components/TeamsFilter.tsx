import { TeamLogos } from "@/components/TeamLogos";
import Image from "next/image";

function getLatestTeamLogos(teamLogos: typeof TeamLogos) {
  const latestMap = new Map<string, any>();

  teamLogos.forEach((team) => {
    const endStr = team.period.split(/[-–]/)[1]?.trim();
    const endYear =
      endStr?.toLowerCase().includes("present") || !endStr
        ? Infinity
        : parseInt(endStr, 10);

    // ⚡️ clé unique par nom + abréviation
    const key = `${team.team}-${team.abr}`;
    const existing = latestMap.get(key);

    if (!existing || endYear > existing.endYear) {
      latestMap.set(key, { ...team, endYear });
    }
  });

  return Array.from(latestMap.values());
}

export default function TeamsFilter({
  selectedTeams,
  onToggleTeam,
}: {
  selectedTeams: string[];
  onToggleTeam: (team: string) => void;
}) {
  const latestTeams = getLatestTeamLogos(TeamLogos);

  return (
    <>
      {latestTeams.map((team) => (
        <button
          key={`${team.team}-${team.abr}`}
          className={`flex flex-col items-center gap-1 text-left text-xs hover:underline ${selectedTeams.includes(team.abr) ? "font-bold underline" : ""
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
          <span className="font-light font-unbounded">{team.abr}</span>
        </button>
      ))}
    </>
  );
}
