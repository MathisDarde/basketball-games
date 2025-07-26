import registerPlayers from "@/actions/players/registerplayers";

export default function Page() {
  const handleClick = async () => {
    const result = await registerPlayers();
    console.log(result);
  };

  return <button onClick={handleClick}>Register Players</button>;
}
