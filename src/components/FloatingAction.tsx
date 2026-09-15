import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { spring } from "../lib/motion";

interface FloatingActionProps {
  onClick: () => void;
  label: string;
}

/** Quick-add button floating above the dock. */
export default function FloatingAction({ onClick, label }: FloatingActionProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={reduced ? undefined : { scale: 0.93 }}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      transition={spring.press}
      className="metal-gold absolute right-5 bottom-[calc(env(safe-area-inset-bottom)+92px)] z-40 flex h-14 w-14 items-center justify-center rounded-full text-wine-950 lg:right-10 lg:bottom-10"
      style={{
        boxShadow: "0 18px 40px -16px rgba(249,223,50,0.55), 0 10px 26px -12px rgba(0,0,0,0.9)",
      }}
    >
      {/* Halo pulsing outward */}
      {!reduced && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 0 0 rgba(249,223,50,0.5)" }}
          animate={{ boxShadow: ["0 0 0 0 rgba(249,223,50,0.45)", "0 0 0 14px rgba(249,223,50,0)"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <Plus size={22} strokeWidth={2} className="relative" />
    </motion.button>
  );
}
