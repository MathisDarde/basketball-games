import "./globals.css";
import { AppProvider } from "../components/GlobalContext";
import { Outfit, Unbounded } from "next/font/google";
import { Toaster } from "sonner";
import { NavbarMenu } from "@/components/Navbar";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${unbounded.variable} ${outfit.variable}`}
      >
        <div className="bg-light-beige">
          <NavbarMenu />
          <AppProvider>{children}</AppProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
