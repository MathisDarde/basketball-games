import { usePlayTogetherCtx } from "@/components/context";
import Image from "next/image";

type TeamBlockProps = {
  availableTeams: string[];
};

export default function TeamBlock({ availableTeams }: TeamBlockProps) {
  const { getTeamLogo, difficulty, teams } = usePlayTogetherCtx();

  return (
    <>
      {difficulty === 0 ? (
        <div className="grid grid-cols-3 border rounded-md p-4">
          {availableTeams.length === 0 ? (
            <p className="text-gray-500 italic">Aucune équipe disponible</p>
          ) : (
            availableTeams.map((team, index) => {
              const teamLogo = getTeamLogo(team);
              return (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("team", team);
                    e.dataTransfer.setData("source", "logo");
                  }}
                  className="cursor-grab flex items-center gap-2 p-1"
                >
                  <Image
                    src={teamLogo || "/fallback-logo.png"}
                    width={40}
                    height={40}
                    alt="Team Logo"
                  />
                </div>
              );
            })
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 border rounded-md p-4">
            {teams.length === 0 ? (
              <p className="text-gray-500 italic">Aucune équipe disponible</p>
            ) : (
              teams.map((team, index) => {
                const teamLogo = getTeamLogo(team);
                return (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("team", team);
                      e.dataTransfer.setData("source", "logo");
                    }}
                    className="cursor-grab flex items-center gap-2 p-1"
                  >
                    <Image
                      src={teamLogo || "/fallback-logo.png"}
                      width={40}
                      height={40}
                      alt="Team Logo"
                    />
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </>
  );
}
