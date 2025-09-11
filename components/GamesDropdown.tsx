"use client";
import { motion, AnimatePresence } from "framer-motion";
import { BrickWall, ClipboardPlus, Grid } from "lucide-react";
import Link from "next/link";

const gamesMenuVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const GamesDropdown = ({ open, onLinkClick }: { open: boolean, onLinkClick: () => void; }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.ul
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={gamesMenuVariants}
          className="space-y-2 pl-2 mt-2"
        >
          <li>
            <Link 
                href="/playtogether" 
                className="flex items-center gap-2 text-white font-outfit"
                onClick={onLinkClick}
            >
              <BrickWall size={20} /> Play Together
            </Link>
          </li>
          <li>
            <Link 
                href="/nbacollection" 
                className="flex items-center gap-2 text-white font-outfit"
                onClick={onLinkClick}
            >
              <ClipboardPlus size={20} /> NBA Collection
            </Link>
          </li>
          <li>
            <Link 
                href="/careerpath" 
                className="flex items-center gap-2 text-white font-outfit"
                onClick={onLinkClick}
            >
              <BrickWall size={20} /> Career Path
            </Link>
          </li>
          <li>
            <Link 
                href="/nbagrid" 
                className="flex items-center gap-2 text-white font-outfit"
                onClick={onLinkClick}
            >
              <Grid size={20} /> NBA Grid
            </Link>
          </li>
        </motion.ul>
      )}
    </AnimatePresence>
  );
};
