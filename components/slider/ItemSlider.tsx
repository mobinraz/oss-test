"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

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

export default function Carousel3D() {
  return (
    <div className="relative w-full overflow-hidden py-10">
      <button className="swiper-prev absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800 backdrop-blur shadow-xl hover:scale-110 transition cursor-pointer flex items-center justify-center">
        <ChevronLeft />
      </button>

      <button className="swiper-next absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800 backdrop-blur shadow-xl hover:scale-110 transition cursor-pointer flex items-center justify-center">
        <ChevronRight />
      </button>

      <Swiper
        modules={[Navigation, Keyboard, EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        loop={true}
        grabCursor
        keyboard={{
          enabled: true,
        }}
        navigation={{
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        }}
        slidesPerView={"auto"}
        speed={500}
        coverflowEffect={{
          rotate: -10,
          stretch: 10,
          depth: 20,
          modifier: 1,
          scale: 0.9,
          slideShadows: false,
        }}
        className="overflow-visible!"
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id} className="w-65! md:w-70!">
            {({ isActive }) => (
              <div
                className={`relative w-64 h-96 rounded-[36px] p-8 flex flex-col items-center justify-between backdrop-blur-xl border transition-all duration-500 ${
                  isActive
                    ? "bg-white shadow-xl dark:bg-gray-700 border-white dark:border-gray-900 scale-105"
                    : "bg-white/40 dark:bg-gray-800 border-white/30 shadow-xl dark:border-gray-900"
                }`}
              >
                {isActive && (
                  <div className="absolute -inset-7 rounded-full dark:bg-gray-300/40 blur-3xl" />
                )}

                <div className="relative z-10 w-28 h-28 flex items-center justify-center">
                  <Image
                    src={item.logo}
                    alt={item.brand}
                    width={140}
                    height={140}
                    priority
                  />
                </div>

                <div className="text-center z-10">
                  <h2 className="text-2xl font-black text-neutral-800 dark:text-gray-200">
                    {item.brand}
                  </h2>

                  <p className="text-xs text-neutral-500 dark:text-gray-200 mt-2 leading-relaxed">
                    Leading global provider of communication technology.
                  </p>
                </div>

                <button
                  className={`z-10 w-full py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#465FFF] border border-[#4C4AFF] text-white hover:bg-[#3834fd] shadow-lg"
                      : "bg-[#465FFF]/40 text-white pointer-events-none"
                  }`}
                >
                  View Profile
                </button>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
