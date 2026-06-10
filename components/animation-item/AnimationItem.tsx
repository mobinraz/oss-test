"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isLogo?: boolean;
};

const LOGOS = [
  { id: 1, src: "/ericsson.png", name: "Ericsson", x: 15, y: 20 },
  { id: 2, src: "/nokia.png", name: "Nokia", x: 35, y: 15 },
  { id: 3, src: "/huawei.png", name: "Huawei", x: 55, y: 22 },
  { id: 4, src: "/zte.png", name: "ZTE", x: 75, y: 18 },
  { id: 5, src: "/nokia.png", name: "Samsung", x: 90, y: 28 },
  { id: 6, src: "/huawei.png", name: "Cisco", x: 20, y: 40 },
  { id: 7, src: "/nokia.png", name: "Nokia", x: 40, y: 38 },
  { id: 8, src: "/ericsson.png", name: "Ericsson", x: 60, y: 42 },
  { id: 9, src: "/zte.png", name: "ZTE", x: 80, y: 40 },
  { id: 10, src: "/huawei.png", name: "Huawei", x: 10, y: 55 },
  { id: 11, src: "/nokia.png", name: "Samsung", x: 30, y: 58 },
  { id: 12, src: "/huawei.png", name: "Cisco", x: 50, y: 55 },
  { id: 13, src: "/zte.png", name: "Nokia", x: 70, y: 58 },
  { id: 14, src: "/ericsson.png", name: "Ericsson", x: 90, y: 55 },
  { id: 15, src: "/zte.png", name: "ZTE", x: 18, y: 75 },
  { id: 16, src: "/huawei.png", name: "Huawei", x: 38, y: 78 },
  { id: 17, src: "/nokia.png", name: "Samsung", x: 58, y: 75 },
  { id: 18, src: "/huawei.png", name: "Cisco", x: 78, y: 78 },
  { id: 19, src: "/nokia.png", name: "Nokia", x: 45, y: 90 },
  { id: 20, src: "/huawei.png", name: "Ericsson", x: 65, y: 90 },
];

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: -2000, y: -2000 });
  const [, forceRender] = useState(0);

  useEffect(() => {
    const width = window.innerWidth;
    const height = 450;

    const logoNodes = LOGOS.map((l) => ({
      x: (l.x * width) / 100,
      y: (l.y * height) / 100,
      vx: 0,
      vy: 0,
      isLogo: true,
    }));

    const movingNodes = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      isLogo: false,
    }));

    pointsRef.current = [...logoNodes, ...movingNodes];
    forceRender((v) => v + 1);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -2000, y: -2000 };
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      const mouse = mouseRef.current;

      points.forEach((p) => {
        if (!p.isLogo) {
          // اثر تعاملی بسیار نرم
          const dxMouse = mouse.x - p.x;
          const dyMouse = mouse.y - p.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < 250) {
            p.x += dxMouse * 0.008;
            p.y += dyMouse * 0.008;
          }

          // حرکت طبیعی
          p.x += p.vx;
          p.y += p.vy;

          // برخورد با دیواره‌ها
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
      });

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = points[i].isLogo || points[j].isLogo ? 220 : 130;

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
            ctx.lineWidth = points[i].isLogo || points[j].isLogo ? 1.2 : 0.5;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 450;
    };
    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="flex flex-col px-8">
      <div className="relative flex py-5 items-center">
        <div className="grow border-t border-gray-300"></div>
        <span className="shrink mx-4 text-gray-500 dark:text-gray-200">OSS Vendors Network</span>
        <div className="grow border-t border-gray-300"></div>
      </div>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-112.5 overflow-hidden border-2 border-[#ECEFF1] bg-black cursor-default rounded-3xl"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />

        {LOGOS.map((logo, index) => {
          const node = pointsRef.current[index];
          if (!node) return null;

          return (
            <div
              key={logo.id}
              className="absolute z-10 select-none"
              style={{
                left: `${logo.x}%`,
                top: `${logo.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-2xl scale-[1.3] group-hover:bg-red-400/20 transition-all duration-1000" />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative w-14 h-14 rounded-full bg-white/5 border border-black/40 backdrop-blur-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:border-cyan-500 cursor-pointer transition-all duration-500"
                >
                  <div className="relative w-9 h-9">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      className="object-contain filter brightness-110 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]"
                    />
                  </div>
                </motion.div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-black text-[8px] font-bold tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap">
                  {logo.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
