import PlayerBlock from "./_components/PlayerBlock";
import TeamBlock from "./_components/TeamBlock";
import Difficulty from "@/components/Difficulty";
import SubmitGuess from "./_components/SubmitGuess";
import { getAllPlayers } from "@/controllers/PlayersController";
import { teams } from "@/components/Teams";

export default async function CareerPathPage() {
  const players = await getAllPlayers();

  return (
    <div>
      <h1>Career path</h1>

      <Difficulty />

      <div className="flex items-center gap-16">
        <>
          <PlayerBlock players={players} teams={teams} />

          <TeamBlock teams={teams} />

          <SubmitGuess />
        </>
      </div>
    </div>
  );
}
