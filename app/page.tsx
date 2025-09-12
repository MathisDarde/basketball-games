import { Aperture, LucideFileUser, Flower2Icon, LockIcon } from "lucide-react";
import Link from "next/link";

import React from "react";

export default function MainPage() {
  return (
    <div className="p-4">
      <h1 className="text-center font-unbounded text-2xl mb-4">
        BasketballGames
      </h1>

      <div className="flex flex-col gap-4">
        <Link href="/nbacollection">
          <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-accent-brown text-white">
            <LucideFileUser />
            <h3 className="font-outfit">NBA Cards Collection</h3>
          </div>
        </Link>

        <Link href="/playtogether">
          <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-dark-purple text-white">
            <Aperture />
            <h3 className="font-outfit">Play Together</h3>
          </div>
        </Link>

        <Link href="/careerpath">
          <div className="relative flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-accent-brown text-white">
            <Flower2Icon />
            <h3 className="font-outfit">Career Path</h3>

            {/* Overlay pour bloquer le clic */}
            <div className="absolute inset-0 bg-white opacity-70 flex flex-col justify-center items-center rounded-md cursor-not-allowed">
              {/* Icône cadenas */}
              <LockIcon size={30} className="text-gray-700" />
            </div>
          </div>
        </Link>

        {/* <Link href="/happyfamilies">
          <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-dark-purple text-white">
            <Shell />
            <h3>Happy Families</h3>
          </div>
        </Link>

        <Link href="/nbagrid">
          <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-green-200">
            <LucideVariable />
            <h3>NBA Grid</h3>
          </div>
        </Link> */}
      </div>
    </div>
  );
}
