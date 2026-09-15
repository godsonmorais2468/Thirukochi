import { motion, useReducedMotion } from "framer-motion";
import { Bell } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { spring } from "../lib/motion";

interface TopBarProps {
  initial: string;
  showLogo: boolean;
  onNotifications: () => void;
  onProfile: () => void;
}

/** Brand mark on the left, alerts and account on the right. */
export default function TopBar({ initial, showLogo, onNotifications, onProfile }: TopBarProps) {
  const reduced = useReducedMotion();

  return (
    <header
      className="flex items-center justify-between px-6 pt-[max(1.35rem,calc(env(safe-area-inset-top)+1rem))] pb-3 lg:px-12 lg:pt-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(14,0,0,0.72) 0%, rgba(14,0,0,0.42) 62%, rgba(14,0,0,0) 100%)",
      }}
    >
      <div className="lg:opacity-0">{showLogo && <BrandLogo variant="lockup" width={132} shared />}</div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onNotifications}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(215,175,92,0.3)] text-champagne-soft transition-colors hover:text-gold-200"
        >
          <Bell size={16} strokeWidth={1.5} />
          <motion.span
            aria-hidden
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold-300"
            style={{ boxShadow: "0 0 8px 2px rgba(249,223,50,0.7)" }}
            animate={reduced ? undefined : { opacity: [1, 0.35, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </button>

        <motion.button
          type="button"
          onClick={onProfile}
          aria-label="Account"
          whileTap={reduced ? undefined : { scale: 0.95 }}
          transition={spring.press}
          className="metal-gold flex h-10 w-10 items-center justify-center rounded-full font-display text-[17px] text-wine-950"
          style={{ boxShadow: "0 0 22px -6px rgba(249,223,50,0.6), inset 0 1px 0 rgba(255,255,255,0.5)" }}
        >
          {initial}
        </motion.button>
      </div>
    </header>
  );
}
