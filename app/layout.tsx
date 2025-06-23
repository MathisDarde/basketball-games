import "./globals.css";
import { AppProvider } from "../components/context";
import { Righteous } from "next/font/google";
import { Toaster } from "sonner";

const righteous = Righteous({
  weight: "400",
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
      <body suppressHydrationWarning className={`${righteous.variable}`}>
        <AppProvider>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
