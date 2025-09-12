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
        <p>Streak {period}: {streak}</p>
    )
}