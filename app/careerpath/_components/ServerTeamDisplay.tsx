import ClientTeamInteraction from "./ClientTeamInteraction";

export default function ServerTeamDisplay({ teams }: { teams: string[] }) {
  return (
    <div className="border rounded-md p-4">
      <ClientTeamInteraction teams={teams} />
    </div>
  );
}
