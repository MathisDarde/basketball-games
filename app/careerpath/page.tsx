// app/career-path/page.tsx
import Difficulty from "@/components/Difficulty";
import SubmitGuess from "./_components/SubmitGuess";
import { teams } from "@/components/Teams";
import ServerPlayerDisplay from "./_components/ServerPlayerDisplay";
import ServerTeamDisplay from "./_components/ServerTeamDisplay";
import { getPlayers } from "@/controllers/PlayersController";

export default async function CareerPathPage(period: string) {
  const players = await getPlayers(period);
  return (
    <div>
      <h1>Career path</h1>
      <Difficulty />
      <div className="flex items-center gap-16">
        <ServerPlayerDisplay players={players} teams={teams} />
        <ServerTeamDisplay teams={teams} />
        <SubmitGuess />
      </div>
    </div>
  );
}
