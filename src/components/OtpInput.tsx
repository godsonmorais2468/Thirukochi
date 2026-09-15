import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { spring } from "../lib/motion";

type Status = "idle" | "error" | "verified";

interface OtpInputProps {
  length: number;
  status: Status;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
  disabled?: boolean;
}

/** Six cells with focus progression, paste support and a completion pulse. */
export default function OtpInput({ length, status, onChange, onComplete, disabled }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const reduced = useReducedMotion();

  const commit = (next: string[]) => {
    setDigits(next);
    const value = next.join("");
    onChange(value);
    if (value.length === length && !next.includes("")) onComplete(value);
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    commit(next);
    if (digit && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      commit(next);
      inputs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    const next = Array<string>(length).fill("");
    pasted.split("").forEach((digit, i) => {
      next[i] = digit;
    });
    commit(next);
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div
      className="flex justify-between gap-[clamp(5px,1.6vw,8px)]"
      role="group"
      aria-label={`${length} digit verification code`}
    >
      {digits.map((digit, index) => {
        const active = focusedIndex === index;
        const verified = status === "verified";
        const errored = status === "error";

        return (
          <motion.div
            key={index}
            className="relative flex-1"
            animate={
              reduced
                ? undefined
                : verified
                  ? { scale: [1, 1.05, 1] }
                  : digit
                    ? { scale: [1, 1.06, 1] }
                    : { scale: 1 }
            }
            transition={
              verified
                ? { duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }
                : spring.press
            }
          >
            {/* Cell shell: same glass, border and glow language as the fields */}
            <motion.div
              className="relative isolate overflow-hidden rounded-2xl"
              animate={{
                borderColor: errored
                  ? "rgba(251,113,133,0.6)"
                  : verified
                    ? "rgba(249,223,50,0.7)"
                    : active
                      ? "rgba(249,223,50,0.62)"
                      : digit
                        ? "rgba(215,175,92,0.44)"
                        : "rgba(215,175,92,0.34)",
                boxShadow: active
                  ? "inset 0 1px 0 rgba(251,241,201,0.24), 0 0 30px -8px rgba(249,223,50,0.6)"
                  : verified
                    ? "inset 0 1px 0 rgba(251,241,201,0.24), 0 0 26px -10px rgba(249,223,50,0.5)"
                    : "inset 0 1px 0 rgba(251,241,201,0.12), 0 0 0 rgba(249,223,50,0)",
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                background:
                  "linear-gradient(158deg, rgba(52,8,8,0.86) 0%, rgba(18,1,1,0.92) 100%)",
              }}
            >
              {/* Idle gloss, staggered so the row shimmers in sequence */}
              {!reduced && (
                <span
                  aria-hidden
                  className="gloss-sweep pointer-events-none absolute inset-y-0 z-10 w-2/3"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,244,214,0.16) 50%, rgba(255,255,255,0) 100%)",
                    animationDelay: `${index * 0.22}s`,
                  }}
                />
              )}

              <input
                ref={(element) => {
                  inputs.current[index] = element;
                }}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                disabled={disabled}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                aria-label={`Digit ${index + 1}`}
                className="relative z-20 h-[clamp(46px,6.6vh,58px)] w-full bg-transparent text-center font-display text-[clamp(18px,5vw,22px)] text-champagne caret-gold-300"
              />
            </motion.div>

            {/* Completion glow */}
            {verified && !reduced && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{ background: "radial-gradient(circle, rgba(249,223,50,0.34) 0%, rgba(249,223,50,0) 70%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.1, delay: index * 0.05, ease: "easeOut" }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
