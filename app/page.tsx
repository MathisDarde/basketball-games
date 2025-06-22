"use client";
import { Aperture, Shell, LucideFileUser } from "lucide-react";

import React from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  return (
    <div>
      <h1>BasketballGames Homepage</h1>

      <div
        className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-orange-200"
        onClick={() => router.push("/playtogether")}
      >
        <Aperture />
        <h3>Play Together</h3>
      </div>
      <div
        className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-purple-200"
        onClick={() => router.push("/happyfamilies")}
      >
        <Shell />
        <h3>Happy Families</h3>
      </div>
      <div
        className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-red-200"
        onClick={() => router.push("/nbacollection")}
      >
        <LucideFileUser />
        <h3>NBA Cards Collection</h3>
      </div>
    </div>
  );
}
