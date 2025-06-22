"use client";

import { usePlayTogetherCtx } from "@/app/_components/context";
import Image from "next/image";

export default function CardsDisplay() {
  const { players, teams, getTeamLogo } = usePlayTogetherCtx();

  const starPlayers = [
    "Joel Embiid",
    "Giannis Antetokounmpo",
    "Stephen Curry",
    "LeBron James",
    "Nikola Jokić",
    "Kawhi Leonard",
    "Victor Wembanyama",
    "LaMelo Ball",
    "Jalen Brunson",
    "Trae Young",
    "Kyrie Irving",
    "Jordan Poole",
    "Lauri Markkanen",
    "Domantas Sabonis",
    "Kevin Durant",
    "Zion Williamson",
    "Scottie Barnes",
    "Cade Cunningham",
    "Tyrese Haliburton",
    "Shai Gilgeous-Alexander",
    "Jerami Grant",
    "Anthony Edwards",
    "Ja Morant",
    "Donovan Mitchell",
    "Paolo Banchero",
    "Bam Adebayo",
    "D'Angelo Russell",
    "Jayson Tatum",
    "Coby White",
    "Alperen Şengün",
  ];

  return (
    <div>
      <p>Cards</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-[1200px]">
        {players.map((player) => {
          const fullName = player.name;
          const nameParts = fullName.split(" ");

          const isStar = starPlayers.includes(player.name);
          const specialClass = isStar ? "bg-yellow-500" : "bg-gray-200";

          return (
            <div
              key={player.name}
              className={`h-[400px] px-4 pb-4 pt-12 ${specialClass} rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow`}
            >
              <p className="relative text-sm text-gray-600 flex items-center gap-2">
                {(() => {
                  const filteredTeams = player.teams_history.filter(
                    ({ team }) => teams.some((t) => team.includes(t))
                  );

                  if (filteredTeams.length === 0) return "Unknown";

                  const lastTeam = filteredTeams[filteredTeams.length - 1];
                  const { team } = lastTeam;
                  const teamLogo = getTeamLogo(team);

                  return (
                    <div className="absolute -top-9 -left-1">
                      {teamLogo && (
                        <Image
                          src={teamLogo}
                          alt={`${team} logo`}
                          width={50}
                          height={50}
                          className="inline-block size-14 object-fit"
                        />
                      )}
                    </div>
                  );
                })()}
              </p>
              <div className="bg-[url('/motifbackground90s.jpg')] bg-cover bg-center w-full h-full rounded-t-full flex flex-col overflow-hidden">
                <div className="flex-1 relative w-full">
                  <Image
                    src={
                      player.image_link ? player.image_link : "/pdpdebase.png"
                    }
                    alt={player.name}
                    fill
                    className="object-cover"
                    quality={100}
                  />
                </div>
                <div className="h-fit p-2 w-full bg-black flex items-center justify-center text-white uppercase">
                  <p className="flex gap-2 items-center text-center font-righteous">
                    <span className="text-sm">{nameParts[0]}</span>
                    <span className="text-xl">
                      {nameParts.slice(1).join(" ")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

{
  /* <Image
              src={player.image_link ? player.image_link : "/pdpdebase.png"}
              alt={player.name}
              className="mb-2 w-[350px] h-[254px] object-cover rounded-md"
              width={350}
              height={254}
              quality={100}
            />
            <h3 className="text-lg font-semibold">{player.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              Current team:{" "}
              {(() => {
                const filteredTeams = player.teams_history.filter(({ team }) =>
                  teams.some((t) => team.includes(t))
                );

                if (filteredTeams.length === 0) return "Unknown";

                const lastTeam = filteredTeams[filteredTeams.length - 1];
                const { team } = lastTeam;
                const teamLogo = getTeamLogo(team);

                return (
                  <>
                    {teamLogo && (
                      <Image
                        src={teamLogo}
                        alt={`${team} logo`}
                        width={20}
                        height={20}
                        className="inline-block"
                      />
                    )}
                    <span>{team}</span>
                  </>
                );
              })()}
            </p> */
}
