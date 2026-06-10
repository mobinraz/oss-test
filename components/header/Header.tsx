"use client";

import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Header() {
  const { theme, setTheme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <header className="sticky top-0 z-50">
      <div className="h-0.75 w-full bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-500" />
      <div
        className="
          bg-[#0B1120] dark:bg-gray-800 backdrop-blur-xl
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          px-6 py-3
          flex justify-between items-center
        "
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            {currentTheme === "dark" ? (
              <Image src="/oss.svg" width={85} height={85} alt="OSS" />
            ) : (
              <Image src="/oss.svg" width={85} height={85} alt="OSS" />
            )}
            <div className="absolute inset-0 blur-lg bg-blue-400/30 rounded-full" />
          </div>
          <ThemeToggle />
        </div>

        <div className="flex gap-8 justify-center items-center text-amber-50">
          <Link href="#all-services" className="hover:text-blue-400 transition-all">SERVICES</Link>
          <Link href="#maps" className="hover:text-blue-400 transition-all">MAPS</Link>
          <Link href="#oss-data" className="hover:text-blue-400 transition-all">OSS DATA</Link>
          <Link href="#contact" className="hover:text-blue-400 transition-all">CONTACT US</Link>
          <div className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center text-white shadow">
            <CircleUserRound size={24} />
          </div>
        </div>
      </div>
    </header>
  );
}
