"use client";

import { useState } from "react";
import GuessingBlock from "./_components/GuessingBlock";
import DisplayPlayers from "./_components/DisplayPlayers";
import { usePlayTogetherCtx } from "../_components/context";

export default function PlayTogetherPage() {
  const { setDifficulty } = usePlayTogetherCtx();

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

  return (
    <>
      <div>
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
