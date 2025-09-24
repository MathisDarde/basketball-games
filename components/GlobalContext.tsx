"use client";

import React, { createContext, useContext, useState } from "react";
import { GridThemeData, PlayerData } from "@/interfaces/Interfaces";
import { TeamsData } from "./Teams";

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
  getLastYear: (period: string) => number;
  isCareerPathGood: (
    player: PlayerData,
    selectedTeams: (string | null)[],
    difficulty: string
  ) => { correct: boolean; message: string };
}

const PlayTogetherContext = createContext<PlayTogetherContextType | undefined>(
  undefined
);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [difficulty, setDifficulty] = useState(0);
  const [endedRound, setEndedRound] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  const getTeamLogo = (teamName: string, year: number): string | undefined => {
    const franchise = TeamsData.find((t) => t.names.includes(teamName));
    if (!franchise) return undefined;

    const periodMatch = franchise.periods.find((p) => {
      const normalized = p.period.replace("–", "-").toLowerCase();
      const [from, to] = normalized.split("-").map((x) => x.trim());

      const fromYear = Number(from);
      const toYear = to === "present" ? new Date().getFullYear() : Number(to);

      return year >= fromYear && year <= toYear;
    });

    return periodMatch?.logo;
  };

  const getPlayerTeams = (player: PlayerData) => {
    return player.teams_history
      .filter(({ team }) => TeamsData.some((t) => t.names.includes(team)))
      .map(({ team }) => team);
  };

  const getPlayerDivisions = (player: PlayerData) => {
    const playerTeams = getPlayerTeams(player);
    return TeamsData.filter((t) =>
      t.names.some((name) => playerTeams.includes(name))
    ).map((t) => t.division);
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

  const getLastYear = (period: string): number => {
    const normalized = period.replace("–", "-").toLowerCase();

    if (normalized.includes("-")) {
      const [, to] = normalized.split("-");

      if (to.trim() === "present") {
        return new Date().getFullYear();
      }

      return Number(to);
    }

    return Number(normalized);
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

  const isCareerPathGood = (
    player: PlayerData,
    selectedTeams: (string | null)[],
    difficulty: string
  ): { correct: boolean; message: string } => {
    const playerTeams = getPlayerTeams(player);

    const sameLength = selectedTeams.length === playerTeams.length;

    const isExactMatch =
      sameLength &&
      selectedTeams.every((team, idx) => team === playerTeams[idx]);

    if (isExactMatch) {
      return {
        correct: true,
        message: "Excellent, you found all the teams in order!",
      };
    }

    const wrongTeams = selectedTeams.filter(
      (team): team is string => !!team && !playerTeams.includes(team)
    );
    const missingTeams = playerTeams.filter(
      (team) => !selectedTeams.includes(team)
    );
    const correctButWrongPlace = selectedTeams.filter(
      (team, idx): team is string =>
        !!team && playerTeams.includes(team) && team !== playerTeams[idx]
    );

    if (difficulty === "easy") {
      return {
        correct: false,
        message: `That's wrong. ${
          correctButWrongPlace.length
        } teams are correct but in the wrong order. You got ${
          selectedTeams.filter((t, idx) => t === playerTeams[idx]).length
        } in the right spot. ${missingTeams.length} teams are missing. ${
          wrongTeams.length
        } don't belong.`,
      };
    } else {
      return {
        correct: false,
        message: `That's wrong. ${
          correctButWrongPlace.length
        } teams are correct but in the wrong order. You got ${
          selectedTeams.filter((t, idx) => t === playerTeams[idx]).length
        } in the right spot. ${missingTeams.length} teams are missing. ${
          wrongTeams.length
        } don't belong.`,
      };
    }
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
        getLastYear,
        isCareerPathGood,
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
