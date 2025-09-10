"use client";

import { User } from "@/interfaces/Interfaces";
import {
  BrickWall,
  ChevronLeft,
  ClipboardPlus,
  Grid,
  House,
  LogIn,
  MenuIcon,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export const NavbarMenu = ({ user }: { user: User | null }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const parts = pathname.split("/");
  const hasPeriod = parts.length > 2 && parts[2] !== "";

  const handleBack = () => {
    if (hasPeriod) {
      router.push(`/${parts[1]}`);
    }
  };

  return (
    <>
      {/* Bouton menu */}
      <div className="flex items-center justify-between p-4">
        <div
          onClick={() => setMenuOpen(true)}
          className="block sm:hidden cursor-pointer"
        >
          <MenuIcon />
        </div>
        <div
          onClick={handleBack}
          className={`${
            hasPeriod
              ? "cursor-pointer text-black"
              : "cursor-not-allowed text-gray-400"
          }`}
        >
          <ChevronLeft />
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-10 transition-opacity duration-300 
          ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-[250px] bg-accent-brown z-20 transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <ul className="space-y-4 p-4">
            <li className="font-outfit text-white">
              <Link href="/" className="flex items-center gap-2">
                <House size={25} />
                <div>Home</div>
              </Link>
            </li>
            <li className="font-outfit text-white">
              <Link href="/playtogether" className="flex items-center gap-2">
                <BrickWall size={25} />
                <div>Play Together</div>
              </Link>
            </li>
            <li className="font-outfit text-white">
              <Link href="/nbacollection" className="flex items-center gap-2">
                <ClipboardPlus size={25} />
                NBA Collection
              </Link>
            </li>
            <li className="font-outfit text-white">
              <Link href="/careerpath" className="flex items-center gap-2">
                <BrickWall size={25} />
                <div>Career Path</div>
              </Link>
            </li>
            <li className="font-outfit text-white">
              <Link href="/nbagrid" className="flex items-center gap-2">
                <Grid size={25} />
                <div>NBA Grid</div>
              </Link>
            </li>
          </ul>

          {/* Collé en bas */}
          <div className="font-outfit text-white mt-auto p-4 space-y-4">
            {user ? (
              <Link href="/profile" className="flex items-center gap-2">
                <Image
                  src={user.profilePicture || "/pdpdebase.png"}
                  alt="Profile picture"
                  width={25}
                  height={25}
                  className="rounded-full aspect-square object-cover"
                />
                {user.name}
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2">
                <LogIn size={25} />
                Login
              </Link>
            )}
            <Link href="/settings" className="flex items-center gap-2">
              <Settings size={25} />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
