"use client";

import { ParamValue } from "next/dist/server/request/params";

interface StreakCounterProps {
  streak: number;
  period: ParamValue;
}

export default function StreakCounter({ streak, period }: StreakCounterProps) {
  return (
    <p className="font-outfit">
      Streak {period}: <span className="font-bold ml-1">{streak}</span>
    </p>
  );
}
