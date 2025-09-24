import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import Image from "next/image";

type LargeScreenDailyDraw = {
  players: PlayerData[];
  teams: TeamsDataType[];
  handleCardClick: (player: PlayerData) => Promise<void>;
  flippedInitial: string[];
};

export const LargeScreenDailyDraw = ({
  players,
  teams,
  handleCardClick,
  flippedInitial,
}: LargeScreenDailyDraw) => {
  const { formatPosition, getBackgroundClass, getTeamLogo } =
    usePlayTogetherCtx();

  return (
    <div className="grid grid-cols-5 gap-2">
      {players.map((player) => {
        const isFlipped = flippedInitial.includes(player.id);
        const { teams_history } = player;

        const filteredTeams = teams_history.filter(({ team }) =>
          teams.some((t) => t.names.includes(team))
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

        const backgroundClass = getBackgroundClass(player.awards);
        const [firstName, ...lastNameParts] = player.name.split(" ");

        return (
          <div
            key={player.id}
            className="relative w-[288px] h-[400px] cursor-pointer border rounded overflow-hidden"
            onClick={() => handleCardClick(player)}
          >
            {!isFlipped ? (
              <div className="relative w-full h-full">
                <Image
                  src="/cardback.png"
                  alt="Back of the card"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className={`relative overflow-hidden h-[400px] px-4 pb-4 pt-12 ${backgroundClass} rounded-lg shadow transition-shadow`}
              >
                <div className="absolute -top-9 -left-1">
                  {teamLogo && (
                    <Image
                      src={teamLogo}
                      alt={`Team Logo`}
                      width={50}
                      height={50}
                      className="inline-block object-contain"
                    />
                  )}
                </div>

                <div className="bg-[url('/motifbackground90s.jpg')] bg-cover bg-center w-full h-full rounded-t-full flex flex-col overflow-hidden">
                  <div className="flex-1 relative w-full">
                    <Image
                      src={player.image_link ?? "/pdpdebase.png"}
                      alt={player.name}
                      fill
                      className="object-cover"
                      quality={100}
                    />
                  </div>

                  <div className="h-fit p-2 bg-black text-white uppercase flex items-center justify-center">
                    <div className="flex gap-2 justify-center items-center text-center font-righteous flex-5">
                      <div className="flex flex-col items-center">
                        <span className="text-sm">{firstName}</span>
                        <span className="text-xl">
                          {lastNameParts.join(" ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="flex items-center justify-center font-righteous text-md bg-white text-black rounded-full w-full aspect-square">
                        {formatPosition(player.position ?? "")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
