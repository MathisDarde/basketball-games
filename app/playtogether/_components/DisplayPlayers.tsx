"use client";

import { usePlayTogetherCtx } from "@/components/context";
import Image from "next/image";
import { useRef } from "react";

type DisplayPlayersProps = {
  randomPlayers: Player[];
  setRandomPlayers: (players: Player[]) => void;
};

type TeamHistory = {
  team: string;
  period: string;
};

type Player = {
  name: string;
  image_link: string;
  teams_history: TeamHistory[];
  wikipedia_url: string;
};

export default function DisplayPlayers({
  randomPlayers,
  setRandomPlayers,
}: DisplayPlayersProps) {
  const {
    getRandomPlayers,
    players,
    getTeamLogo,
    teams,
    difficulty,
    endedRound,
    getPlayerDivisions,
  } = usePlayTogetherCtx();

  console.log(difficulty);

  const hasInitialized = useRef(false);

  if (
    !hasInitialized.current &&
    players.length > 0 &&
    randomPlayers.length === 0
  ) {
    const selected = getRandomPlayers({ numberPlayers: 2, players });
    setRandomPlayers(selected);
    localStorage.setItem("randomPlayers", JSON.stringify(selected));
    hasInitialized.current = true;
  }

  return (
    <div className="flex items-center gap-2">
      {randomPlayers.map((player: Player, index: number) => {
        const { name, image_link, teams_history } = player;

        const allYears = teams_history
          .map(({ period }) => {
            const parts = period.split("–");

            let start: number;
            let end: number;

            if (parts.length === 1) {
              start = end = parseInt(parts[0], 10);
            } else {
              const [startRaw, endRaw] = parts;
              start = parseInt(startRaw, 10);
              end =
                endRaw === "present"
                  ? new Date().getFullYear()
                  : parseInt(endRaw, 10);
            }

            return { start, end };
          })
          .filter(({ start, end }) => !isNaN(start) && !isNaN(end));

        let activePeriod = "";
        if (allYears.length > 0) {
          const minStart = Math.min(...allYears.map(({ start }) => start));
          const maxEnd = Math.max(...allYears.map(({ end }) => end));

          if (minStart === maxEnd) {
            activePeriod = `${minStart}`;
          } else if (maxEnd === new Date().getFullYear()) {
            activePeriod = `${minStart}-present`;
          } else {
            activePeriod = `${minStart}-${maxEnd}`;
          }
        }

        return (
          <div
            key={index}
            className="player-card border p-4 my-4 rounded-md shadow flex-1"
          >
            {difficulty < 2 || endedRound ? (
              <Image
                src={image_link || "/pdpdebase.png"}
                alt={name}
                width={100}
                height={100}
                className="rounded-full mb-4"
              />
            ) : (
              <Image
                src="/playersilhouette.png"
                alt={name}
                width={100}
                height={100}
                className="rounded-full mb-4"
              />
            )}

            <h2 className="text-lg font-bold mb-2">{name}</h2>
            {(difficulty < 1 || endedRound) && <p>{activePeriod}</p>}
            {difficulty < 1 && !endedRound && (
              <div className="flex flex-col justify-start gap-2">
                <p>Divisions played in</p>

                {getPlayerDivisions(player).map((division, divIndex) => (
                  <p key={divIndex}>{division}</p>
                ))}
              </div>
            )}

            {endedRound && (
              <>
                {teams_history
                  .filter(({ team }) => teams.some((t) => team.includes(t)))
                  .map((singleTeam: TeamHistory, teamIndex: number) => {
                    const { team, period } = singleTeam;

                    const teamLogo: string | undefined = getTeamLogo(team);

                    return (
                      <div key={teamIndex} className="team-history my-2">
                        <div className="flex items-center gap-3">
                          <p>
                            <strong>Team:</strong> {team}
                          </p>
                          {teamLogo && (
                            <Image
                              src={teamLogo}
                              alt={`${team} logo`}
                              width={50}
                              height={50}
                              className="team-logo"
                            />
                          )}
                        </div>
                        <p>
                          <strong>Years:</strong> {period}
                        </p>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
