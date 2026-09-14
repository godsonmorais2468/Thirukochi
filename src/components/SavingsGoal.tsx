import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "./GlassCard";
import { useCountUp } from "../hooks/useCountUp";
import { formatRupees } from "../lib/format";
import { savings } from "../data/mock";
import { ease } from "../lib/motion";

const percent = (savings.saved / savings.target) * 100;

/** Goal progress on a metallic rail. The bar animates with transform only. */
export default function SavingsGoal() {
  const reduced = useReducedMotion();
  const counted = useCountUp(percent, { duration: 1.9, delay: 0.7 });

  return (
    <GlassCard className="px-6 py-6" beamDelay={3.4}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-luxe uppercase text-bronze">Savings goal</p>
          <p className="mt-1.5 font-display text-[20px] text-champagne">{savings.goalLabel}</p>
        </div>
        <p className="pt-1 font-display text-[18px] text-champagne-soft">
          {formatRupees(savings.target)}
        </p>
      </div>

      <div
        className="relative mt-5 h-[7px] w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${savings.goalLabel} progress`}
        style={{
          background: "linear-gradient(180deg, rgba(12,0,0,0.7), rgba(50,10,10,0.45))",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)",
        }}
      >
        <motion.span
          className="metal-gold absolute inset-y-0 left-0 w-full origin-left overflow-hidden rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: percent / 100 }}
          transition={reduced ? { duration: 0 } : { duration: 1.9, delay: 0.7, ease: ease.luxe }}
          style={{ boxShadow: "0 0 18px -4px rgba(249,223,50,0.6)" }}
        >
          {!reduced && (
            <span
              aria-hidden
              className="rail-sweep absolute inset-y-0 w-1/4 will-change-transform"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)",
                animationDelay: "2.4s",
                animationDuration: "6s",
              }}
            />
          )}
        </motion.span>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-[11px]">
        <span className="text-champagne-soft">
          {formatRupees(savings.saved)} saved · {counted.toFixed(0)}%
        </span>
        <span className="text-champagne-dim">
          {formatRupees(savings.monthly)}/month · {savings.maturity}
        </span>
      </div>
    </GlassCard>
  );
}
