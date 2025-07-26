import Difficulty from "@/components/Difficulty";
import Link from "next/link";
import { getAllPlayers } from "@/controllers/PlayersController";
import { teams } from "@/components/Teams";
import PageContent from "./_components/PageContent";

export default async function PlayTogetherPage() {
  const players = await getAllPlayers();

  return (
    <>
      <Link href="/">
        <h1 className="cursor-pointer">Back to home</h1>
      </Link>

      <Difficulty />

      <PageContent players={players} teams={teams} />
    </>
  );
}
