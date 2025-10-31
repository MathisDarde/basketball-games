"use client";

import { User } from "@/interfaces/Interfaces";
import {
  BadgeDollarSign,
  ChevronDown,
  ChevronLeft,
  House,
  LogIn,
  MenuIcon,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GamesDropdown } from "./GamesDropdown";
import { SocialsDropdown } from "./SocialsDropdown";
import Button from "./CustomButton";

export const NavbarMenu = ({ user }: { user: User | null }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(true);
  const [socialsDropdownOpen, setSocialsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const parts = pathname.split("/").filter(Boolean);
  const hasPeriod = parts.length > 2 && parts[2] !== "";

  const handleBack = () => {
   if (parts.length > 1) {
      // Supprime le dernier segment
      const previousPath = "/" + parts.slice(0, -1).join("/");
      router.push(previousPath);
    } else if (parts.length === 1) {
      // Si on est déjà à la racine d’un module (ex: /nbacollection)
      router.push("/");
    }
  };
  

  // swipe gestion

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;

      const diff = touchStartX.current - touchEndX.current;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe gauche => ouvrir
          setMenuOpen(false);
        } else {
          // Swipe droite => fermer
          setMenuOpen(true);
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // end of swipe gestion

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
          className={`cursor-pointer text-black`}
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
        className={`fixed left-0 p-4 top-0 h-screen w-[250px] bg-accent-brown z-20 transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <Button theme="primary" size="large">
            Make a donation
            <BadgeDollarSign size={20} />
          </Button>

          <ul className="mt-4">
            <li>
              <Link
                href="/"
                className="flex items-center gap-2 text-white font-outfit"
                onClick={() => setMenuOpen(false)}
              >
                <House size={20} /> Home
              </Link>
            </li>
          </ul>

          <div className="mt-4">
            <button
              className="text-white text-xs font-outfit flex justify-between items-center w-full transition-all duration-300"
              onClick={() => setGamesDropdownOpen(!gamesDropdownOpen)}
            >
              Games
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ease-out ${
                  gamesDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {gamesDropdownOpen && (
              <GamesDropdown
                open={gamesDropdownOpen}
                onLinkClick={() => setMenuOpen(false)}
              />
            )}
          </div>

          <div className="mt-4">
            <button
              className="text-white text-xs font-outfit flex justify-between items-center w-full transition-all duration-300"
              onClick={() => setSocialsDropdownOpen(!socialsDropdownOpen)}
            >
              Socials
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ease-out ${
                  socialsDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {socialsDropdownOpen && (
              <SocialsDropdown
                open={socialsDropdownOpen}
                onLinkClick={() => setMenuOpen(false)}
              />
            )}
          </div>

          {/* Collé en bas */}
          <div className="font-outfit text-white mt-auto space-y-4">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Image
                  src={user.image || "/pdpdebase.png"}
                  alt="Profile picture"
                  width={25}
                  height={25}
                  className="rounded-full aspect-square object-cover"
                />
                {user.name}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={25} />
                Login
              </Link>
            )}
            <Link
              href="/settings"
              className="flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <Settings size={25} />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
