import {
  Aperture,
  Shell,
  LucideFileUser,
  Flower2Icon,
  LucideVariable,
} from "lucide-react";
import Link from "next/link";

import React from "react";

export default function MainPage() {
  return (
    <div>
      <h1>BasketballGames Homepage</h1>
      <Link href="/login">Login</Link>

      <Link href="/playtogether">
        <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-orange-200">
          <Aperture />
          <h3>Play Together</h3>
        </div>
      </Link>

      <Link href="/happyfamilies">
        <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-purple-200">
          <Shell />
          <h3>Happy Families</h3>
        </div>
      </Link>

      <Link href="/nbacollection">
        <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-red-200">
          <LucideFileUser />
          <h3>NBA Cards Collection</h3>
        </div>
      </Link>

      <Link href="/careerpath">
        <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-blue-200">
          <Flower2Icon />
          <h3>Career Path</h3>
        </div>
      </Link>

      <Link href="/nbagrid">
        <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-green-200">
          <LucideVariable />
          <h3>NBA Grid</h3>
        </div>
      </Link>
    </div>
  );
}
