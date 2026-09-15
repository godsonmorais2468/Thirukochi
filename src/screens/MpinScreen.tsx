import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Lock, ShieldCheck } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import LuxePanel from "../components/LuxePanel";
import MpinKeypad from "../components/MpinKeypad";
import ScreenTransition from "../components/ScreenTransition";
import { MPIN_LENGTH } from "../data/mock";
import { ease, rise, spring, stagger } from "../lib/motion";

interface MpinScreenProps {
  onComplete: () => void;
}

type Step = "set" | "confirm" | "done";

export default function MpinScreen({ onComplete }: MpinScreenProps) {
  const [step, setStep] = useState<Step>("set");
  const [first, setFirst] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const stepRef = useRef<Step>("set");
  const firstRef = useRef("");
  const timeouts = useRef<number[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    firstRef.current = first;
  }, [first]);

  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  const schedule = (fn: () => void, delay: number) => {
    timeouts.current.push(window.setTimeout(fn, delay));
  };

  const handleDigit = useCallback((digit: string) => {
    setError(false);
    setPin((current) => {
      if (stepRef.current === "done" || current.length >= MPIN_LENGTH) return current;
      const next = current + digit;

      if (next.length === MPIN_LENGTH) {
        if (stepRef.current === "set") {
          schedule(() => {
            setFirst(next);
            firstRef.current = next;
            setPin("");
            setStep("confirm");
          }, 340);
        } else {
          schedule(() => {
            if (next === firstRef.current) {
              setStep("done");
              schedule(onComplete, 1000);
            } else {
              setError(true);
              schedule(() => {
                setPin("");
                setFirst("");
                firstRef.current = "";
                setStep("set");
                setError(false);
              }, 1000);
            }
          }, 240);
        }
      }

      return next;
    });
  }, [onComplete]);

  const handleBackspace = useCallback(() => {
    setError(false);
    setPin((current) => (stepRef.current === "done" ? current : current.slice(0, -1)));
  }, []);

  const copy = {
    set: { eyebrow: "Security", title: "Set your MPIN", body: "Four digits. Used each time you open the vault." },
    confirm: { eyebrow: "Security", title: "Confirm your MPIN", body: "Enter the same four digits once more." },
    done: { eyebrow: "Secured", title: "Vault sealed", body: "Your portfolio is ready." },
  }[step];

  return (
    <ScreenTransition className="overflow-hidden px-7 pb-[clamp(12px,2.2vh,32px)] lg:overflow-y-auto lg:px-16">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="mx-auto flex h-full w-full flex-col justify-center gap-[clamp(8px,1.6vh,18px)] pt-[max(0.75rem,env(safe-area-inset-top))] lg:justify-start lg:gap-0 lg:pt-0 lg:grid lg:max-w-[1180px] lg:grid-cols-[1.1fr_minmax(360px,400px)] lg:items-center lg:gap-24 lg:py-16 lg:pt-0"
      >
        <motion.div
          variants={rise}
          className="flex justify-center lg:h-full lg:flex-col lg:justify-center"
        >
          <BrandLogo variant="lockup" width={140} sizeClass="w-[clamp(104px,28vw,140px)] lg:w-[230px]" shared />
          <p className="mt-10 hidden max-w-[34ch] font-display text-[40px] leading-tight text-champagne lg:block">
            Your vault, sealed with <span className="text-metal-shimmer">four digits</span>.
          </p>
        </motion.div>

        <LuxePanel className="flex flex-col justify-center lg:mt-0 lg:flex-none">
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.34, ease: ease.luxe }}
              className="flex flex-col items-center text-center"
            >
              <p className="text-[10px] tracking-luxe uppercase text-bronze">{copy.eyebrow}</p>
              <h1 className="mt-2 font-display text-[clamp(22px,6vw,30px)] leading-tight text-champagne">{copy.title}</h1>
              <p className="mt-2 max-w-[30ch] text-[clamp(11px,3vw,12px)] text-champagne-dim">{copy.body}</p>
            </motion.div>
          </AnimatePresence>

          {/* Vault plate */}
          <motion.div
            variants={rise}
            animate={error && !reduced ? { x: [0, -9, 9, -6, 6, 0] } : { x: 0 }}
            transition={error ? { duration: 0.45 } : spring.soft}
            className="glass mt-[clamp(12px,2.6vh,36px)] flex items-center gap-5 rounded-[22px] px-7 py-[clamp(12px,1.8vh,20px)]"
          >
            <span aria-hidden className={step === "done" ? "text-gold-300" : "text-bronze"}>
              {step === "done" ? <ShieldCheck size={16} strokeWidth={1.5} /> : <Lock size={15} strokeWidth={1.5} />}
            </span>

            <div className="flex items-center gap-3.5" role="status" aria-label={`${pin.length} of ${MPIN_LENGTH} digits entered`}>
              {Array.from({ length: MPIN_LENGTH }).map((_, index) => {
                const filled = index < pin.length || step === "done";
                return (
                  <motion.span
                    key={index}
                    className="h-2.5 w-2.5 rounded-full"
                    initial={false}
                    animate={{
                      scale: filled && !reduced ? [0.55, 1.18, 1] : 1,
                      backgroundColor: error
                        ? "rgba(251,113,133,0.9)"
                        : filled
                          ? "#F9DF32"
                          : "rgba(240,227,202,0.16)",
                      boxShadow: filled && !error ? "0 0 14px rgba(249,223,50,0.55)" : "none",
                    }}
                    transition={{ duration: 0.3, ease: ease.luxe }}
                  />
                );
              })}
            </div>
          </motion.div>

          <div className="mt-2.5 min-h-[16px]">
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="mismatch"
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11.5px] text-rose-300/85"
                >
                  Those didn&apos;t match. Starting again.
                </motion.p>
              )}
              {step === "done" && (
                <motion.p
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 text-[11.5px] text-gold-200"
                >
                  <Check size={13} strokeWidth={2} />
                  MPIN confirmed
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.div variants={rise} className="w-full pt-[clamp(12px,2.6vh,48px)]">
            <MpinKeypad onDigit={handleDigit} onBackspace={handleBackspace} disabled={step === "done"} />
          </motion.div>
        </div>
        </LuxePanel>
      </motion.div>
    </ScreenTransition>
  );
}
