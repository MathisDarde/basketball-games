"use client";

import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { useState } from "react";
import { getRandomPlayers } from "@/utils/get-random-players";
import { Check, X } from "lucide-react";
import { PeriodTypes, PlayerData } from "@/interfaces/Interfaces";
import handleStoreSession from "@/actions/playtogether/store-session";

export default function GuessingBlock({
  players,
  randomPlayers,
  setRandomPlayers,
  userId,
  period,
  streak,
  setStreak,
  difficulty,
}: {
  players: PlayerData[];
  randomPlayers: PlayerData[];
  setRandomPlayers: React.Dispatch<PlayerData[]>;
  userId: string | null;
  period: PeriodTypes;
  streak: number;
  setStreak: (value: number) => void;
  difficulty: string;
}) {
  const {
    havePlayedTogether,
    endedRound,
    setEndedRound,
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
    <div className={`mx-auto p-4 w-[300px] sm:w-[400px] lg:w-[500px]`}>
      {endRoundMessage === 0 && !endedRound && (
        <div className="flex flex-col items-center gap-3">
          <p className={`text-center font-outfit font-normal sm:text-lg lg:text-xl lg:p-2`}>
            Have these players played together ?
          </p>

        <div className="flex flex-col md:flex-row gap-2 lg:gap-6 xl:gap-12">
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
              className={`relative w-[200px] xl:w-[250px] px-6 py-3 font-medium text-white 
              bg-accent-brown rounded-lg
              active:translate-x-[1px] active:translate-y-[1px] 
              transition-transform font-unbounded cursor-pointer lg:text-lg`}
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
              className={`relative w-[200px] xl:w-[250px] px-6 py-3 font-medium text-white 
                 bg-dark-purple rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer lg:text-lg`}
            >
              No
            </button>
          </div>
          </div>
        </div>
      )}
      {endRoundMessage === 1 && endedRound && (
        <>
          {havePlayed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500 rounded-full p-2 mb-2 sm:mb-0">
                <Check size={24} color="#fff" />
              </div>
              <p className={`font-outfit font-normal text-center sm:text-lg lg:text-xl lg:p-2`}>
                Great! They have played together.
              </p>

              <div className="relative">
                {/* <span
                  className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black 
                 translate-x-[6px] translate-y-[6px]"
          ></span> */}
                <button
                  onClick={async () => {
                    const next = streak + 1;
                    setStreak(next);
                    if (userId) await handleStoreSession(userId, period, true, next, difficulty);
                    nextRound();
                  }}
                  className={`relative w-[200px] xl:w-[250px] px-6 py-3 font-medium text-white 
                 bg-accent-brown rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer lg:text-lg`}
                >
                  Next round
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-red-500 rounded-full p-2 mb-2 sm:mb-0">
                <X size={24} color="#fff" />
              </div>
              <p className={`font-outfit font-normal text-center sm:text-lg lg:text-xl lg:p-2`}>
                Wrong answer! They have not played together.
              </p>
              <div className="relative">
                {/* <span
                  className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black 
                 translate-x-[6px] translate-y-[6px]"
          ></span> */}
                <button
                  onClick={async () => {
                    setStreak(0);
                    if (userId) await handleStoreSession(userId, period, false, 0, difficulty);
                    nextRound();
                  }}
                  className={`relative w-[200px] xl:w-[250px] px-6 py-3 font-medium text-white 
                 bg-accent-brown rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer lg:text-lg`}
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
              <div className="bg-green-500 rounded-full p-2 mb-2 sm:mb-0">
                <Check size={24} color="#fff" />
              </div>
              <p className={`font-outfit font-normal text-center sm:text-lg lg:text-xl lg:p-2`}>
                Great! They have not played together.
              </p>

              <div className="relative">
                {/* <span
                  className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black 
                 translate-x-[6px] translate-y-[6px]"
          ></span> */}
                <button
                  onClick={async () => {
                    const next = streak + 1;
                    setStreak(next);
                    if (userId) await handleStoreSession(userId, period, true, next, difficulty);
                    nextRound();
                  }}
                  className={`relative w-[200px] xl:w-[250px] px-6 py-3 font-medium text-white 
                 bg-accent-brown rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer lg:text-lg`}
                >
                  Next round
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-red-500 rounded-full p-2 mb-2 sm:mb-0">
                <X size={24} color="#fff" />
              </div>
              <p className={`font-outfit text-center font-normal sm:text-lg lg:text-xl lg:p-2`}>
                Wrong answer! They did play together.
              </p>
              <div className="relative">
                {/* <span
                  className="absolute top-0 left-0 w-[200px] h-full 
                 bg-black 
                 translate-x-[6px] translate-y-[6px]"
          ></span> */}
                <button
                  onClick={async () => {
                    setStreak(0);
                    if (userId) await handleStoreSession(userId, period, false, 0, difficulty);
                    nextRound();
                  }}
                  className={`relative w-[200px] xl:w-[250px] px-6 py-3 font-medium text-white 
                 bg-accent-brown rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer lg:text-lg`}
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
