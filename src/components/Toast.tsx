import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { spring } from "../lib/motion";
import type { ToastMessage } from "../types";

interface ToastStackProps {
  toasts: ToastMessage[];
}

/** Contextual confirmations, stacked above the navigation. */
export default function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-[104px] z-[60] flex flex-col items-center gap-2 px-6 lg:inset-x-auto lg:right-8 lg:bottom-8 lg:w-[340px] lg:px-0"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={spring.soft}
            className="glass flex w-full items-center gap-3 rounded-2xl px-4 py-3"
          >
            <span
              className="metal-gold-soft flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              aria-hidden
            >
              <Check size={13} strokeWidth={2.4} className="text-wine-950" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] text-champagne">{toast.title}</span>
              {toast.detail && (
                <span className="block truncate text-[11px] text-champagne-dim">{toast.detail}</span>
              )}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
