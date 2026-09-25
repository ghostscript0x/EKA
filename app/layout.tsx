import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { SplashScreen } from "@/components/SplashScreen";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Eka",
  description: "Daily discipline tracker",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#14140F",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans mx-auto max-w-2xl px-4 py-8`}>
        <SplashScreen />
        <NavBar />
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
