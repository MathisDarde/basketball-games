"use client";

import { PlayerData } from "@/interfaces/Interfaces";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ParamValue } from "next/dist/server/request/params";

export default function ClientPlayerInteraction({
  player,
  filteredTeams,
  droppedTeams,
  setDroppedTeams,
  isRevealed,
  checked,
  setChecked,
  setIsTeamPopupOpen,
  setActiveSlot,
  width,
  period,
}: {
  player: PlayerData;
  filteredTeams: string[];
  droppedTeams: (string | null)[];
  setDroppedTeams: Dispatch<SetStateAction<(string | null)[]>>;
  isRevealed: boolean;
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  setIsTeamPopupOpen: Dispatch<SetStateAction<boolean>>;
  setActiveSlot: Dispatch<SetStateAction<number | null>>;
  width: number;
  period: ParamValue;
}) {
  const { getTeamLogo } = usePlayTogetherCtx();

  const [logoYear, setLogoYear] = useState<number>(2025);

  useEffect(() => {
    if (typeof period === "string") {
      switch (period) {
        case "1990s":
          setLogoYear(1995);
          break;
        case "2000s":
          setLogoYear(2005);
          break;
        case "2010s":
          setLogoYear(2015);
          break;
        case "2020s":
          setLogoYear(2025);
          break;
        default:
          setLogoYear(2025);
          break;
      }
    }
  }, [period]);

  const userEdited = (
    updater: (prev: (string | null)[]) => (string | null)[]
  ) => {
    setDroppedTeams((prev) => {
      return updater(prev); // ne modifie que les slots ciblés
    });
    setChecked(false);
  };

  const allYears = player.teams_history
    .map(({ period }) => {
      const parts = period.includes("–")
        ? period.split("–")
        : period.split("-");

      let start: number;
      let end: number;

      if (parts.length === 1) {
        start = end = parseInt(parts[0], 10);
      } else {
        const [startRaw, endRaw] = parts;
        start = parseInt(startRaw, 10);
        end =
          endRaw === "present"
            ? new Date().getFullYear()
            : parseInt(endRaw, 10);
      }

      return { start, end };
    })
    .filter(({ start, end }) => !isNaN(start) && !isNaN(end));

  let activePeriod = "";
  if (allYears.length > 0) {
    const minStart = Math.min(...allYears.map(({ start }) => start));
    const maxEnd = Math.max(...allYears.map(({ end }) => end));

    if (minStart === maxEnd) {
      activePeriod = `${minStart}`;
    } else if (maxEnd === new Date().getFullYear()) {
      activePeriod = `${minStart}-present`;
    } else {
      activePeriod = `${minStart}-${maxEnd}`;
    }
  }

  return (
    <>
      <div className="flex items-center flex-col">
        <Image
          src={player.image_link || "/pdpdebase.png"}
          width={100}
          height={100}
          alt="Player Picture"
          className="rounded-full"
        />
        <p className="font-unbounded text-2xl">{player.name}</p>
        <p className="font-outfit font-light text-center text-medium">
          {activePeriod}
        </p>
        <p className="font-outfit font-light text-center text-sm">
          {player.position}
        </p>
      </div>

      <div
        className="grid gap-2 justify-center"
        style={{
          gridTemplateColumns: `repeat(${Math.min(
            droppedTeams.length,
            3
          )}, minmax(0, 1fr))`,
        }}
      >
        {droppedTeams.map((slotTeam, index) => {
          const correctTeam = filteredTeams[index];
          const isSlotCorrect = checked && slotTeam === filteredTeams[index];
          const isLocked = isRevealed || isSlotCorrect;

          let bgClass = "";
          if (isRevealed) {
            bgClass = "bg-green-600";
          } else if (checked && slotTeam) {
            bgClass = isSlotCorrect ? "bg-green-600" : "bg-red-600";
          }

          const showDeleteButton = !!slotTeam && !isLocked;

          const displayTeam = isRevealed ? correctTeam : slotTeam;

          return (
            <div
              key={index}
              onDragOver={(e) => {
                if (!isLocked) e.preventDefault();
              }}
              onDrop={(e) => {
                if (isLocked) return;
                const draggedTeam = e.dataTransfer.getData("team");
                const source = e.dataTransfer.getData("source");
                const fromIndexStr = e.dataTransfer.getData("index");

                if (!draggedTeam) return;

                userEdited((prev) => {
                  const next = [...prev];
                  if (source === "logo") {
                    next[index] = draggedTeam;
                  } else if (source === "box") {
                    const fromIndex = parseInt(fromIndexStr, 10);
                    if (isNaN(fromIndex)) return prev;
                    const temp = next[index];
                    next[index] = next[fromIndex];
                    next[fromIndex] = temp;
                  }
                  return next;
                });
              }}
              onDragStart={(e) => {
                if (!slotTeam || isLocked) return;
                e.dataTransfer.setData("source", "box");
                e.dataTransfer.setData("index", index.toString());
                e.dataTransfer.setData("team", slotTeam);
              }}
              draggable={!!slotTeam && !isLocked}
              onClick={() => {
                if (!isLocked) {
                  setDroppedTeams((prev) =>
                    prev.map((slot, i) =>
                      i === index && slot && slot !== filteredTeams[i]
                        ? null
                        : slot
                    )
                  );
                  setChecked(false);

                  setActiveSlot(index);
                  setIsTeamPopupOpen(true);
                }
              }}
              className={`border border-dashed w-20 h-20 flex justify-center items-center relative ${bgClass}`}
            >
              {displayTeam ? (
                <>
                  <Image
                    src={getTeamLogo(displayTeam, logoYear) || "/pdpdebase.png"}
                    width={40}
                    height={40}
                    alt="Team Logo"
                  />
                  {showDeleteButton && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        userEdited((prev) => {
                          const next = [...prev];
                          next[index] = null;
                          return next;
                        });
                      }}
                      className="absolute top-0 right-0 text-red-500 font-bold px-1"
                    >
                      ×
                    </button>
                  )}
                </>
              ) : (
                <span className="text-gray-400 text-sm font-outfit font-light">
                  {width > 1024 ? "Drop here" : "Click here"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
