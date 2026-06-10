"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Blocks,
  CalendarClock,
  HandFist,
  HandHeartIcon,
  HandIcon,
  Play,
  Rocket,
  SatelliteIcon,
  Tag,
} from "lucide-react";
import clsx from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";

type ServiceState = "Active" | "inActive" | "pending" | string;

type LogoItem = {
  id: number;
  logoSrc: string;
  bgcolor: string;
  title: string;
  location: string;
  version: string;
  state: ServiceState;
  expireDate?: string;
  ticketID?: string;
  url: string;
  category?: string;
};

function normalizeUrl(url?: string) {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col items-start truncate gap-1 text-xs w-full max-w-xs">
      <span
        title={value}
        className="text-left text-[#667C89] dark:text-gray-400 text-xs w-full truncate"
      >
        {label}
      </span>
      <span
        title={value}
        className="dark:text-gray-300 font-bold truncate w-full"
      >
        {value}
      </span>
    </div>
  );
}

function ServiceCard({ logo }: { logo: LogoItem }) {
  const isDisabled = logo.state === "Disable" || logo.state === "inActive";
  const isPending = logo.state === "pending";
  const isUnavailable = isDisabled || isPending;
  const href = isUnavailable ? undefined : normalizeUrl(logo.url);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPending) return;

    // فقط وقتی pending شروع میشه
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 80) {
          clearInterval(timer); // متوقف کردن انیمیشن در 80%
          return 80; // نگه داشتن روی 80
        }
        return p + 1; // افزایش تدریجی
      });
    }, 100); // سرعت حرکت: هر 50ms، 1٪ اضافه

    // تمیز کردن تایمر درUnmount
    return () => clearInterval(timer);
  }, [isPending]);

  return (
    <motion.a
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      whileHover={!isUnavailable ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={clsx(
        "relative group rounded-3xl w-full aspect-square pb-4",
        "bg-white/90 dark:bg-slate-800 border border-[#ECEFF1] dark:border-slate-600/70",
        "shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)]",
        isUnavailable && "opacity-60 cursor-not-allowed",
        "flex flex-col items-center",
      )}
    >
      <div
        className="absolute -top-7 left-1/2 border border-[#D0D8DB] dark:border-[#303030]
       -translate-x-1/2 w-14 h-14 rounded-full bg-white dark:bg-gray-200
        shadow-md ring-white dark:ring-slate-800 flex items-center justify-center z-10"
      >
        <Image
          src={logo.logoSrc}
          alt={logo.title}
          width={35}
          height={35}
          className="object-contain"
        />
      </div>
      {!isDisabled && !isPending && (
        <div className="mt-10 grow w-full flex flex-col items-center">
          <h3
            title={logo.title}
            className="text-center font-medium text-xs text-slate-900 dark:text-gray-100 line-clamp-2 px-2"
          >
            {logo.title}
          </h3>

          <div className="pt-4 grid grid-cols-2 gap-3 w-full px-4 mb-3">
            {logo.ticketID && (
              <MetaItem
                icon={<Tag className="w-3 h-3" />}
                label="Ticket ARM"
                value={logo.ticketID}
              />
            )}
            <MetaItem
              icon={<Rocket className="w-3 h-3" />}
              label="Version"
              value={logo.version}
            />

            {logo.expireDate && (
              <MetaItem
                icon={<CalendarClock className="w-3 h-3" />}
                label="Expire Date"
                value={logo.expireDate}
              />
            )}
            {logo.state && (
              <MetaItem
                icon={<SatelliteIcon className="w-3 h-3" />}
                label="State"
                value={logo.state}
              />
            )}
          </div>
        </div>
      )}
      {!isDisabled && !isPending && (
        <div className="w-full flex justify-center">
          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-xl px-12 h-9 text-sm transition-all",
              isDisabled
                ? "bg-[#465FFF]/40 text-white/60 cursor-not-allowed"
                : isPending
                  ? "bg-transparent text-white backdrop-blur-sm"
                  : "bg-[#465FFF] text-white hover:bg-[#5c72ff] Active:scale-95",
            )}
          >
            Launch
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      )}
      {isPending && (
        <div className="absolute px-6 inset-1 z-0 flex flex-col items-center justify-center backdrop-blur-sm rounded-xl">
          <div className="absolute top-12 text-center z-30 bg-orange-800/90 dark:bg-slate-400/30 text-white text-xs font-bold px-2 py-0.25 rounded-full shadow-sm backdrop-blur-sm">
            Coming Soon
          </div>
          <div className="text-xs mt-10 text-center opacity-90 text-neutral-700 dark:text-gray-100 font-bold">
            {logo.title}
          </div>
          <div className="w-full mt-4">
            <div className="progress-container h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="progress-bar striped h-full bg-slate-900 dark:bg-cyan-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center mt-1 text-xs text-slate-600 dark:text-gray-300">
              Loading {progress}%
            </p>
          </div>
        </div>
      )}
      {isDisabled && (
        <div className="absolute inset-1 z-0 flex flex-col items-center justify-center backdrop-blur-sm rounded-xl">
          <div className="absolute top-9 left-6 text-center z-30 bg-[#494949] dark:bg-slate-400/30 text-white text-xs font-bold px-2 py-0.25 rounded-full shadow-sm backdrop-blur-sm">
            Disable
          </div>
          <div className="text-xs mt-10 text-center opacity-90 text-neutral-700 dark:text-gray-100 font-bold">
            {logo.title}
          </div>
          <div className="w-full mt-4 text-center">
            <div className="flex flex-col gap-2 items-center">
              <Image src={"/denied.png"} width={50} height={50} alt="access denied" />
              <h3 className="text-red-300 text-xs font-bold">
                You Dont Have Access
              </h3>
            </div>
          </div>
        </div>
      )}
    </motion.a>
  );
}

