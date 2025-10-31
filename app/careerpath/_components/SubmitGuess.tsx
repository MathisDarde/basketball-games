"use client";

import handleStoreSession from "@/actions/careerpath/store-session";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import { Check, X } from "lucide-react";
import { ParamValue } from "next/dist/server/request/params";
import { Dispatch, SetStateAction, useState } from "react";

export default function SubmitGuess({
  player,
  droppedTeams,
  filteredTeams,
  difficulty,
  setDroppedTeams,
  setIsRevealed,
  isCorrect,
  setIsCorrect,
  setChecked,
  userId,
  period,
  streak,
  setStreak,
  regeneratePlayer,
}: {
  player: PlayerData;
  droppedTeams: (TeamsDataType | null)[];
  filteredTeams: TeamsDataType[];
  difficulty: string;
  setDroppedTeams: Dispatch<SetStateAction<TeamsDataType[]>>;
  setIsRevealed: Dispatch<SetStateAction<boolean>>;
  isCorrect: boolean;
  setIsCorrect: Dispatch<SetStateAction<boolean>>;
  setChecked: Dispatch<SetStateAction<boolean>>;
  userId: string | null;
  period: ParamValue;
  streak: number;
  setStreak: (value: number) => void;
  regeneratePlayer: () => void;
}) {
  const { isCareerPathGood } = usePlayTogetherCtx();

  const [answerCount, setAnswerCount] = useState(3);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [endRoundMessage, setEndRoundMessage] = useState("");

  const handleCheckAnswer = async () => {
    setChecked(true);

    const correct = isCareerPathGood(player, droppedTeams, difficulty);
    setFeedbackMessage(correct);

    let newCount = answerCount - 1;
    if (newCount < 0) newCount = 0;
    setAnswerCount(newCount);

    const roundOver = correct.correct || newCount === 0;

    if (roundOver) {
      const newStreak = correct.correct ? streak + 1 : 0;
      setIsCorrect(correct.correct);
      setStreak(newStreak);

      if (userId) {
        const attemptsUsed = 3 - newCount;
        await handleStoreSession(
          userId,
          player.id,
          period as string,
          attemptsUsed,
          correct.correct,
          newStreak,
          difficulty
        );
      }

      if (!correct.correct) {
        setEndRoundMessage("No attempts left !");
        setIsRevealed(true);
        setDroppedTeams(filteredTeams.slice(0, filteredTeams.length));
      }
    } else {
      setEndRoundMessage(correct.message);
    }
  };

  const isGameOver = isCorrect || answerCount === 0;

  return (
    <div className="text-center py-4 flex flex-col gap-2 justify-center items-center">
      {!isGameOver ? (
        <>
          <p className="text-sm font-outfit bg-gray-700 opacity-50 inline-flex py-2 px-3 rounded-md text-white">
            {answerCount}/3 guesses remaining
          </p>

        {feedbackMessage && (
          <p className="font-outfit bg-red-200 border border-red-700 rounded-md p-4 text-sm w-[325px]">
            {endRoundMessage}
          </p>
          )}
        </>
      ) : feedbackMessage ? (
        feedbackMessage.correct ? (
          <>
            <div className="bg-green-500 rounded-full p-2 sm:mb-0">
              <Check size={24} color="#fff" />
            </div>
            <p className="text-sm font-outfit text-black">
              {feedbackMessage.message}
            </p>
          </>
        ) : (
          <>
            <div className="bg-red-500 rounded-full p-2 sm:mb-0">
              <X size={24} color="#fff" />
            </div>
            <p className="text-sm font-outfit text-black">
              {feedbackMessage.message}
            </p>
          </>
        )
      ) : null}

      {isGameOver ? (
        <button
          className={`relative w-[200px] xl:w-[250px] px-6 py-3 font-medium text-white 
                 bg-accent-brown rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer lg:text-lg`}
          onClick={async () => {
            setDroppedTeams(Array(filteredTeams.length).fill(null));
            setChecked(false);
            setIsRevealed(false);
            setIsCorrect(false);
            setAnswerCount(3);
            regeneratePlayer();
            setFeedbackMessage(null)
          }}
        >
          Next round
        </button>
      ) : (
        <button
          onClick={handleCheckAnswer}
          className={`relative w-[250px] xl:w-[300px] px-6 py-3 font-medium text-white 
                 bg-dark-purple rounded-lg
                 active:translate-x-[1px] active:translate-y-[1px] 
                 transition-transform font-unbounded cursor-pointer lg:text-lg`}
        >
          Submit my guess
        </button>
      )}
    </div>
  );
}
