import { motion, useReducedMotion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import GlassCard from "./GlassCard";
import { useCountUp } from "../hooks/useCountUp";
import { formatRupeesExact } from "../lib/format";
import { goldRate } from "../data/mock";
import { ease, spring } from "../lib/motion";

const WIDTH = 300;
const HEIGHT = 84;

/** Smooth path through the movement samples, plus a filled area beneath it. */
function useSparkline(samples: number[]) {
  return useMemo(() => {
    const step = WIDTH / (samples.length - 1);
    const points = samples.map((value, index) => ({
      x: index * step,
      y: HEIGHT - value * (HEIGHT - 12) - 6,
    }));

    let line = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;
      line += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }

    return { line, area: `${line} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`, last: points[points.length - 1] };
  }, [samples]);
}

export default function GoldRateCard() {
  const [selected, setSelected] = useState(goldRate.options[0].id);
  const reduced = useReducedMotion();
  const active = goldRate.options.find((option) => option.id === selected) ?? goldRate.options[0];
  const price = useCountUp(active.price, { duration: 1.4, delay: 0.35 });
  const { line, area, last } = useSparkline(goldRate.movement);
  const falling = active.change < 0;

  return (
    <GlassCard className="px-5 py-5" beamDelay={0}>
      {/* Radial dial motif, slowly turning */}
      <motion.svg
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 opacity-[0.16]"
        viewBox="0 0 200 200"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2="100"
            y2="6"
            stroke="#F9DF32"
            strokeWidth="0.6"
            transform={`rotate(${(i * 360) / 24} 100 100)`}
          />
        ))}
        {[34, 56, 78, 94].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#F9DF32" strokeWidth="0.6" />
        ))}
      </motion.svg>

      <div className="flex items-center gap-3">
        <h2 className="font-display text-[19px] leading-none text-champagne">Today&apos;s Gold Rate</h2>
        <span className="flex items-center gap-1.5 rounded-full border border-[rgba(249,223,50,0.32)] px-2.5 py-1 text-[9.5px] tracking-luxe-sm uppercase text-gold-200">
          <motion.span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-gold-300"
            animate={reduced ? undefined : { opacity: [1, 0.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          Live
        </span>
        <span className="ml-auto text-[11px] text-champagne-dim">{goldRate.quotedOn}</span>
      </div>

      <p className="mt-4 text-[10px] tracking-luxe uppercase text-bronze">
        {active.unit} · {active.karat}
      </p>
      <p className="mt-1.5 font-display text-[clamp(28px,7vw,34px)] leading-none text-metal-gold">
        {formatRupeesExact(price)}
      </p>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(215,175,92,0.22)] px-3 py-1.5">
        <span className={`flex items-center gap-1 text-[12px] ${falling ? "text-rose-300/85" : "text-emerald-300/85"}`}>
          {falling ? <TrendingDown size={13} strokeWidth={1.8} /> : <TrendingUp size={13} strokeWidth={1.8} />}
          ₹{Math.abs(active.change).toFixed(2)}
        </span>
        <span className="text-[11px] text-champagne-dim">vs last update</span>
      </div>

      <p className="mt-5 text-[10px] tracking-luxe uppercase text-bronze">Recent movement</p>
      <div className="relative mt-3 w-full">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-[72px] w-full lg:h-[64px]"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="spark-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#91640F" />
              <stop offset="55%" stopColor="#F9DF32" />
              <stop offset="100%" stopColor="#FDF6CF" />
            </linearGradient>
            <linearGradient id="spark-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F9DF32" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#F9DF32" stopOpacity="0" />
            </linearGradient>
          </defs>

          <motion.path
            d={area}
            fill="url(#spark-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: ease.luxe }}
          />
          <motion.path
            d={line}
            stroke="url(#spark-line)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.35, ease: ease.luxe }}
          />
        </svg>

        {/* Live marker pulsing at the latest sample */}
        <motion.span
          aria-hidden
          className="absolute h-2 w-2 rounded-full bg-gold-200"
          style={{
            left: `${(last.x / WIDTH) * 100}%`,
            top: `${(last.y / HEIGHT) * 100}%`,
            translateX: "-50%",
            translateY: "-50%",
            boxShadow: "0 0 12px 3px rgba(249,223,50,0.5)",
          }}
          animate={reduced ? undefined : { scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mt-5 flex gap-2" role="group" aria-label="Gold weight and purity">
        {goldRate.options.map((option) => {
          const isActive = option.id === selected;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              aria-pressed={isActive}
              className="relative isolate flex-1 rounded-full px-2 py-2 text-[11px] tracking-luxe-sm uppercase transition-colors duration-500"
              style={{
                border: `1px solid ${isActive ? "rgba(249,223,50,0.42)" : "rgba(215,175,92,0.18)"}`,
                color: isActive ? "#120000" : "#9c8a6d",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="rate-chip"
                  aria-hidden
                  className="metal-gold absolute inset-0 -z-10 rounded-full"
                  transition={spring.soft}
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3.5 text-[10.5px] text-champagne-dim/80">{goldRate.footnote}</p>
    </GlassCard>
  );
}
