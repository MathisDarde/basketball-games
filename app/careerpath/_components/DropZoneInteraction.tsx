"use client";

import { PlayerData, TeamsDataType } from "@/interfaces/Interfaces";
import { Dispatch, SetStateAction } from "react";
import HardDropZoneInteraction from "./HardDropZoneInteraction";
import BaseDropBoxes from "./BaseDropBoxes";

export default function DropZoneInteraction({
  player,
  filteredTeams,
  droppedTeams,
  setDroppedTeams,
  difficulty,
  year
}: {
  player: PlayerData;
  filteredTeams: TeamsDataType[];
  droppedTeams: TeamsDataType[];
  setDroppedTeams: Dispatch<SetStateAction<TeamsDataType[]>>;
  difficulty: string;
  year: number;
}) {
  if (difficulty === "hard") {
    return (
      <HardDropZoneInteraction player={player} droppedTeams={droppedTeams} year={year} setDroppedTeams={setDroppedTeams} />
    )
  } else {
    return (
      <BaseDropBoxes player={player} difficulty={difficulty} droppedTeams={droppedTeams} filteredTeams={filteredTeams} year={year} setDroppedTeams={setDroppedTeams} />
    );
  }
}
