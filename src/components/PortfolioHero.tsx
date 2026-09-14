import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import GlassCard from "./GlassCard";
import { useCountUp } from "../hooks/useCountUp";
import { formatGrams, formatRupees } from "../lib/format";
import { portfolio } from "../data/mock";

interface PortfolioHeroProps {
  onOpen: () => void;
}

/** Hero holding value, counted up on entry. */
export default function PortfolioHero({ onOpen }: PortfolioHeroProps) {
  const value = useCountUp(portfolio.value, { duration: 1.9, delay: 0.35 });
  const grams = useCountUp(portfolio.grams, { duration: 1.9, delay: 0.45 });

  return (
    <GlassCard onClick={onOpen} label="Open portfolio breakdown" className="px-6 py-7" beamDelay={0}>
      {/* Inner gold light, top-right */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(249,223,50,0.16) 0%, rgba(249,223,50,0) 68%)",
          filter: "blur(10px)",
        }}
      />

      <div className="flex items-start justify-between">
        <p className="text-[10px] tracking-luxe uppercase text-bronze">Total holding</p>
        <ArrowUpRight size={15} strokeWidth={1.4} className="text-champagne-dim" />
      </div>

      <p className="mt-4 font-display text-[44px] leading-none tracking-tight text-metal-gold">
        {formatRupees(value)}
      </p>

      <div className="mt-5 flex items-center gap-3 text-[11.5px]">
        <span className="rounded-full border border-[rgba(215,175,92,0.22)] px-2.5 py-1 text-champagne-soft">
          {formatGrams(grams)}
        </span>
        <motion.span
          className="flex items-center gap-1 text-emerald-300/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <TrendingUp size={12} strokeWidth={1.8} />
          {portfolio.changePercent}%
        </motion.span>
        <span className="text-champagne-dim">{portfolio.since}</span>
      </div>
    </GlassCard>
  );
}
