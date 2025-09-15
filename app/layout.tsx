import "./globals.css";
import { AppProvider } from "../components/GlobalContext";
import { Outfit, Unbounded, Righteous } from "next/font/google";
import { Toaster } from "sonner";
import NavbarServer from "@/components/NavbarServer";

const unbounded = Unbounded({
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-unbounded",
  subsets: ["latin"],
  preload: true,
});
const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-outfit",
  subsets: ["latin"],
  preload: true,
});
const righteous = Righteous({
  weight: ["400"],
  variable: "--font-righteous",
  subsets: ["latin"],
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${unbounded.variable} ${outfit.variable} ${righteous.variable}`}
      >
        <div className="bg-light-beige">
          <NavbarServer />
          <AppProvider>{children}</AppProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
