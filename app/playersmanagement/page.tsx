"use client";

import register1990sPlayers from "@/actions/players/register1990splayers";
import register2000sPlayers from "@/actions/players/register2000splayers";
import register2010sPlayers from "@/actions/players/register2010splayers";
import register2020sPlayers from "@/actions/players/register2020splayers";

export default function Page() {
  const handle1990sClick = async () => {
    const result = await register1990sPlayers();
    console.log(result);
  };
  const handle2000sClick = async () => {
    const result = await register2000sPlayers();
    console.log(result);
  };
  const handle2010sClick = async () => {
    const result = await register2010sPlayers();
    console.log(result);
  };
  const handle2020sClick = async () => {
    const result = await register2020sPlayers();
    console.log(result);
  };

  return (
    <div className="flex flex-col gap-2">
      <button onClick={handle1990sClick}>Register 1990s Players</button>
      <button onClick={handle2000sClick}>Register 2000s Players</button>
      <button onClick={handle2010sClick}>Register 2010s Players</button>
      <button onClick={handle2020sClick}>Register 2020s Players</button>
    </div>
  );
}
