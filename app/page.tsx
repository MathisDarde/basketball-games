"use client";
import {
  Aperture,
  Shell,
  LucideFileUser,
  Flower2Icon,
  LucideVariable,
} from "lucide-react";

import React from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  return (
    <div>
      <h1>BasketballGames Homepage</h1>
      <button onClick={() => router.push("login")}>Login</button>

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
      <div
        className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-blue-200"
        onClick={() => router.push("/careerpath")}
      >
        <Flower2Icon />
        <h3>Career Path</h3>
      </div>
      <div
        className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-green-200"
        onClick={() => router.push("/nbagrid")}
      >
        <LucideVariable />
        <h3>NBA Grid</h3>
      </div>
    </div>
  );
}
