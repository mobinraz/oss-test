"use client";

import { useEffect, useState } from "react";

export default function TypeWriter({ selectedProvince, fullText }: any) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText("");
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [selectedProvince]);

  return (
    <>
      <div
        className="
          flex-1 w-full p-4 relative overflow-y-auto
          font-mono text-green-400
          bg-white/10 backdrop-blur-xl
          border border-white/10
          rounded-2xl
          shadow-[0_0_40px_rgba(0,0,0,0.35)]
        "
      >
        <div
          className="
            absolute inset-0 pointer-events-none
            bg-[linear-gradient(rgba(255,255,255,0.04)_50%,rgba(0,0,0,0.15)_50%)]
            bg-size-[100%_4px]
            opacity-30
          "
        />

        <div className="relative z-10 text-sm md:text-base leading-relaxed">
          <pre className="whitespace-pre-wrap drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]">
            {text}
            <span className="inline-block w-2 h-5 bg-green-400 ml-1 align-middle animate-pulse" />
          </pre>
        </div>
      </div>
    </>
  );
}
