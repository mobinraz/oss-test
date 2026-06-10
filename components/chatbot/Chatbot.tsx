"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, User, Sparkles } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

type MessageType = {
  id: number;
  text: string;
  type: "bot" | "user";
};
type BotState = "active" | "longSleep" | "dance" | "football" | "hello";

export default function ChatWidget() {
  const IDLE_TIME = 3_000;
  const IDLE_LONG_TIME = 22_000;
  const IDLE_FOOTBALL_TIME = 10_000;
  const IDLE_DANCE_TIME = 6_000;
  const [state, setState] = useState<BotState>("active");
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    { id: 1, text: "سلام 👋 چطور می‌تونم کمکت کنم؟", type: "bot" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setState("active");
    idleTimer.current = setTimeout(() => {
      setState("hello");
      idleTimer.current = setTimeout(() => {
        setState("dance");
      }, IDLE_DANCE_TIME);
      idleTimer.current = setTimeout(() => {
        setState("football");
      }, IDLE_FOOTBALL_TIME);
      idleTimer.current = setTimeout(() => {
        setState("longSleep");
      }, IDLE_LONG_TIME);
    }, IDLE_TIME);
  }, []);

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    const handleAction = () => resetIdleTimer();
    events.forEach((e) => window.addEventListener(e, handleAction));
    resetIdleTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleAction));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, type: "user" },
    ]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "در حال بررسی پیام شما هستم 🤖",
          type: "bot",
        },
      ]);
    }, 1000);
  };

  const buttonStyle = clsx(`fixed
          bottom-[calc(env(safe-area-inset-bottom)+15px)]
          right-4
          z-50
          w-16 h-16 lg:w-32 lg:h-32
          cursor-pointer
          flex items-center justify-center
      `);

  return (
    <>
      <button onClick={() => setOpen(true)} className={buttonStyle}>
        <Image
          key={state}
          unoptimized
          src={
            state === "active"
              ? "/giphy.gif"
              : state === "hello"
                ? "/hello.gif"
                : state === "football"
                  ? "/2.gif"
                  : state === "dance"
                    ? "/dance.gif"
                    : "/sleep.gif"
          }
          alt="Robot Animation"
          width={256}
          height={256}
          className="object-contain w-52 h-52"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-28 right-6 z-50 w-95 h-137.5 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-white/40"
          >
            <div className="flex items-center justify-between px-6 py-5 bg-linear-to-r from-gray-900 via-gray-800 to-black text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                  <Bot size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">
                    OSS Assistant
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                      Online Now
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-gray-50/50 scroll-smooth">
              {messages.map((msg) => (
                <Message key={msg.id} {...msg} />
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-white/80 border-t border-gray-100 backdrop-blur-md">
              <div className="relative flex items-center gap-2">
                <input
                  dir="rtl"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="سوال خود را اینجا بنویسید..."
                  className="text-xs text-right flex-1 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white transition-all outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="bg-cyan-600 p-3 cursor-pointer text-white rounded-xl hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/40 transition-all active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-center text-gray-400 mt-2 tracking-widest uppercase">
                Powered by OSS MCI Team
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Message({ text, type }: { text: string; type: "user" | "bot" }) {
  const isUser = type === "user";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-start gap-2.5 max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${
            isUser
              ? "bg-gray-800 text-white"
              : "bg-white text-cyan-600 border border-gray-100"
          }`}
        >
          {isUser ? <User size={14} /> : <Bot size={14} />}
        </div>
        <div
          className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
            isUser
              ? "bg-black text-white rounded-tr-none"
              : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
          }`}
        >
          {text}
        </div>
      </div>
    </motion.div>
  );
}
