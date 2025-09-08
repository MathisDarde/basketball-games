"use client";

import React, { createContext, useContext, useState } from "react";
import { TeamLogos } from "./TeamLogos";
import { GridThemeData, PlayerData } from "@/interfaces/Interfaces";
import { teams } from "./Teams";

interface PlayTogetherContextType {
  getTeamLogo: (teamName: string, year: number) => string | undefined;
  getPlayerDivisions: (player: PlayerData) => string[];
  havePlayedTogether: (player1: PlayerData, player2: PlayerData) => boolean;
  difficulty: number;
  setDifficulty: React.Dispatch<React.SetStateAction<number>>;
  endedRound: boolean;
  setEndedRound: React.Dispatch<React.SetStateAction<boolean>>;
  streakCount: number;
  setStreakCount: React.Dispatch<React.SetStateAction<number>>;
  formatPosition: (position: string) => string;
  awardStyleCardBg: {
    readonly mvp: string;
    readonly all_nba: string;
    readonly all_star: string;
    readonly dpoy: string;
    readonly mip: string;
    readonly "6moy": string;
    readonly roty: string;
  };
  awardPriority: readonly string[];
  getBackgroundClass: (awards?: string[]) => string;
  getRandomGridThemes: (params: {
    numberThemes: number;
    themes: GridThemeData[];
  }) => GridThemeData[];
}

const PlayTogetherContext = createContext<PlayTogetherContextType | undefined>(
  undefined
);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [difficulty, setDifficulty] = useState(0);
  const [endedRound, setEndedRound] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  const getTeamLogo = (teamName: string, year: number): string | undefined => {
    return TeamLogos.find((t) => {
      if (t.team !== teamName) return false;

      const normalized = t.period.replace("–", "-").toLowerCase();
      const [from, to] = normalized.split("-");

      const fromYear = Number(from);
      const toYear =
        to && to.trim() === "present" ? new Date().getFullYear() : Number(to);

      return year >= fromYear && year <= toYear;
    })?.logo;
  };

  const getPlayerTeams = (player: PlayerData) => {
    return player.teams_history
      .filter(({ team }) => teams.includes(team))
      .map(({ team }) => team);
  };

  const getPlayerDivisions = (player: PlayerData) => {
    const playerTeams = getPlayerTeams(player);
    return divisions
      .filter((division) =>
        division.teams.some((team) => playerTeams.includes(team))
      )
      .map((division) => division.name);
  };

  const havePlayedTogether = (player1: PlayerData, player2: PlayerData) => {
    const currentYear = new Date().getFullYear();

    const parsePeriod = (period: string) => {
      // Normaliser le séparateur en "-"
      const normalized = period.replace("–", "-").toLowerCase();
      const [startRaw, endRaw] = normalized.split("-");

      const start = parseInt(startRaw, 10);
      let end: number;

      if (!endRaw) {
        // Cas "2005" → une seule année
        end = start;
      } else if (endRaw.trim() === "present") {
        end = currentYear;
      } else {
        end = parseInt(endRaw, 10);
      }

      return { start, end };
    };

    const player1Teams = getPlayerTeams(player1);
    const player2Teams = getPlayerTeams(player2);

    for (const team1 of player1.teams_history) {
      if (!player1Teams.includes(team1.team)) continue;

      for (const team2 of player2.teams_history) {
        if (!player2Teams.includes(team2.team)) continue;

        if (team1.team === team2.team) {
          const { start: start1, end: end1 } = parsePeriod(team1.period);
          const { start: start2, end: end2 } = parsePeriod(team2.period);

          // Vérifie s’il y a chevauchement d’années
          if (start1 <= end2 && start2 <= end1) {
            return true;
          }
        }
      }
    }

    return false;
  };

  function formatPosition(position: string | null | undefined): string {
    if (!position) return "";

    const firstPos = position.split("/")[0].trim().toLowerCase();

    const posMap: Record<string, string> = {
      "point guard": "PG",
      "shooting guard": "SG",
      "small forward": "SF",
      "power forward": "PF",
      center: "C",
    };

    return posMap[firstPos] || "";
  }

  const divisionNames = [
    "Atlantic",
    "Central",
    "Southeast",
    "Northwest",
    "Pacific",
    "Southwest",
  ];

  const divisions = divisionNames.map((name, i) => ({
    name,
    teams: teams.slice(i * 5, i * 5 + 5),
  }));

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

  const getRandomGridThemes = ({
    numberThemes,
    themes,
  }: {
    numberThemes: number;
    themes: GridThemeData[];
  }): GridThemeData[] => {
    return [...themes].sort(() => 0.5 - Math.random()).slice(0, numberThemes);
  };

  return (
    <PlayTogetherContext.Provider
      value={{
        getTeamLogo,
        getPlayerDivisions,
        havePlayedTogether,
        difficulty,
        setDifficulty,
        endedRound,
        setEndedRound,
        streakCount,
        setStreakCount,
        formatPosition,
        awardStyleCardBg,
        awardPriority,
        getBackgroundClass,
        getRandomGridThemes,
      }}
    >
      {children}
    </PlayTogetherContext.Provider>
  );
};

export const usePlayTogetherCtx = (): PlayTogetherContextType => {
  const context = useContext(PlayTogetherContext);
  if (!context) {
    throw new Error("usePlayTogetherCtx must be used within an AppProvider");
  }
  return context;
};
