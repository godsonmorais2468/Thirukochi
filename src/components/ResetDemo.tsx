import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface ResetDemoProps {
  onReset: () => void;
}

/** Development affordance for restarting the walkthrough. */
export default function ResetDemo({ onReset }: ResetDemoProps) {
  if (!import.meta.env.DEV) return null;

  return (
    <motion.button
      type="button"
      onClick={onReset}
      whileTap={{ scale: 0.96 }}
      title="Reset demo"
      aria-label="Reset demo"
      className="absolute right-2.5 z-[70] flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(215,175,92,0.18)] bg-wine-950/55 text-champagne-dim/70 backdrop-blur-md transition-colors hover:text-gold-200"
      style={{ top: "calc(env(safe-area-inset-top) + 6px)" }}
    >
      <RotateCcw size={11} strokeWidth={1.8} />
    </motion.button>
  );
}
