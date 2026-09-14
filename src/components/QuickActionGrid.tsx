import { motion, useReducedMotion } from "framer-motion";
import { Coins, CalendarClock, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { rise, spring } from "../lib/motion";

export interface QuickAction {
  key: string;
  label: string;
  icon: LucideIcon;
}

const actions: QuickAction[] = [
  { key: "save", label: "Save Gold", icon: Coins },
  { key: "pay", label: "Pay Scheme", icon: CalendarClock },
  { key: "rewards", label: "Rewards", icon: Gift },
];

interface QuickActionGridProps {
  onAction: (action: QuickAction) => void;
}

export default function QuickActionGrid({ onAction }: QuickActionGridProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div variants={rise} className="grid grid-cols-3 gap-3">
      {actions.map(({ key, label, icon: Icon }) => (
        <motion.button
          key={key}
          type="button"
          onClick={() => onAction({ key, label, icon: Icon })}
          whileHover={reduced ? undefined : { y: -3 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          transition={spring.soft}
          className="glass flex flex-col items-center gap-2.5 rounded-[20px] px-2 py-5"
        >
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(158deg, rgba(145,100,15,0.5), rgba(30,4,4,0.5))",
              border: "1px solid rgba(215,175,92,0.3)",
              boxShadow: "inset 0 1px 0 rgba(251,241,201,0.22)",
            }}
          >
            <Icon size={16} strokeWidth={1.4} className="text-gold-200" />
          </span>
          <span className="text-center text-[10px] tracking-luxe-sm uppercase text-champagne-soft">
            {label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}
