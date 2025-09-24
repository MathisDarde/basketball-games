"use client";

import { useState } from "react";
import StreakCounter from "@/components/StreakCounter";
import PageContent from "../_components/PageContent";
import { PeriodTypes, PlayerData } from "@/interfaces/Interfaces";

export default function PlayTogetherWrapper({
  players,
  userId,
  lastStreak,
  period,
  difficulty,
}: {
  players: PlayerData[];
  userId: string | null;
  lastStreak: number;
  period: PeriodTypes;
  difficulty: string;
}) {
  const [streak, setStreak] = useState<number>(lastStreak);

  return (
    <div className="p-4">
      <StreakCounter streak={streak} period={period} />
      <PageContent
        players={players}
        period={period}
        userId={userId}
        streak={streak}
        setStreak={setStreak}
        difficulty={difficulty}
      />
    </div>
  );
}
