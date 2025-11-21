"use client";

import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import SubmitGuess from "./SubmitGuess";
import { useEffect, useMemo, useState } from "react";
import StreakCounter from "@/components/StreakCounter";
import { ParamValue } from "next/dist/server/request/params";
import { getRandomPlayers } from "@/utils/get-random-players";
import DropZoneInteraction from "./DropZoneInteraction";
import LargeScreenTeamInteraction from "./LargeScreenTeamInteraction";
import { TeamsData } from "@/components/Teams";
import Image from "next/image";

export default function CareerPathComponentWrapper({
  players,
  difficulty,
  period,
  lastStreak,
}: {
  players: PlayerData[];
  difficulty: string;
  period: ParamValue;
  userId: string | null;
  lastStreak: number;
}) {
  const [droppedTeams, setDroppedTeams] = useState<TeamsDataType[]>([]);
  const [streak, setStreak] = useState<number>(lastStreak);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerData>(
    getRandomPlayers({ numberPlayers: 1, players })
  );
  const [year, setYear] = useState<number>(2025);

  const filteredTeams: TeamsDataType[] = useMemo(() => {
    return currentPlayer.teams_history
      .map(({ team }) => TeamsData.find((t) => t.names.includes(team)))
      .filter(Boolean) as TeamsDataType[];
  }, [currentPlayer]);

  // Détermination de la période active du joueur
  const allYears = currentPlayer.teams_history
    .map(({ period }) => {
      const parts = period.includes("–")
        ? period.split("–")
        : period.split("-");
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
    if (minStart === maxEnd) activePeriod = `${minStart}`;
    else if (maxEnd === new Date().getFullYear())
      activePeriod = `${minStart}-present`;
    else activePeriod = `${minStart}-${maxEnd}`;
  }

  useEffect(() => {
    if (typeof period === "string") {
      switch (period) {
        case "1990s":
          setYear(1995);
          break;
        case "2000s":
          setYear(2005);
          break;
        case "2010s":
          setYear(2015);
          break;
        case "2020s":
          setYear(2025);
          break;
        default:
          setYear(2025);
          break;
      }
    }
  }, [period]);

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex flex-col items-center gap-4">
        <StreakCounter streak={streak} period={period} />

        <Image
          src={currentPlayer.face_image_url || "/pdpdebase.png"}
          width={100}
          height={100}
          alt="Player Picture"
          className="rounded-full"
        />
        <p className="font-unbounded text-2xl">{currentPlayer.name}</p>
        <p className="font-outfit font-light text-center text-medium">
          {activePeriod}
        </p>
        <p className="font-outfit font-light text-center text-sm">
          {currentPlayer.position}
        </p>
      </div>

      <DropZoneInteraction
        player={currentPlayer}
        filteredTeams={filteredTeams}
        droppedTeams={droppedTeams}
        setDroppedTeams={setDroppedTeams}
        difficulty={difficulty}
        year={year}
      />

      <div className="hidden lg:block">
        <LargeScreenTeamInteraction
          player={currentPlayer}
          teams={TeamsData}
          difficulty={difficulty}
          year={year}
        />
      </div>

      {/* 
      <SubmitGuess
        player={currentPlayer}
        droppedTeams={droppedTeams}
        filteredTeams={filteredTeams}
        difficulty={difficulty}
        setDroppedTeams={setDroppedTeams}
        setIsRevealed={setIsRevealed}
        isCorrect={isCorrect}
        setIsCorrect={setIsCorrect}
        setChecked={setChecked}
        userId={userId}
        period={period}
        streak={streak}
        setStreak={setStreak}
        regeneratePlayer={regeneratePlayer}
      />
  */}
    </div>
  );
}
