"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { useState } from "react";

import { Check, X } from "lucide-react";
import { PlayerData } from "@/interfaces/Interfaces";

export default function GuessingBlock({
  players,
  randomPlayers,
  setRandomPlayers,
}: {
  players: PlayerData[];
  randomPlayers: PlayerData[];
  setRandomPlayers: React.Dispatch<PlayerData[]>;
}) {
  const {
    getRandomPlayers,
    havePlayedTogether,
    endedRound,
    setEndedRound,
    streakCount,
    setStreakCount,
  } = usePlayTogetherCtx();

  const [endRoundMessage, setEndRoundMessage] = useState(0);

  const regeneratePlayers = () => {
    const newPlayers = getRandomPlayers({ numberPlayers: 2, players });
    setRandomPlayers(newPlayers);
  };

  const nextRound = () => {
    setEndedRound(false);
    regeneratePlayers();
    setEndRoundMessage(0);
  };

  const havePlayed =
    randomPlayers.length === 2
      ? havePlayedTogether(randomPlayers[0], randomPlayers[1])
      : false;

  return (
    <div className="mx-auto bg-gray-100 rounded-md p-4">
      {endRoundMessage === 0 && !endedRound && (
        <>
          <p>Have these players played together ?</p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEndedRound(true);
                setEndRoundMessage(1);
              }}
              className="bg-green-500 text-black flex-1"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setEndedRound(true);
                setEndRoundMessage(2);
              }}
              className="bg-red-500 text-white flex-1"
            >
              No
            </button>
          </div>
        </>
      )}
      {endRoundMessage === 1 && endedRound && (
        <>
          {havePlayed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500 rounded-full p-2 mb-2">
                <Check size={24} color="#fff" />
              </div>
              <p className="text-black">Great! They have played together.</p>
              <button
                onClick={() => {
                  nextRound();
                  setStreakCount(streakCount + 1);
                }}
                className="bg-blue-900 text-white rounded-md px-6 py-3 cursor-pointer"
              >
                Next round
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-red-500 rounded-full p-2 mb-2">
                <X size={24} color="#fff" />
              </div>
              <p className="text-black">
                Wrong answer! They have not played together.
              </p>
              <button
                onClick={() => {
                  nextRound();
                  setStreakCount(0);
                }}
                className="bg-blue-900 text-white rounded-md px-6 py-3 cursor-pointer"
              >
                Next round
              </button>
            </div>
          )}
        </>
      )}
      {endRoundMessage === 2 && endedRound && (
        <>
          {!havePlayed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500 rounded-full p-2 mb-2">
                <Check size={24} color="#fff" />
              </div>
              <p className="text-black">
                Great! They have not played together.
              </p>
              <button
                onClick={() => {
                  nextRound();
                  setStreakCount(streakCount + 1);
                }}
                className="bg-blue-900 text-white rounded-md px-6 py-3 cursor-pointer"
              >
                Next round
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-red-500 rounded-full p-2 mb-2">
                <X size={24} color="#fff" />
              </div>
              <p className="text-black">
                Wrong answer! They did play together.
              </p>
              <button
                onClick={() => {
                  nextRound();
                  setStreakCount(0);
                }}
                className="bg-blue-900 text-white rounded-md px-6 py-3 cursor-pointer"
              >
                Next round
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
