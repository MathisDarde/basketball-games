"use client";

import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import { getTeamLogo } from "@/utils/get-team-logo";
import Image from "next/image";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import MobileTeamInteraction from "./MobileTeamInteraction";
import { TeamsData } from "@/components/Teams";

type BaseDropBoxesProps = {
  player: PlayerData;
  difficulty: string;
  filteredTeams: TeamsDataType[];
  droppedTeams: TeamsDataType[];
  year: number;
  setDroppedTeams: Dispatch<SetStateAction<TeamsDataType[]>>;
};

// Slot vide conforme à TeamsDataType
const emptySlot: TeamsDataType = {
  currentName: "",
  periods: [],
  names: [],
  conference: "",
  division: ""
};

export default function BaseDropBoxes({
  player,
  difficulty,
  filteredTeams,
  droppedTeams,
  year,
  setDroppedTeams,
}: BaseDropBoxesProps) {
  const [isTeamPopupOpen, setIsTeamPopupOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [touchClone, setTouchClone] = useState<HTMLElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  // Détecte le type d’écran
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ⚡ Initialisation des slots
  useEffect(() => {
    if (droppedTeams.length !== filteredTeams.length) {
      setDroppedTeams(filteredTeams.map(() => emptySlot));
    }
  }, [filteredTeams, droppedTeams.length, setDroppedTeams]);

  // Clique sur une case → ouvre popup seulement sur mobile
  const handleClickSlot = (index: number) => {
    if (!isMobile) return; // ✅ ne rien faire sur desktop
    setActiveSlot(index);
    setIsTeamPopupOpen(true);
  };

  // Drop entre slots (PC)
  const handleDropOnSlot = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const source = e.dataTransfer.getData("source");
  
    if (source === "slot") {
      // Drag interne entre slots (PC)
      const fromIndexStr = e.dataTransfer.getData("index");
      const fromIndex = parseInt(fromIndexStr, 10);
      if (isNaN(fromIndex) || fromIndex === index) return;
  
      setDroppedTeams((prev) => {
        const next = [...prev];
        [next[fromIndex], next[index]] = [next[index], next[fromIndex]];
        return next;
      });
    } else if (source === "largeScreen") {
      // Drag depuis large screen
      const teamDataStr = e.dataTransfer.getData("team");
      if (!teamDataStr) return;
      const team = JSON.parse(teamDataStr) as TeamsDataType;
  
      setDroppedTeams((prev) => {
        const next = [...prev];
        next[index] = team;
        return next;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  // Supprimer équipe → remet le slot à vide
  const handleDeleteSlot = (index: number) => {
    setDroppedTeams((prev) =>
      prev.map((t, i) => (i === index ? emptySlot : t))
    );
  };

  // 🔹 Drag & Drop tactile (mobile)
  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    index: number
  ) => {
    if (!isMobile || droppedTeams[index].currentName === "") return;

    const touch = e.touches[0];
    const logo = e.currentTarget.querySelector("img");
    if (!logo) return;

    const clone = logo.cloneNode(true) as HTMLElement;
    clone.style.position = "fixed";
    clone.style.left = `${touch.clientX - 25}px`;
    clone.style.top = `${touch.clientY - 25}px`;
    clone.style.width = "50px";
    clone.style.height = "50px";
    clone.style.opacity = "0.8";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "9999";
    document.body.appendChild(clone);

    setTouchClone(clone);
    setDraggingIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchClone || draggingIndex === null) return;
    const touch = e.touches[0];
    touchClone.style.left = `${touch.clientX - 25}px`;
    touchClone.style.top = `${touch.clientY - 25}px`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchClone || draggingIndex === null) {
      setTouchClone(null);
      setDraggingIndex(null);
      return;
    }

    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    ) as HTMLElement;

    const toIndexAttr = targetElement
      ?.closest("[data-slot-index]")
      ?.getAttribute("data-slot-index");
    const toIndex = toIndexAttr ? parseInt(toIndexAttr, 10) : -1;

    if (toIndex >= 0 && toIndex !== draggingIndex) {
      setDroppedTeams((prev) => {
        const next = [...prev];
        [next[draggingIndex], next[toIndex]] = [
          next[toIndex],
          next[draggingIndex],
        ];
        return next;
      });
    }

    touchClone.remove();
    setTouchClone(null);
    setDraggingIndex(null);
  };

  return (
    <>
      <div
        className="grid place-items-center gap-2 justify-center w-[275px] mx-auto"
        style={{
          gridTemplateColumns: `repeat(${Math.min(
            player.teams_history.length,
            3
          )}, minmax(0, 1fr))`,
        }}
      >
        {droppedTeams.map((slotTeam, index) => (
          <div
            key={index}
            data-slot-index={index}
            onDrop={(e) => handleDropOnSlot(e, index)}
            onDragOver={handleDragOver}
            draggable={!isMobile && slotTeam.currentName !== ""} // ✅ drag PC seulement
            onDragStart={(e) => {
              e.dataTransfer.setData("index", index.toString());
              e.dataTransfer.setData("source", "slot");
            }}
            onClick={() => handleClickSlot(index)} // ✅ clic mobile uniquement
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`border border-dashed w-20 h-20 flex justify-center items-center relative cursor-pointer`}
          >
            {slotTeam.currentName ? (
              <>
                <Image
                  src={
                    getTeamLogo(slotTeam.currentName, year) || "/pdpdebase.png"
                  }
                  width={100}
                  height={100}
                  alt="Team Logo"
                  className="size-13 object-contain pointer-events-none"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSlot(index);
                  }}
                  className="absolute top-0 right-0 text-red-500 font-bold px-1 cursor-pointer hover:text-red-300 transition-colors"
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <span className="block lg:hidden text-gray-400 text-sm font-outfit font-light">
                  Click here
                </span>
                <span className="hidden lg:block text-gray-400 text-sm font-outfit font-light">
                  Drop here
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {isMobile && isTeamPopupOpen && (
        <MobileTeamInteraction
          teams={TeamsData}
          isTeamPopupOpen={isTeamPopupOpen}
          setIsTeamPopupOpen={setIsTeamPopupOpen}
          onSelectTeam={(team) => {
            setDroppedTeams((prev) => {
              const next = [...prev];
              next[activeSlot] = team;
              return next;
            });
            setIsTeamPopupOpen(false);
          }}
          player={player}
          difficulty={difficulty}
          year={year}
        />
      )}
    </>
  );
}
