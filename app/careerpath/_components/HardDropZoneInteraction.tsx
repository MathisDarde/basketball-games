"use client";

import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import { getTeamLogo } from "@/utils/get-team-logo";
import Image from "next/image";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import MobileTeamInteraction from "./MobileTeamInteraction";
import { TeamsData } from "@/components/Teams";

type HardDropZoneProps = {
    player: PlayerData;
    droppedTeams: TeamsDataType[];
    setDroppedTeams: Dispatch<SetStateAction<TeamsDataType[]>>;
    year: number;
    maxSlots?: number;
};

export default function HardDropZone({
    player,
    droppedTeams,
    setDroppedTeams,
    year,
    maxSlots = 25
}: HardDropZoneProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isTeamPopupOpen, setIsTeamPopupOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [touchClone, setTouchClone] = useState<HTMLElement | null>(null);

    // Détecte mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Drop desktop depuis liste
    const handleDropOnSlot = (e: React.DragEvent<HTMLDivElement>, index?: number) => {
        e.preventDefault();
        const source = e.dataTransfer.getData("source");

        if (source === "zone") {
            // Drag interne entre slots (PC)
            const fromIndexStr = e.dataTransfer.getData("index");
            const fromIndex = parseInt(fromIndexStr, 10);
            if (isNaN(fromIndex)) return;

            setDroppedTeams((prev) => {
                const next = [...prev];
                if (index !== undefined && index !== fromIndex) {
                    // swap
                    [next[fromIndex], next[index]] = [next[index], next[fromIndex]];
                }
                return next;
            });
        } else if (source === "largeScreen" || source === "list") {
            // Drag depuis large screen ou liste
            const teamDataStr = e.dataTransfer.getData("team");
            if (!teamDataStr) return;
            const team = JSON.parse(teamDataStr) as TeamsDataType;

            setDroppedTeams((prev) => {
                const next = [...prev];
                if (index !== undefined) {
                    next[index] = team; // remplace le slot ciblé
                } else {
                    // ajout à la fin si pas de slot ciblé
                    if (next.length < maxSlots) next.push(team);
                }
                return next;
            });
        }
    };


    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    // Swap desktop dans la zone
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData("index", index.toString());
        e.dataTransfer.setData("source", "zone");
    };

    const handleDropOnTeam = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        const fromIndexStr = e.dataTransfer.getData("index");
        const source = e.dataTransfer.getData("source");

        if (source !== "zone") return;
        const fromIndex = parseInt(fromIndexStr, 10);
        if (isNaN(fromIndex) || fromIndex === index) return;

        setDroppedTeams(prev => {
            const next = [...prev];
            [next[fromIndex], next[index]] = [next[index], next[fromIndex]];
            return next;
        });
    };

    const handleRemove = (index: number) => {
        setDroppedTeams(prev => prev.filter((_, i) => i !== index));
    };

    // Mobile popup
    const handleClickMobileTeam = (index: number) => {
        if (!isMobile) return;
        setActiveIndex(index);
        setIsTeamPopupOpen(true);
    };

    // Mobile drag tactile
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, index: number) => {
        if (!isMobile) return;
        const team = droppedTeams[index];
        if (!team) return;

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
        if (!touchClone || draggingIndex === null) return;

        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
        const toIndexAttr = target?.closest("[data-team-index]")?.getAttribute("data-team-index");
        const toIndex = toIndexAttr ? parseInt(toIndexAttr, 10) : -1;

        if (toIndex >= 0 && toIndex !== draggingIndex) {
            setDroppedTeams(prev => {
                const next = [...prev];
                [next[draggingIndex], next[toIndex]] = [next[toIndex], next[draggingIndex]];
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
                className="flex flex-wrap gap-3 p-4 border-2 border-dashed border-gray-400 rounded-xl bg-gray-50 min-h-[120px] w-full max-w-[850px] mx-auto"
                onDragOver={handleDragOver}
                onDrop={handleDropOnSlot}
                onClick={() => {
                    if (isMobile) {
                        setActiveIndex(droppedTeams.length);
                        setIsTeamPopupOpen(true);
                    }
                }}
            >
                {droppedTeams.length === 0 && (
                    <span className="text-gray-400 text-sm font-outfit">Drop teams here</span>
                )}

                {droppedTeams.map((team, index) => (
                    <div
                        key={index}
                        data-team-index={index}
                        draggable={!isMobile}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDrop={(e) => handleDropOnTeam(e, index)}
                        onDragOver={handleDragOver}
                        onTouchStart={(e) => handleTouchStart(e, index)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={() => handleClickMobileTeam(index)}
                        className="relative w-15 lg:w-25 h-15 lg:h-25 flex justify-center items-center cursor-grab
               border border-gray-300 rounded-lg p-1 bg-white shadow-sm"
                    >
                        <Image
                            src={getTeamLogo(team.currentName, year) || "/pdpdebase.png"}
                            width={100}
                            height={100}
                            alt={team.currentName}
                            className="size-11 lg:size-18 object-contain pointer-events-none"
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                            className="absolute top-0 right-0 text-red-500 text-base lg:text-xl font-bold bg-white rounded-full px-1 hover:text-red-300 transition-colors"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {isMobile && isTeamPopupOpen && (
                <MobileTeamInteraction
                    teams={TeamsData}
                    isTeamPopupOpen={isTeamPopupOpen}
                    setIsTeamPopupOpen={setIsTeamPopupOpen}
                    onSelectTeam={(team) => {
                        setDroppedTeams(prev => {
                            const next = [...prev];
                            next[activeIndex] = team;
                            return next;
                        });
                        setIsTeamPopupOpen(false);
                    }}
                    player={player}
                    difficulty="hard"
                    year={year}
                />
            )}
        </>
    );
}
