import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { useState } from "react";
import GlassCard from "./GlassCard";
import { useCountUp } from "../hooks/useCountUp";
import { formatRupeesExact } from "../lib/format";
import { goldRate } from "../data/mock";
import { spring } from "../lib/motion";

/** Live-style rate module with selectable purities. */
export default function GoldRateCard() {
  const [selected, setSelected] = useState(goldRate.types[0].karat);
  const active = goldRate.types.find((type) => type.karat === selected) ?? goldRate.types[0];
  const price = useCountUp(active.price, { duration: 1.2, delay: 0.5 });

  return (
    <GlassCard className="px-6 py-6" beamDelay={1.8}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-luxe uppercase text-bronze">Today&apos;s rate</p>
        <span className="flex items-center gap-1.5 text-[9.5px] tracking-luxe-sm uppercase text-emerald-300/85">
          <motion.span
            aria-hidden
            className="h-1 w-1 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          Live
        </span>
      </div>

      <div className="mt-3.5 flex items-end justify-between">
        <div>
          <p className="font-display text-[32px] leading-none text-champagne">
            {formatRupeesExact(price)}
          </p>
          <p className="mt-2 text-[11px] text-champagne-dim">
            per {active.per} · {active.karat}
          </p>
        </div>
        <span className="flex items-center gap-1 pb-1 text-[12px] text-rose-300/80">
          <TrendingDown size={13} strokeWidth={1.7} />
          {Math.abs(goldRate.trend).toFixed(2)}
          <span className="text-champagne-dim">({goldRate.trendPercent}%)</span>
        </span>
      </div>

      <div className="mt-5 flex gap-2" role="group" aria-label="Gold purity">
        {goldRate.types.map((type) => {
          const isActive = type.karat === selected;
          return (
            <button
              key={type.karat}
              type="button"
              onClick={() => setSelected(type.karat)}
              aria-pressed={isActive}
              className="relative isolate flex-1 rounded-xl px-2 py-2 text-[11px] tracking-luxe-sm uppercase transition-colors duration-400"
              style={{
                border: `1px solid ${isActive ? "rgba(249,223,50,0.34)" : "rgba(215,175,92,0.14)"}`,
                color: isActive ? "#F7E79A" : "#9c8a6d",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="rate-chip"
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(145,100,15,0.34) 0%, rgba(60,12,12,0.28) 100%)",
                    boxShadow: "inset 0 1px 0 rgba(251,241,201,0.16)",
                  }}
                  transition={spring.soft}
                />
              )}
              {type.karat}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[10.5px] text-champagne-dim/80">Updated {goldRate.updatedAt}</p>
    </GlassCard>
  );
}
