"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { useState } from "react";
import { getRandomPlayers } from "@/utils/get-random-players";
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
    <div className={`mx-auto p-4 w-[300px]`}>
      {endRoundMessage === 0 && !endedRound && (
        <div className="flex flex-col items-center gap-3">
          <p className={`text-center font-outfit font-normal`}>Have these players played together ?</p>

          <div className="relative">
            {/* Ombre
            <span
              className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black
                 translate-x-[6px] translate-y-[6px]"
            ></span> */}
            <button
              onClick={() => {
                setEndedRound(true);
                setEndRoundMessage(1);
              }}
              className={`relative w-[200px] px-6 py-3 font-medium text-white 
              bg-[#ac7434] rounded-lg
              active:translate-x-[1px] active:translate-y-[1px] 
              transition-transform font-unbounded cursor-pointer`}
            >
              Yes
            </button>

          </div>

          <div className="relative">
            {/* Ombre
            <span
              className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black
                 translate-x-[6px] translate-y-[6px]"
            ></span> */}
            <button
              onClick={() => {
                setEndedRound(true);
                setEndRoundMessage(2);
              }}
              className={`relative w-[200px] px-6 py-3 font-medium text-white 
                 bg-[#6B2F4B] rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer`}
            >
              No
            </button>
          </div>
        </div>
      )}
      {endRoundMessage === 1 && endedRound && (
        <>
          {havePlayed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500 rounded-full p-2 mb-2">
                <Check size={24} color="#fff" />
              </div>
              <p className={`font-outfit font-normal text-center`}>
                Great! They have played together.
              </p>

              <div className="relative">
               {/* <span
                  className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black 
                 translate-x-[6px] translate-y-[6px]"
          ></span> */}
                <button
                  onClick={() => {
                    nextRound();
                    setStreakCount(streakCount + 1);
                  }}
                  className={`relative w-[200px] px-6 py-3 font-medium text-white 
                 bg-[#ac7434] rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer`}
                >
                  Next round
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-red-500 rounded-full p-2 mb-2">
                <X size={24} color="#fff" />
              </div>
              <p className={`font-outfit font-normal text-center`}>
                Wrong answer! They have not played together.
              </p>
              <div className="relative">
               {/* <span
                  className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black 
                 translate-x-[6px] translate-y-[6px]"
          ></span> */}
                <button
                  onClick={() => {
                    nextRound();
                    setStreakCount(0);
                  }}
                  className={`relative w-[200px] px-6 py-3 font-medium text-white 
                 bg-[#ac7434] rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer`}
                >
                  Next round
                </button>
              </div>
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
              <p className={`font-outfit font-normal text-center`}>
                Great! They have not played together.
              </p>

              <div className="relative">
               {/* <span
                  className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black 
                 translate-x-[6px] translate-y-[6px]"
          ></span> */}
                <button
                  onClick={() => {
                    nextRound();
                    setStreakCount(streakCount + 1);
                  }}
                  className={`relative w-[200px] px-6 py-3 font-medium text-white 
                 bg-[#ac7434] rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer`}
                >
                  Next round
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-red-500 rounded-full p-2 mb-2">
                <X size={24} color="#fff" />
              </div>
              <p className={`font-outfit text-center font-normal`}>
                Wrong answer! They did play together.
              </p>
              <div className="relative">
               {/* <span
                  className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black 
                 translate-x-[6px] translate-y-[6px]"
          ></span> */}
                <button
                  onClick={() => {
                    nextRound();
                    setStreakCount(0);
                  }}
                  className={`relative w-[200px] px-6 py-3 font-medium text-white 
                 bg-[#ac7434] rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer`}
                >
                  Next round
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
