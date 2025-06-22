"use client";

import { usePlayTogetherCtx } from "@/app/_components/context";
import Image from "next/image";

export default function CardsDisplay() {
  const { players, teams, getTeamLogo, formatPosition } = usePlayTogetherCtx();

  return (
    <div>
      <p>Cards</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-[1200px]">
        {players.map((player) => {
          const { name, number, position, awards, teams_history, image_link } =
            player;

          const nameParts = name.split(" ");

          const awardStyleCardBg = {
            mvp: "bg-[url('/bluediamondbgtest.jpeg')]",
            all_nba: "bg-[url('/rubybgtest.jpg')]",
            all_star: "bg-[url('/goldbgtest.avif')]",
            dpoy: "bg-[url('/silverbgtest.jpg')]",
            mip: "bg-[url('/silverbgtest.jpg')]",
            "6moy": "bg-[url('/diamondbgtest.jpg')]",
            roty: "bg-[url('/silverbgtest.jpg')]",
          } as const;

          const awardPriority = [
            "mvp",
            "all_nba",
            "all_star",
            "dpoy",
            "mip",
            "6moy",
            "roty",
          ] as const;

          const getBackgroundClass = (awards: string[] = []) => {
            for (const key of awardPriority) {
              if (awards.some((a) => a.toLowerCase() === key)) {
                return awardStyleCardBg[key];
              }
            }
            return "";
          };

          const uniqueCardClasses = getBackgroundClass(awards || []);

          return (
            <div
              key={name}
              className={`relative overflow-hidden h-[400px] px-4 pb-4 pt-12 ${
                uniqueCardClasses || "bg-gray-200"
              } rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow`}
            >
              <p className="relative text-sm text-gray-600 flex items-center gap-2">
                {(() => {
                  const filteredTeams = teams_history.filter(({ team }) =>
                    teams.some((t) => team.includes(t))
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
              <div className="absolute right-4 top-3 rounded-full w-14 h-14 bg-black flex items-center justify-center">
                <p className=" italic font-righteous text-2xl text-white">{`#${number}`}</p>
              </div>
              <div
                className={`bg-[url('/motifbackground90s.jpg')] bg-cover bg-center w-full h-full rounded-t-full flex flex-col overflow-hidden`}
              >
                <div className="flex-1 relative w-full">
                  <Image
                    src={image_link ? image_link : "/pdpdebase.png"}
                    alt={name}
                    fill
                    className="object-cover"
                    quality={100}
                  />
                </div>
                <div className="h-fit p-2 bg-black  text-white uppercase flex items-center justify-center">
                  <p className="flex gap-2 justify-center items-center text-center font-righteous flex-5 ">
                    <div className="flex flex-col items-center">
                      <span className="text-sm">{nameParts[0]}</span>
                      <span className="text-xl">
                        {nameParts.slice(1).join(" ")}
                      </span>
                    </div>
                  </p>
                  <div className=" flex-1">
                    <span className="flex items-center justify-center font-righteous text-md bg-white text-black rounded-full w-full aspect-square">
                      {formatPosition(position)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
