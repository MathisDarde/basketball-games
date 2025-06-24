"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TeamLogos } from "./TeamLogos";
import { authClient } from "@/utils/auth-client";

interface TeamHistory {
  period: string;
  team: string;
}

export interface PlayerData {
  id: string;
  name: string;
  wikipedia_url: string;
  teams_history: TeamHistory[];
  image_link: string;
  number: number;
  position: string;
  awards: string[];
}

interface PlayTogetherContextType {
  getRandomPlayers: (params: {
    numberPlayers: number;
    players: PlayerData[];
  }) => PlayerData[];
  getTeamLogo: (teamName: string) => string | undefined;
  players: PlayerData[];
  teams: string[];
  getPlayerDivisions: (player: PlayerData) => string[];
  havePlayedTogether: (player1: PlayerData, player2: PlayerData) => boolean;
  difficulty: number;
  setDifficulty: React.Dispatch<React.SetStateAction<number>>;
  endedRound: boolean;
  setEndedRound: React.Dispatch<React.SetStateAction<boolean>>;
  streakCount: number;
  setStreakCount: React.Dispatch<React.SetStateAction<number>>;
  formatPosition: (position: string) => string;
  getUserId: () => Promise<string | null>;
}

const PlayTogetherContext = createContext<PlayTogetherContextType | undefined>(
  undefined
);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [difficulty, setDifficulty] = useState(0);
  const [endedRound, setEndedRound] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await import("@/actions/players/getplayers").then((mod) =>
        mod.default()
      );

      if (Array.isArray(data)) {
        setPlayers(
          data.map((player) => ({
            ...player,
            teams_history: Array.isArray(player.teams_history)
              ? player.teams_history
              : [],
            awards: Array.isArray(player.awards) ? player.awards : [],
          }))
        );
      } else {
        setPlayers([]);
      }
    };

    fetchPlayers();
  }, []);

  const getUserId = async () => {
    const session = await authClient.getSession();
    const user_id = session?.data?.user.id || null;
    return user_id;
  };

  const getRandomPlayers = ({
    numberPlayers,
    players,
  }: {
    numberPlayers: number;
    players: PlayerData[];
  }): PlayerData[] => {
    return [...players].sort(() => 0.5 - Math.random()).slice(0, numberPlayers);
  };

  const getTeamLogo = (teamName: string): string | undefined => {
    return TeamLogos.find((t) => t.team === teamName)?.logo;
  };

  const getPlayerTeams = (player: PlayerData) => {
    console.log(player.teams_history);
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
      const [startRaw, endRaw] = period.split("–");

      const start = parseInt(startRaw, 10);
      const end = endRaw === "present" ? currentYear : parseInt(endRaw, 10);

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

  const teams = [
    "Philadelphia 76ers",
    "Boston Celtics",
    "New York Knicks",
    "Toronto Raptors",
    "Brooklyn Nets",
    "Cleveland Cavaliers",
    "Chicago Bulls",
    "Indiana Pacers",
    "Detroit Pistons",
    "Milwaukee Bucks",
    "Washington Wizards",
    "Miami Heat",
    "Atlanta Hawks",
    "Charlotte Hornets",
    "Orlando Magic",
    "Los Angeles Lakers",
    "Golden State Warriors",
    "Los Angeles Clippers",
    "Sacramento Kings",
    "Phoenix Suns",
    "San Antonio Spurs",
    "Houston Rockets",
    "Dallas Mavericks",
    "Memphis Grizzlies",
    "New Orleans Pelicans",
    "Denver Nuggets",
    "Utah Jazz",
    "Minnesota Timberwolves",
    "Oklahoma City Thunder",
    "Portland Trail Blazers",
  ];

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

  return (
    <PlayTogetherContext.Provider
      value={{
        getRandomPlayers,
        getTeamLogo,
        players,
        teams,
        getPlayerDivisions,
        havePlayedTogether,
        difficulty,
        setDifficulty,
        endedRound,
        setEndedRound,
        streakCount,
        setStreakCount,
        formatPosition,
        getUserId,
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
