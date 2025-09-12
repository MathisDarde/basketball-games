"use client";

import { useState } from "react";
import StreakCounter from "@/components/StreakCounter";
import PageContent from "../_components/PageContent";
import { PeriodTypes, PlayerData } from "@/interfaces/Interfaces";
import { teams } from "@/components/Teams";

export default function PlayTogetherWrapper({
  players,
  userId,
  lastStreak,
  period,
}: {
  players: PlayerData[];
  userId: string | null;
  lastStreak: number;
  period: PeriodTypes;
}) {
    const [streak, setStreak] = useState<number>(lastStreak);

  return (
    <div className="p-4">
      <StreakCounter streak={streak} period={period} />
      <PageContent
        players={players}
        teams={teams}
        period={period}
        userId={userId}
        streak={streak}
        setStreak={setStreak}
      />
    </div>
  );
}
