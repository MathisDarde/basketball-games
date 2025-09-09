"use client"

import { MenuIcon, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export const NavbarMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Bouton menu */}
      <div
        onClick={() => setMenuOpen(true)}
        className="block sm:hidden cursor-pointer p-4"
      >
        <MenuIcon />
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-10 transition-opacity duration-300 
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-[200px] bg-[#ac7434] z-20 transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className="p-4 cursor-pointer"
        >
          <X />
        </div>

        <ul className="space-y-4 px-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/playtogether">Play Together</Link>
          </li>
        </ul>
      </div>
    </>
  )
}
