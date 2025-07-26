import { getAllPlayers } from "@/controllers/PlayersController";
import { teams } from "@/components/Teams";
import DailyDraw from "./_components/DailyDraw";

export default async function DailyDrawPage() {
  const players = await getAllPlayers();

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Daily Draw</h1>

      <DailyDraw players={players} teams={teams} />
    </>
  );
}
