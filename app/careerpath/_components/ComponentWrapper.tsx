"use client";

import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import SubmitGuess from "./SubmitGuess";
import ClientPlayerInteraction from "./ClientPlayerInteraction";
import ClientTeamInteraction from "./ClientTeamInteraction";
import { useEffect, useMemo, useState } from "react";
import MobileTeamInteraction from "./MobileTeamInteraction";
import { useScreenSize } from "@/utils/use-screen-size";
import StreakCounter from "@/components/StreakCounter";
import { ParamValue } from "next/dist/server/request/params";

export default function CareerPathComponentWrapper({
  player,
  teams,
  difficulty,
  period,
  userId,
  lastStreak,
}: {
  player: PlayerData;
  teams: TeamsDataType[];
  difficulty: string;
  period: ParamValue;
  userId: string | null;
  lastStreak: number;
}) {
  const [droppedTeams, setDroppedTeams] = useState<(string | null)[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isMobileTeamSelection, setIsMobileTeamSelection] = useState(false);
  const [isTeamPopupOpen, setIsTeamPopupOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(lastStreak);

  const { width } = useScreenSize();

  useEffect(() => {
    setIsMobileTeamSelection(width < 1024);
  }, [width]);

  // équipes utilisées pour le challenge (ordre)
  const filteredTeams = useMemo(
    () =>
      player.teams_history
        .filter(({ team }) => teams.some((t) => team.includes(t.currentName)))
        .map(({ team }) => team),
    [player, teams]
  );

  useEffect(() => {
    setDroppedTeams(Array(filteredTeams.length).fill(null));
    setIsRevealed(false);
    setIsCorrect(false);
    setChecked(false);
  }, [filteredTeams]);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <StreakCounter streak={streak} period={period} />
        <ClientPlayerInteraction
          player={player}
          filteredTeams={filteredTeams}
          droppedTeams={droppedTeams}
          setDroppedTeams={setDroppedTeams}
          isRevealed={isRevealed}
          checked={checked}
          setChecked={setChecked}
          setIsTeamPopupOpen={(open) => {
            if (!open) setActiveSlot(null);
            setIsTeamPopupOpen(open);
          }}
          setActiveSlot={setActiveSlot}
          width={width}
          period={period}
        />

        {isMobileTeamSelection ? (
          <MobileTeamInteraction
            teams={teams}
            isTeamPopupOpen={isTeamPopupOpen}
            setIsTeamPopupOpen={setIsTeamPopupOpen}
            onSelectTeam={(team) => {
              if (activeSlot === null) return;
              setDroppedTeams((prev) => {
                const next = [...prev];
                next[activeSlot] = team;
                return next;
              });
              setActiveSlot(null);
              setIsTeamPopupOpen(false);
            }}
            player={player}
            difficulty={difficulty}
            period={period}
          />
        ) : (
          <ClientTeamInteraction
            player={player}
            teams={teams}
            difficulty={difficulty}
            period={period}
          />
        )}
      </div>
      <SubmitGuess
        player={player}
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
      />
    </>
  );
}
