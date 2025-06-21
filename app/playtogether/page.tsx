"use client";

import { useState } from "react";
import GuessingBlock from "./_components/GuessingBlock";
import DisplayPlayers from "./_components/DisplayPlayers";
import { usePlayTogetherCtx } from "../_components/context";
import { useRouter } from "next/navigation";

export default function PlayTogetherPage() {
  const { setDifficulty, streakCount } = usePlayTogetherCtx();

  const [randomPlayers, setRandomPlayers] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("randomPlayers");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return [];
  });
  const router = useRouter();

  return (
    <>
      <h1 className="cursor-pointer" onClick={() => router.push("/")}>
        Back to home
      </h1>

      <div className="flex justify-between items-center">
        <select
          name="difficulty"
          onChange={(e) => setDifficulty(Number(e.target.value))}
        >
          <option value="0" defaultChecked>
            Easy
          </option>
          <option value="1">Medium</option>
          <option value="2">Hard</option>
        </select>

        <p>Streak : {streakCount}</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <DisplayPlayers
          randomPlayers={randomPlayers}
          setRandomPlayers={setRandomPlayers}
        />
        <div>
          <GuessingBlock
            setRandomPlayers={setRandomPlayers}
            randomPlayers={randomPlayers}
          />
        </div>
      </div>
    </>
  );
}
