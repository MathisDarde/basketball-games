"use client"

interface StreakCounterProps {
    streak: number;
    period: string;
  }

export default function StreakCounter({
    streak,
    period,
  }: StreakCounterProps) {

    return (
        <p className="font-outfit">Streak {period}: <span className="font-bold ml-1">{streak}</span></p>
    )
}