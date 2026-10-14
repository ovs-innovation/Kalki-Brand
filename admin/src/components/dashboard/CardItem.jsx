import React from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import useUtilsFunction from "@/hooks/useUtilsFunction";

// Map className color tokens → clean modern badge and border styling
const colorMap = {
  orange: {
    bg: "bg-white dark:bg-zinc-900/60 hover:dark:bg-zinc-900/90",
    border: "border-gray-200 dark:border-white/10 hover:border-orange-500/40",
    icon: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    dot: "bg-orange-400",
  },
  blue: {
    bg: "bg-white dark:bg-zinc-900/60 hover:dark:bg-zinc-900/90",
    border: "border-gray-200 dark:border-white/10 hover:border-blue-500/40",
    icon: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    dot: "bg-blue-400",
  },
  teal: {
    bg: "bg-white dark:bg-zinc-900/60 hover:dark:bg-zinc-900/90",
    border: "border-gray-200 dark:border-white/10 hover:border-teal-500/40",
    icon: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
    dot: "bg-teal-400",
  },
  green: {
    bg: "bg-white dark:bg-zinc-900/60 hover:dark:bg-zinc-900/90",
    border: "border-gray-200 dark:border-white/10 hover:border-emerald-500/40",
    icon: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  purple: {
    bg: "bg-white dark:bg-zinc-900/60 hover:dark:bg-zinc-900/90",
    border: "border-gray-200 dark:border-white/10 hover:border-purple-500/40",
    icon: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    dot: "bg-purple-400",
  },
  emerald: {
    bg: "bg-white dark:bg-zinc-900/60 hover:dark:bg-zinc-900/90",
    border: "border-gray-200 dark:border-white/10 hover:border-emerald-500/40",
    icon: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  red: {
    bg: "bg-white dark:bg-zinc-900/60 hover:dark:bg-zinc-900/90",
    border: "border-gray-200 dark:border-white/10 hover:border-rose-500/40",
    icon: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    dot: "bg-rose-400",
  },
  yellow: {
    bg: "bg-white dark:bg-zinc-900/60 hover:dark:bg-zinc-900/90",
    border: "border-gray-200 dark:border-white/10 hover:border-amber-500/40",
    icon: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
  },
};

const CardItem = ({
  title,
  Icon,
  quantity,
  amount,
  className,
  loading,
  pending,
  todayPending,
  olderPending,
  isAmount,
  link,
}) => {
  const { getNumberTwo, currency } = useUtilsFunction();

  // Detect color from className string
  const colorKey = Object.keys(colorMap).find((key) =>
    className?.includes(key)
  ) || "teal";
  const colors = colorMap[colorKey];

  return (
    <div className="h-full w-full">
      {loading ? (
        <Skeleton height={148} borderRadius={16} />
      ) : (
        <Link
          to={link || "#"}
          className={`relative flex flex-col justify-between h-full ${colors.bg} rounded-2xl border ${colors.border} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden p-6 group no-underline hover:-translate-y-1`}
        >
          {/* Top: Icon + optional amount badge */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${colors.icon} shrink-0 transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="text-[18px]" />
            </div>
            {amount ? (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 leading-none">
                {currency}{getNumberTwo(amount)}
              </span>
            ) : null}
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0`} />
              <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-[0.12em] leading-none truncate">
                {title}
              </span>
            </div>

            {pending && (
              <div className="flex gap-3 mt-1.5 mb-1">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider">Today</span>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                    {getNumberTwo(todayPending)}
                  </span>
                </div>
                <div className="flex flex-col border-l border-gray-200 dark:border-white/10 pl-3">
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider">Older</span>
                  <span className="text-xs font-bold text-orange-500 dark:text-orange-400">
                    {getNumberTwo(olderPending)}
                  </span>
                </div>
              </div>
            )}

            {/* Big Number */}
            <p className="text-[1.85rem] sm:text-[2rem] font-black text-gray-900 dark:text-white leading-none mt-2.5 tracking-tight">
              {isAmount ? `${currency}${getNumberTwo(quantity)}` : quantity ?? 0}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default CardItem;