export default function AllServices() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const LOGOS: LogoItem[] = [
    {
      id: 1,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-300",
      title: "Nokia Netact Cluster 2 - Core",
      location: "Tehran Tohid",
      version: "5.5",
      state: "Active",
      ticketID: "584894984-54135",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "http://rc02clu.rc02.netact.oss.mc.ir/",
    },
    {
      id: 2,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia Netact Cluster 3 - Core",
      location: "Tehran Tohid",
      version: "5.5",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2025/01/05",
      category: "Nokia",
      url: "http://rc03clu.rc03.netact.oss.mc.ir/",
    },
    {
      id: 3,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia Netact Cluster 5 - RAN",
      location: "Tehran Tohid",
      version: "17.8",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2025/01/05",
      category: "Nokia",
      url: "https://login.rc05.oss.mci.ir/",
    },
    {
      id: 4,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia OMS1 Cluster5 - RNC",
      location: "Tehran Tohid",
      version: "17",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.14.248.4",
    },
    {
      id: 5,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia OMS2 Cluster5 - RNC",
      location: "Tehran Tohid",
      version: "17",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.14.248.5",
    },
    {
      id: 6,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia Netact Cluster 6 - RAN",
      location: "Tehran Tohid",
      version: "17.8",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://login.rc06.oss.mci.ir/",
    },
    {
      id: 7,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia OMS1 Cluster6 - RNC",
      location: "Tehran Tohid",
      version: "17",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.14.249.4",
    },
    {
      id: 8,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia OMS2 Cluster6 - RNC",
      location: "Tehran Tohid",
      version: "17",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.14.249.5",
    },
    {
      id: 9,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia Netact Cluster 7 - RAN",
      location: "Tehran Tohid",
      version: "17.8",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://login.rc07.oss.mci.ir/",
    },
    {
      id: 10,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia OMS1 Cluster7 - RNC",
      location: "Tehran Tohid",
      version: "17",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.14.250.4",
    },

    {
      id: 11,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia Netact Cluster 8 - RAN",
      location: "Tehran Tohid",
      version: "19.1.0.9",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://pnlbp01.rc08.oss.mci.ir/",
    },
    {
      id: 12,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia OMS2 Cluster7 - RNC",
      location: "Tehran Tohid",
      version: "17",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.14.250.5",
    },
    {
      id: 13,
      logoSrc: "/nokia.png",
      bgcolor: "from-cyan-300 to-sky-600",
      title: "Nokia OMS1 Cluster8 - RNC",
      location: "Tehran Tohid",
      version: "19",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.163.107.80",
    },
    {
      id: 14,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-400 to-cyan-600",
      title: "Nokia OMS2 Cluster8 - RNC",
      location: "Tehran Tohid",
      version: "19",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.163.107.81",
    },
    {
      id: 15,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-400 to-cyan-600",
      title: "Nokia Netact Cluster 9 - RAN",
      location: "Tehran Tohid",
      version: "22.0.0.81",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://login.rc09.oss.mci.ir/",
    },
    {
      id: 16,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-300 to-cyan-100",
      title: "Nokia OMS1 Cluster9 - RNC",
      location: "Tehran Tohid",
      version: "22",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.24.84.209",
    },
    {
      id: 17,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-700 to-blue-300",
      title: "Nokia OMS2 Cluster9 - RNC",
      location: "Tehran Tohid",
      version: "22",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.24.84.210",
    },
    {
      id: 18,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-700 to-cyan-300",
      title: "Nokia Netact Cluster 10 - RAN",
      location: "Tehran Tohid",
      version: "22.0.0.81",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://login.rc10.oss.mci.ir/",
    },
    {
      id: 19,
      logoSrc: "/nokia.png",
      bgcolor: "from-cyan-400 to-blue-700",
      title: "Nokia OMS1 Cluste10 - RNC",
      location: "Tehran Tohid",
      version: "22",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.24.187.81",
    },
    {
      id: 20,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-300 to-blue-700",
      title: "Nokia OMS2 Cluster10 - RNC",
      location: "Tehran Tohid",
      version: "22",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.24.187.82",
    },
    {
      id: 21,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-500 to-sky-400",
      title: "Nokia Netact Cluster 11 - RAN",
      location: "Tehran Tohid",
      version: "19.8.0.101",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://pnlbp01.rc11.oss.mci.ir/",
    },
    {
      id: 22,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-300 to-blue-100",
      title: "Nokia OMS1 Cluster11 - RNC",
      location: "Tehran Tohid",
      version: "19",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.24.187.240",
    },
    {
      id: 23,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-300 to-blue-400",
      title: "Nokia OMS2 Cluster11 - RNC",
      location: "Tehran Tohid",
      version: "19",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.24.187.241",
    },
    {
      id: 24,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-400 to-blue-200",
      title: "Nokia Mantaray Cluster12 - RAN",
      location: "Tehran Tohid",
      version: "24R3 (25.3.0.1)",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://mcirc12wlb.rc12.oss.mci.ir/",
    },
    {
      id: 25,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-400 to-blue-200",
      title: "Nokia OMS1 Cluster12 - RNC",
      location: "Tehran Tohid",
      version: "24R3 (25.3.0.1)",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://mcirc12wlb.rc12.oss.mci.ir/",
    },
    {
      id: 26,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-400 to-blue-200",
      title: "Nokia OMS2 Cluster12 - RNC",
      location: "Tehran Tohid",
      version: "24",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://mcirc12wlb.rc12.oss.mci.ir/",
    },
    {
      id: 27,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-400 to-blue-200",
      title: "Nokia Mantaray GDR Cluster12 - RAN",
      location: "Tabriz Ghazi",
      version: "25",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://mcirc12wlb.rc12.oss.mci.ir/",
    },
    {
      id: 28,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-400 to-blue-200",
      title: "Nokia Mantaray Cluster Core",
      location: "Tehran Ramezani",
      version: "25",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://mcirc12wlb.rc12.oss.mci.ir/",
    },
    {
      id: 29,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-400 to-blue-200",
      title: "Nokia Mantaray GDR Cluster Core",
      location: "Ahwaz",
      version: "25",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://mcirc12wlb.rc12.oss.mci.ir/",
    },
    {
      id: 30,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-400 to-blue-200",
      title: "Nokia Eden-Net1",
      location: "Tehran Tohid",
      version: "17 SP1 MP2",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.14.179.91",
    },
    {
      id: 31,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia Eden-Net2",
      location: "Tehran Tohid",
      version: "17 SP1 MP2",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.14.179.93",
    },
    {
      id: 32,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia Eden-Net3",
      location: "Tehran Tohid",
      version: "17 SP1 MP2",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.14.179.95",
    },
    {
      id: 33,
      logoSrc: "/nokia.png",
      bgcolor: "from-sky-500 to-blue-700",
      title: "Nokia NADCM",
      location: "Tehran Tohid",
      version: "17 SP1 MP2",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "https://10.14.250.7/",
    },
    {
      id: 34,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-200 to-cyan-200",
      title: "Nokia LMM",
      location: "Tehran Tohid",
      version: "2",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.24.187.90",
    },
    {
      id: 35,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-200 to-red-400",
      title: "Huawei MAE RAN 1",
      location: "Tehran Tohid",
      version: "V100R024C10SPC210",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.163.220.7:31943/",
    },
    {
      id: 36,
      logoSrc: "/nokia.png",
      bgcolor: "from-blue-200 to-cyan-200",
      title: "Nokia Mantaray SON",
      location: "Tehran Tohid",
      version: "2",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Nokia",
      url: "10.24.187.90",
    },
    {
      id: 37,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-400 to-rose-500",
      title: "Huawei MAE RAN 3",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.163.222.7/",
    },
    {
      id: 38,
      logoSrc: "/huawei.png",
      bgcolor: "from-red-400 to-rose-200",
      title: "Huawei MAE RAN 2",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.163.221.7/",
    },
    {
      id: 39,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei MAE GDR RAN 1",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.163.222.7/",
    },
    {
      id: 40,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei MAE GDR RAN 2",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.163.222.7/",
    },
    {
      id: 41,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei MAE GDR RAN 3",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.163.222.7/",
    },
    {
      id: 42,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei MAE RAN 4",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.163.222.7/",
    },
    {
      id: 43,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei MAE GDR RAN 4",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.163.222.7/",
    },
    {
      id: 44,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei U2020 RAN 4K Cluster1",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.15.207.133:31943/",
    },
    {
      id: 45,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei U2020 RAN 3.2K Cluster2",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.15.80.133:31943/",
    },
    {
      id: 46,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei U2000 RAN",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.14.41.134",
    },
    {
      id: 47,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei U2000 TX",
      location: "Tehran Tohid",
      version: "V100R021C10SPC270",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.14.33.138",
    },
    {
      id: 48,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-rose-200",
      title: "Huawei NCE TX",
      location: "Tehran Tohid",
      version: "V100R021C10CP2652",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.186.124.129:31943/",
    },
    {
      id: 49,
      logoSrc: "/huawei.png",
      bgcolor: "from-red-400 to-rose-400",
      title: "Huawei NCE GDR TX",
      location: "Tabriz Ghazi",
      version: "V100R021C10CP2652",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.172.187.178:31943/",
    },
    {
      id: 50,
      logoSrc: "/huawei.png",
      bgcolor: "from-red-200 to-red-300",
      title: "Huawei NCE2 TX",
      location: "",
      version: "V100R021C10CP2652",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.172.187.178:31943/",
    },
    {
      id: 51,
      logoSrc: "/huawei.png",
      bgcolor: "from-red-200 to-red-300",
      title: "Huawei NCE2 GDR TX",
      location: "",
      version: "V100R021C10CP2652",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.172.187.178:31943/",
    },
    {
      id: 52,
      logoSrc: "/huawei.png",
      bgcolor: "from-red-200 to-red-300",
      title: "Huawei NCE IPBB IPBH",
      location: "Tehran Tohid",
      version: "V100R022C00SPC105",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.186.206.149:31943/",
    },
    {
      id: 53,
      logoSrc: "/huawei.png",
      bgcolor: "from-red-400 to-red-600",
      title: "Huawei NCE GDR IPBB IPBH",
      location: "Tabriz Ghazi",
      version: "V100R022C00SPC105",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.172.159.149:31943/",
    },
    {
      id: 54,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-400 to-red-200",
      title: "Huawei NCE IPBB IPBH",
      location: "Tabriz Ghazi",
      version: "V100R022C00SPC105",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.186.206.149:31943/",
    },
    {
      id: 55,
      logoSrc: "/ericsson.png",
      bgcolor: "from-purple-400 to-violet-200",
      title: "Ericsson SOEM TX",
      location: "Tehran Tohid",
      version: "16A R1M(R1M_2 ECP)",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.15.41.177:30305",
    },

    {
      id: 56,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-blue-400",
      title: "Ericsson OSSRC Tehran2 - 2G",
      location: "Tehran Tohid",
      version: "OSSRC_O17_2",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.15.195.164",
    },
    {
      id: 57,
      logoSrc: "/ericsson.png",
      bgcolor: "from-purple-400 to-blue-100",
      title: "Ericsson ENM1 RAN",
      location: "Tehran Tohid",
      version: "v21.03",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://enm1.oss.mci.ir/",
    },

    {
      id: 58,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-500/90 to-red-500/80",
      title: "Huawei MAE GDR Core",
      location: "Isfahan Montazeri",
      version: "V100R023C10SPC220",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.122.35.6:31943/",
    },

    {
      id: 59,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600 to-violet-400",
      title: "Ericsson OSSRC North - 2G",
      location: "Tehran Tohid",
      version: "OSSRC_O17_2",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.15.196.4",
    },
    {
      id: 60,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-blue-400",
      title: "Ericsson Multiblade ENIQ All OSSRC",
      location: "Tehran Tohid",
      version: "v17.2.8.EU7",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.15.195.133:8443/adminui/servlet/LoaderStatusServlet",
    },
    {
      id: 61,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-blue-400",
      title: "Ericsson OSSRC Karaj - 2G",
      location: "Tehran Tohid",
      version: "OSSRC_O17_2",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.15.196.100",
    },
    {
      id: 62,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-100 to-red-200",
      title: "Huawe MAE Core",
      location: "Tehran Ramezani",
      version: "V100R023C10SPC220",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.176.35.6:31943/",
    },
    {
      id: 63,
      logoSrc: "/huawei.png",
      bgcolor: "from-rose-500/90 to-red-500/80",
      title: "Huawei i2000 CBS",
      location: "Tehran Tohid",
      version: "V100R023C10SPC220",
      state: "Disable",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Huawei",
      url: "https://10.15.33.233",
    },
    {
      id: 64,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-blue-400",
      title: "Ericcson ENIQ ENM1",
      location: "Tehran Tohid",
      version: "v20.4.9.EU7",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.14.252.60:8443/adminui/servlet/ShowLoadStatus",
    },

    {
      id: 66,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-blue-400",
      title: "Ericsson ENIQ ENM2",
      location: "Tehran Tohid",
      version: "OSSRC_O17_2",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.15.195.164",
    },
    {
      id: 67,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-blue-400",
      title: "Ericsson ENM3",
      location: "Tabriz Ghazi",
      version: "OSSRC_O17_2",
      state: "pending",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.15.195.164",
    },
    {
      id: 68,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-purple-600/70",
      title: "Ericsson vENM1",
      location: "Tehran Tohid",
      version: "v23Q3 (23.17)",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.15.195.164",
    },
    {
      id: 65,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-blue-400",
      title: "Ericsson ENM2 RAN",
      location: "Tehran Tohid",
      version: "v21.03",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://enm2.oss.mci.ir/",
    },
    {
      id: 69,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-300/90 to-blue-300",
      title: "Ericcson GDR vENM1",
      location: "Tabriz Ghazi",
      version: "",
      state: "pending",
      ticketID: "",
      expireDate: "",
      category: "Ericsson",
      url: "",
    },
    {
      id: 70,
      logoSrc: "/ai.png",
      bgcolor: "from-green-400 to-green-600/85",
      title: "FANA TX - DWDM App2",
      location: "Tehran Tohid",
      version: "4.1.2",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "http://10.156.32.35",
    },
    {
      id: 71,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-purple-500",
      title: "Ericsson cENM1 (CNIS)",
      location: "Tehran Tohid",
      version: "-",
      state: "pending",
      ticketID: "",
      expireDate: "",
      category: "Ericsson",
      url: "",
    },
    {
      id: 72,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-500/90 to-blue-700/60",
      title: "Ericsson GDR cENM1 (CNIS)",
      location: "Tabriz Ghazi",
      version: "-",
      state: "pending",
      ticketID: "",
      expireDate: "",
      category: "Ericsson",
      url: "",
    },
    {
      id: 73,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-600/90 to-blue-400",
      title: "Ericsson OSSRC Tehran2 - 2G",
      location: "Tehran Tohid",
      version: "OSSRC_O17_2",
      state: "Active",
      ticketID: "584894984",
      expireDate: "2026/01/05",
      category: "Ericsson",
      url: "https://10.15.195.164",
    },
    {
      id: 74,
      logoSrc: "/ai.png",
      bgcolor: "from-green-300 to-green-500",
      title: "ADVA SYNC",
      location: "Tehran Tohid",
      version: "16.1.1",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "https://10.15.90.31",
    },
    {
      id: 75,
      logoSrc: "/ai.png",
      bgcolor: "from-emerald-600 to-lime-500",
      title: "ADVA SYNC HA",
      location: "Tehran Tohid",
      version: "16.1.1",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "https://10.15.90.32",
    },
    {
      id: 76,
      logoSrc: "/ai.png",
      bgcolor: "from-lime-300 to-green-300",
      title: "SINA TX - DWDM",
      location: "Tehran Tohid",
      version: "0.1.18",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "http://10.186.192.35:4200",
    },
    {
      id: 77,
      logoSrc: "/ai.png",
      bgcolor: "from-green-500 to-lime-700",
      title: "FANA TX - DWDM App1",
      location: "Tehran Tohid",
      version: "4.1.2",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "http://10.156.32.34",
    },
    {
      id: 78,
      logoSrc: "/ericsson.png",
      bgcolor: "from-violet-400/90 to-blue-500",
      title: "Ericsson ENIQ vENM1",
      location: "Tehran Tohid",
      version: "-",
      state: "pending",
      ticketID: "",
      expireDate: "",
      category: "Ericsson",
      url: "",
    },
    {
      id: 79,
      logoSrc: "/ai.png",
      bgcolor: "from-pink-300/50 to-pink-400/70",
      title: "Cellusys - Signaling Firewall",
      location: "Tehran Ramezani",
      version: "3.2.6",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "https://10.10.33.220/auth/realms/cellusys/protocol/openid-connect/auth?client_id=user-management-auth&response_type=code&login=true&redirect_uri=https%3A%2F%2F10.10.33.220%2F%2Fportalpage%2F",
    },

    {
      id: 80,
      logoSrc: "/ai.png",
      bgcolor: "from-pink-500 to-pink-300/90",
      title: "F5 BIG IQ CGNAT",
      location: "Tehran Ramezani",
      version: "3.2.6",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "https://10.176.187.140",
    },
    {
      id: 81,
      logoSrc: "/ai.png",
      bgcolor: "from-pink-400/50 to-pink-600/80",
      title: "Comviva - Eagle NMS VAS",
      location: "Tehran Kazemian",
      version: "7.21.0",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "https://10.176.250.125/oam/login",
    },
    {
      id: 82,
      logoSrc: "/ai.png",
      bgcolor: "from-green-600 to-emerald-600",
      title: "Fanamoj TX - Microwave",
      location: "Tehran Tohid",
      version: "2.1.587",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "https://10.163.219.17/",
    },
    {
      id: 83,
      logoSrc: "/ai.png",
      bgcolor: "from-lime-600/80 to-green-600",
      title: "Farabeen 4G Node's",
      location: "Tehran Tohid",
      version: "2.1.588",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "AI",
      url: "https://10.163.219.21/",
    },
    {
      id: 84,
      logoSrc: "/zte.png",
      bgcolor: "from-orange-400/80 to-orange-600",
      title: "ZTE SMS Netnuman",
      location: "Tehran Tohid",
      version: "2.1.588",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "ZTE",
      url: "https://10.14.39.100",
    },
    {
      id: 85,
      logoSrc: "/zte.png",
      bgcolor: "from-orange-400 to-amber-500/60",
      title: "ZTE RBT Netnuman",
      location: "Tehran Tohid",
      version: "2.1.588",
      state: "Disable",
      ticketID: "",
      expireDate: "",
      category: "ZTE",
      url: "https://10.14.41.72",
    },
    {
      id: 86,
      logoSrc: "/zte.png",
      bgcolor: "from-orange-400 to-orange-300",
      title: "ZTE WLL Netnuman SGS",
      location: "Tehran Tohid",
      version: "9911",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "ZTE",
      url: "https://10.186.70.33",
    },
    {
      id: 87,
      logoSrc: "/zte.png",
      bgcolor: "from-orange-500/70 to-amber-600",
      title: "ZTE WLL Netnuman SGS",
      location: "Tehran Tohid",
      version: "9911",
      state: "Active",
      ticketID: "",
      expireDate: "",
      category: "ZTE",
      url: "https://10.186.70.33",
    },
    {
      id: 88,
      logoSrc: "/ai.png",
      bgcolor: "from-orange-300 to-amber-300",
      title: "Peykasa",
      location: "Tehran Tohid",
      version: "9911",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "AI",
      url: "https://10.15.41.39",
    },
    {
      id: 89,
      logoSrc: "/ai.png",
      bgcolor: "from-orange-300 to-amber-300",
      title: "Atoll",
      location: "-",
      version: "-",
      state: "pending",
      ticketID: "-",
      expireDate: "-",
      category: "AI",
      url: "",
    },
    {
      id: 90,
      logoSrc: "/ai.png",
      bgcolor: "from-orange-400 to-amber-400",
      title: "Peykasa New",
      location: "-",
      version: "-",
      state: "pending",
      ticketID: "-",
      expireDate: "-",
      category: "AI",
      url: "",
    },
    {
      id: 91,
      logoSrc: "/idm.png",
      bgcolor: "from-teal-400 to-teal-600",
      title: "idm on VDI",
      location: "-",
      version: "v4.9",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "IDM",
      url: "https://idm-primary.oss.mci.ir/",
    },
    {
      id: 92,
      logoSrc: "/idm.png",
      bgcolor: "from-teal-300 to-teal-400",
      title: "idm HA on VDI",
      location: "-",
      version: "v4.9",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "IDM",
      url: "https://idm-secondary.oss.mci.ir/",
    },
    {
      id: 93,
      logoSrc: "/idm.png",
      bgcolor: "from-teal-500 to-teal-400/60",
      title: "idm on OMC Farm",
      location: "-",
      version: "v4.9",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "IDM",
      url: "https://idm.oss.mci.ir/",
    },
    {
      id: 94,
      logoSrc: "/idm.png",
      bgcolor: "from-teal-500 to-teal-cyan/60",
      title: "idm HA on OMC Farm",
      location: "-",
      version: "v4.9",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "IDM",
      url: "https://idm-replica.oss.mci.ir/",
    },
    {
      id: 95,
      logoSrc: "/idm.png",
      bgcolor: "from-cyan-800 to-teal-400/60",
      title: "Event Management Grafana",
      location: "-",
      version: "12",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "IDM",
      url: "https://idm-replica.oss.mci.ir/",
    },
    {
      id: 96,
      logoSrc: "/zabixx.png",
      bgcolor: "from-cyan-800 to-teal-400/60",
      title: "Event Management Zabbix",
      location: "-",
      version: "7",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "Zabix",
      url: "https://zabbix-oss.mci.ir:8080",
    },
    {
      id: 97,
      logoSrc: "/zabixx.png",
      bgcolor: "from-cyan-600/80 to-teal-500",
      title: "Event Management Zabbix HA",
      location: "-",
      version: "7",
      state: "pending",
      ticketID: "-",
      expireDate: "-",
      category: "Zabix",
      url: "https://zabbix-oss.mci.ir:8081",
    },
    {
      id: 98,
      logoSrc: "/zabixx.png",
      bgcolor: "from-cyan-400/80 to-teal-600",
      title: "Event Management Zabbix Dev1",
      location: "-",
      version: "7",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "Zabix",
      url: "https://zabbix-oss-dev.mci.ir:8083",
    },
    {
      id: 99,
      logoSrc: "/zabixx.png",
      bgcolor: "from-cyan-400/80 to-teal-600",
      title: "Event Management Zabbix Dev2",
      location: "-",
      version: "7",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "Zabix",
      url: "https://zabix-oss-dev.mci.ir:8082",
    },
    {
      id: 100,
      logoSrc: "/zabixx.png",
      bgcolor: "from-cyan-400/80 to-teal-400",
      title: "OSS AI RAG",
      location: "-",
      version: "7",
      state: "Active",
      ticketID: "-",
      expireDate: "-",
      category: "Zabix",
      url: "https://zabix-oss-dev.mci.ir:8082",
    },
    {
      id: 101,
      logoSrc: "/ai.png",
      bgcolor: "from-cyan-400/80 to-teal-400",
      title: "OSS AI Prediction",
      location: "-",
      version: "-",
      state: "pending",
      ticketID: "-",
      expireDate: "-",
      category: "AI",
      url: "",
    },
    {
      id: 102,
      logoSrc: "/ai.png",
      bgcolor: "from-cyan-400/80 to-teal-400",
      title: "OSS AI Anomaly Detection",
      location: "-",
      version: "-",
      state: "pending",
      ticketID: "-",
      expireDate: "-",
      category: "AI",
      url: "",
    },
    {
      id: 103,
      logoSrc: "/ai.png",
      bgcolor: "from-cyan-400/80 to-teal-400",
      title: "OSS AI Root Cause Analysis",
      location: "-",
      version: "-",
      state: "pending",
      ticketID: "-",
      expireDate: "-",
      category: "AI",
      url: "",
    },
    {
      id: 104,
      logoSrc: "/ai.png",
      bgcolor: "from-cyan-400/80 to-teal-400",
      title: "OSS AI Automation",
      location: "-",
      version: "-",
      state: "pending",
      ticketID: "-",
      expireDate: "-",
      category: "AI",
      url: "",
    },
  ];
  const groupedLogos = LOGOS.reduce<Record<string, LogoItem[]>>((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});
  const totalCount = LOGOS.length;

  useEffect(() => {
    if (!start || counter >= totalCount) return;
    const delay = 12 + counter * 0.6;
    const t = setTimeout(() => {
      setCounter((c) => c + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [start, counter, totalCount]);

  return (
    <div className="flex flex-col px-8" id="all-services">
      <div ref={ref} className="flex justify-center items-center gap-3 py-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <Blocks className="w-6 h-6 md:w-8 md:h-8 text-stone-600 dark:text-gray-200" />
        </motion.div>
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-stone-700 dark:text-gray-200 text-center text-xl md:text-2xl font-bold tracking-tight"
        >
          All Services{" "}
          <span className="text-stone-500 dark:text-gray-200 font-semibold">
            ({counter})
          </span>{" "}
          Items
        </motion.h3>
      </div>

      <div className="px-4 md:px-0 pb-12">
        <div className="grid grid-cols-12 gap-4 md:gap-5 lg:gap-y-10 auto-rows-[minmax(60px,auto)]">
          {Object.entries(groupedLogos).map(([category, items]) => (
            <Fragment key={category}>
              <div className="col-span-12 flex items-center gap-3">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200">
                  {category}
                </h4>
                <div className="h-px flex-1 bg-linear-to-r from-gray-300 via-gray-200 to-transparent dark:via-slate-700 rounded-full" />
              </div>

              {items.map((logo) => (
                <div
                  key={logo.id}
                  className="col-span-6 sm:col-span-3 lg:col-span-2"
                >
                  <ServiceCard logo={logo} />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
