import GuessingBlock from "./_components/GuessingBlock";
import DisplayPlayers from "./_components/DisplayPlayers";
import Difficulty from "@/components/Difficulty";
import Link from "next/link";
import { getAllPlayers } from "@/controllers/PlayersController";
import { teams } from "@/components/Teams";

export default async function PlayTogetherPage() {
  const players = await getAllPlayers();

  return (
    <>
      <Link href="/">
        <h1 className="cursor-pointer">Back to home</h1>
      </Link>

      <Difficulty />

      <div className="flex flex-col items-center gap-4">
        <DisplayPlayers players={players} teams={teams} />
        <GuessingBlock players={players} />
      </div>
    </>
  );
}
