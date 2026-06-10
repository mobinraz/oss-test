"use client";

import Image from "next/image";
import TypeWriter from "../type-writer/TypeWriter";
import { useMemo } from "react";

export default function ProvinceMap({ selectedProvince }: any) {
  const provinceGifs: Record<string, string> = {
    Tehran: "/tehran.gif",
    Alborz: "/karaj.gif",
    Esfahan: "/isfahan.gif",
    Shiraz: "/",
    Qom: "/qom.gif",
    Qazvin: "/qazvin.gif",
    Hamadan: "/hamedan.gif",
    Lorestan: "/lorestan.gif",
    Kordestan: "/kordestan.gif",
    Semnan: "/semnan.gif",
    Ardebil: "/ardebil.gif",
    Kerman: "/kerman.gif",
    Yazd: "/yazd.gif",
    "Sistan and Baluchestan": "/sistan2.gif",
    Hormozgan: "/hormoz.gif",
    Bushehr: "/bushehr.gif",
    Fars: "/fars.gif",
    Khuzestan: "/khuzestan.gif",
    "Razavi Khorasan": "/mashhad.gif",
    "East Azarbaijan": "/tabriz.gif",
    "West Azarbaijan": "/azarbayjan_gharbi.gif",
    Mazandaran: "/mazandaran.gif",
    Golestan: "/golestan.gif",
    Gilan: "/gilan.gif",
  };
  const sampleText = `No. of All Cells:\nNo. of Active Cells:\nNo. of Sites:\nNo. of Active Sites:`;
  const currentGif = useMemo(() => {
    if (!selectedProvince) return null;
    return provinceGifs[selectedProvince] || "/gifs/default_iran.gif";
  }, [selectedProvince]);

console.log("Province name:", selectedProvince);

  return (
    <div className="flex-1 h-full rounded-3xl flex flex-col items-center justify-center border border-gray-100 relative">
      {selectedProvince ? (
        <div className="flex flex-col h-full w-full bg-black overflow-hidden border border-gray-800 rounded-3xl">
          <div className="relative flex-3 w-full group overflow-hidden">
            <Image
              fill
              src={currentGif!}
              alt={selectedProvince || "Province"}
              className="object-cover transition-transform duration-700"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white text-[10px] font-mono uppercase tracking-widest">
                {selectedProvince}
              </span>
            </div>
          </div>
          <div className="h-px w-full bg-green-500/20" />
          <TypeWriter
            selectedProvince={selectedProvince}
            fullText={sampleText}
          />
        </div>
      ) : (
        <div className="flex flex-col h-full w-full bg-black overflow-hidden border border-transparent dark:border-gray-900 rounded-3xl">
          <h1 className="text-xs md:text-sm text-white px-3 mx-auto py-3 mt-3 w-fit text-center bg-white/30 rounded-4xl">
            لطفا مانند تصویر یک استان را انتخاب کنید تا جزئیات بیشتر را ببینید
          </h1>
          <div className="relative flex-3 w-full group overflow-hidden">
            <Image
              src="/help.gif"
              alt="Robot Animation"
              fill
              priority
              className="object-contain p-3"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black to-transparent" />
          </div>
          <div className="h-px w-full bg-green-500/20" />
          <TypeWriter
            selectedProvince={selectedProvince}
            fullText="Please Select City To Show More...."
          />
        </div>
      )}
    </div>
  );
}
