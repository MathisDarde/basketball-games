"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TeamLogos } from "./TeamLogos";

interface TeamHistory {
  period: string;
  team: string;
}

export interface PlayerData {
  name: string;
  wikipedia_url: string;
  teams_history: TeamHistory[];
  image_link: string;
}

interface PlayTogetherContextType {
  getRandomPlayers: (params: {
    numberPlayers: number;
    players: PlayerData[];
  }) => PlayerData[];
  getTeamLogo: (teamName: string) => string | undefined;
  players: PlayerData[];
  selectedPlayers: PlayerData[];
  setSelectedPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;
  teams: string[];
  havePlayedTogether: (player1: PlayerData, player2: PlayerData) => boolean;
  difficulty: number;
  setDifficulty: React.Dispatch<React.SetStateAction<number>>;
  endedRound: boolean;
  setEndedRound: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayTogetherContext = createContext<PlayTogetherContextType | undefined>(
  undefined
);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerData[]>([]);
  const [difficulty, setDifficulty] = useState(0);
  const [endedRound, setEndedRound] = useState(false);

  useEffect(() => {
    fetch("/data/player_data_teams_pics.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setPlayers(data))
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const getRandomPlayers = ({
    numberPlayers,
    players,
  }: {
    numberPlayers: number;
    players: PlayerData[];
  }): PlayerData[] => {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    setSelectedPlayers(shuffled.slice(0, numberPlayers));
    return selectedPlayers;
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

  const teams = [
    "Philadelphia 76ers",
    "Boston Celtics",
    "Los Angeles Lakers",
    "Golden State Warriors",
    "Miami Heat",
    "Chicago Bulls",
    "San Antonio Spurs",
    "Houston Rockets",
    "Dallas Mavericks",
    "Toronto Raptors",
    "Brooklyn Nets",
    "New York Knicks",
    "Los Angeles Clippers",
    "Denver Nuggets",
    "Utah Jazz",
    "Phoenix Suns",
    "Atlanta Hawks",
    "Charlotte Hornets",
    "Orlando Magic",
    "Indiana Pacers",
    "Detroit Pistons",
    "Milwaukee Bucks",
    "Minnesota Timberwolves",
    "Oklahoma City Thunder",
    "Portland Trail Blazers",
    "Sacramento Kings",
    "New Orleans Pelicans",
    "Memphis Grizzlies",
    "Washington Wizards",
    "Cleveland Cavaliers",
  ];

  return (
    <PlayTogetherContext.Provider
      value={{
        getRandomPlayers,
        getTeamLogo,
        players,
        selectedPlayers,
        setSelectedPlayers,
        teams,
        havePlayedTogether,
        difficulty,
        setDifficulty,
        endedRound,
        setEndedRound,
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
