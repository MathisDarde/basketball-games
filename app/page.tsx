"use client";
import { Aperture } from "lucide-react";

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
    </div>
  );
}
