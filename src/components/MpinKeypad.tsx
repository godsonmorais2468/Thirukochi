import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Delete } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { spring } from "../lib/motion";

interface MpinKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"] as const;

/** Tactile numeric keypad. Physical keyboard digits work too. */
export default function MpinKeypad({ onDigit, onBackspace, disabled = false }: MpinKeypadProps) {
  const [ripple, setRipple] = useState<{ id: number; key: string } | null>(null);
  const rippleId = useRef(0);
  const reduced = useReducedMotion();

  const flash = useCallback((key: string) => {
    rippleId.current += 1;
    setRipple({ id: rippleId.current, key });
  }, []);

  useEffect(() => {
    if (disabled) return;
    const handler = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) {
        onDigit(event.key);
        flash(event.key);
      } else if (event.key === "Backspace") {
        onBackspace();
        flash("back");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDigit, onBackspace, disabled, flash]);

  const press = (key: string) => {
    if (disabled) return;
    flash(key);
    if (key === "back") onBackspace();
    else if (key !== "clear") onDigit(key);
    else for (let i = 0; i < 4; i += 1) onBackspace();
  };

  return (
    <div className="grid grid-cols-3 gap-[clamp(7px,1.4vh,14px)]" role="group" aria-label="PIN keypad">
      {keys.map((key) => {
        const isAction = key === "back" || key === "clear";
        return (
          <motion.button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => press(key)}
            whileTap={reduced || disabled ? undefined : { scale: 0.94 }}
            transition={spring.press}
            aria-label={key === "back" ? "Delete" : key === "clear" ? "Clear" : key}
            className="relative isolate flex h-[clamp(44px,6.2vh,62px)] items-center justify-center overflow-hidden rounded-[18px] disabled:opacity-40"
            style={{
              border: "1px solid rgba(215,175,92,0.16)",
              background: isAction
                ? "linear-gradient(160deg, rgba(40,6,6,0.42), rgba(18,1,1,0.5))"
                : "linear-gradient(160deg, rgba(96,22,22,0.42), rgba(28,3,3,0.55))",
              boxShadow: "inset 0 1px 0 rgba(251,241,201,0.12), 0 14px 30px -22px rgba(0,0,0,0.95)",
            }}
          >
            <AnimatePresence>
              {ripple?.key === key && !reduced && (
                <motion.span
                  key={ripple.id}
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(249,223,50,0.42) 0%, rgba(249,223,50,0) 68%)",
                  }}
                  initial={{ opacity: 0.95, scale: 0.35 }}
                  animate={{ opacity: 0, scale: 1.7 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  onAnimationComplete={() => setRipple(null)}
                />
              )}
            </AnimatePresence>

            <span
              className={`relative z-10 ${
                isAction ? "text-champagne-dim" : "font-display text-[clamp(20px,5.4vw,25px)] text-champagne"
              }`}
            >
              {key === "back" ? (
                <Delete size={19} strokeWidth={1.5} />
              ) : key === "clear" ? (
                <span className="text-[10px] tracking-luxe-sm uppercase">Clear</span>
              ) : (
                key
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
