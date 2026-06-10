"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Item = {
  id: number;
  brand: string;
  logo: string;
};

const items: Item[] = [
  { id: 1, brand: "Huawei", logo: "/huawei.png" },
  { id: 2, brand: "Ericsson", logo: "/ericsson.png" },
  { id: 3, brand: "Nokia", logo: "/nokia.png" },
  { id: 4, brand: "ZTE", logo: "/zte.png" },
  { id: 5, brand: "Huawei", logo: "/huawei.png" },
  { id: 6, brand: "Ericsson", logo: "/ericsson.png" },
  { id: 7, brand: "Nokia", logo: "/nokia.png" },
  { id: 8, brand: "ZTE", logo: "/zte.png" },
];

const RADIUS = 1200;
const ANGLE = 14;

export default function Carousel3D() {
  const [active, setActive] = useState(0);
  const count = items.length;

  const next = () => setActive((p) => (p + 1) % count);
  const prev = () => setActive((p) => (p - 1 + count) % count);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getOffset = (i: number) => {
    let o = i - active;
    if (o > count / 2) o -= count;
    if (o < -count / 2) o += count;
    return o;
  };

  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center">
      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-10 z-45 mb-12 w-12 h-12 cursor-pointer rounded-full bg-white/80 dark:bg-gray-800 backdrop-blur shadow-xl hover:scale-110 transition"
      >
        <ChevronLeft className="mx-auto" />
      </button>

      <button
        onClick={next}
        className="absolute mb-12 right-10 z-45 w-12 h-12 cursor-pointer rounded-full bg-white/80 dark:bg-gray-800 backdrop-blur shadow-xl hover:scale-110 transition"
      >
        <ChevronRight className="mx-auto" />
      </button>

      {/* Stage */}
      {/* 3D Stage */}

      {/* Carousel */}
      <div className="relative w-full h-125 mb-4 flex items-center justify-center perspective-distant">
        {items.map((item, i) => {
          const offset = getOffset(i);
          const theta = offset * ANGLE;
          const rad = (theta * Math.PI) / 180;

          const x = Math.sin(rad) * RADIUS;
          const z = Math.cos(rad) * RADIUS - RADIUS;

          const isActive = offset === 0;

          return (
            <motion.div
              key={item.id}
              className="absolute"
              animate={{
                x,
                z,
                rotateY: theta,
                scale: isActive ? 1.15 : 0.9,
                opacity: Math.abs(theta) > 90 ? 0 : 1,
                zIndex: 100 - Math.abs(offset),
              }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 26,
              }}
              style={{ transformStyle: "preserve-3d" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) next();
                if (info.offset.x > 40) prev();
              }}
            >
              <div
                className={clsx(
                  "w-64 h-96 rounded-[36px] p-8 flex flex-col items-center justify-between",
                  "backdrop-blur-xl border transition-all duration-500",
                  isActive
                    ? "bg-white shadow-xl dark:bg-gray-700 border-white dark:border-gray-900"
                    : "bg-white/40 dark:bg-gray-800 border-white/30 shadow-xl dark:border-gray-900",
                )}
              >
                {/* Glow */}
                {isActive && (
                  <div className="absolute -inset-7.5 rounded-full dark:bg-gray-300/40 blur-3xl" />
                )}

                {/* Logo */}
                <div className="relative z-10 w-28 h-28 flex items-center justify-center">
                  <Image
                    src={item.logo}
                    alt={item.brand}
                    width={140}
                    height={140}
                    className="object-contain drop-shadow-xl"
                  />
                </div>

                {/* Text */}
                <div className="text-center z-10">
                  <h2 className="text-2xl font-black text-neutral-800 dark:text-gray-200">
                    {item.brand}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-gray-200 mt-2 leading-relaxed">
                    Leading global provider of communication technology.
                  </p>
                </div>
                <button
                  className={clsx(
                    "z-10 w-full py-3 rounded-xl text-sm font-semibold transition cursor-pointer",
                    isActive
                      ? "bg-[#465FFF] border border-[#4C4AFF] text-white hover:bg-[#3834fd] shadow-lg"
                      : "bg-[#465FFF]/40 text-white pointer-events-none",
                  )}
                >
                  View Profile
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
