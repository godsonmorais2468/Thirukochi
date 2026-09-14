import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { ease, spring } from "../lib/motion";

interface PremiumBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}

/** Frosted sheet with drag-to-dismiss and an escape-key exit. */
export default function PremiumBottomSheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
}: PremiumBottomSheetProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-wine-950/72 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: ease.luxe }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="glass absolute inset-x-0 bottom-0 z-50 max-h-[78%] overflow-hidden rounded-t-[2rem] pb-[calc(env(safe-area-inset-bottom)+22px)] lg:inset-x-auto lg:bottom-8 lg:left-[calc(50%-280px)] lg:w-[560px] lg:rounded-[2rem] lg:pb-7"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={reduced ? { duration: 0.2 } : spring.sheet}
            drag={reduced ? false : "y"}
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 520) onClose();
            }}
          >
            <div className="flex cursor-grab justify-center pt-3 pb-1 active:cursor-grabbing">
              <span className="h-1 w-11 rounded-full bg-[rgba(215,175,92,0.4)]" />
            </div>

            <div className="px-7 pt-3 pb-2">
              {eyebrow && (
                <p className="text-[10px] tracking-luxe uppercase text-bronze">{eyebrow}</p>
              )}
              <h2 className="mt-1.5 font-display text-[26px] leading-tight text-champagne">{title}</h2>
            </div>

            <div className="no-scrollbar max-h-[52vh] overflow-y-auto px-7 pb-4 pt-2">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
