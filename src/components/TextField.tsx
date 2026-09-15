import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ease, spring } from "../lib/motion";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  inputMode?: "text" | "tel" | "numeric";
  autoComplete?: string;
  maxLength?: number;
  /** Offsets the idle gloss so stacked fields shimmer in sequence. */
  glossDelay?: number;
}

/** Bevelled glass field: the label rides inside the box and lifts on entry. */
export default function TextField({
  label,
  value,
  onChange,
  icon,
  error,
  hint,
  inputMode = "text",
  autoComplete,
  maxLength,
  glossDelay = 0,
}: TextFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      {/* The whole box is the label, so a tap anywhere inside focuses the field. */}
      <motion.label
        htmlFor={id}
        className="relative isolate flex cursor-text items-center gap-3 overflow-hidden rounded-2xl px-4"
        animate={{
          borderColor: error
            ? "rgba(251,113,133,0.6)"
            : focused
              ? "rgba(249,223,50,0.62)"
              : "rgba(215,175,92,0.34)",
          boxShadow: focused
            ? "inset 0 1px 0 rgba(251,241,201,0.24), 0 0 30px -8px rgba(249,223,50,0.6)"
            : "inset 0 1px 0 rgba(251,241,201,0.12), 0 0 0 rgba(249,223,50,0)",
        }}
        transition={{ duration: 0.45, ease: ease.luxe }}
        style={{
          height: "clamp(48px, 6.6vh, 58px)",
          borderWidth: 1,
          borderStyle: "solid",
          background:
            "linear-gradient(158deg, rgba(52,8,8,0.86) 0%, rgba(18,1,1,0.92) 100%)",
        }}
      >
        {/* Idle gloss drifting across the field, above the plate, under the text */}
        {!reduced && (
          <span
            aria-hidden
            className="gloss-sweep pointer-events-none absolute inset-y-0 z-10 w-2/3"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,244,214,0.16) 50%, rgba(255,255,255,0) 100%)",
              animationDelay: `${glossDelay}s`,
            }}
          />
        )}

        {icon && (
          <span
            aria-hidden
            className={`relative z-20 shrink-0 transition-colors duration-500 ${focused ? "text-gold-300" : "text-bronze"}`}
          >
            {icon}
          </span>
        )}

        {/* Label and value ride on separate tracks so they never collide. */}
        <div className="relative z-20 h-full flex-1">
          {/* Percentages keep label and value aligned as the box height flexes */}
          <motion.span
            aria-hidden
            initial={false}
            animate={{
              top: lifted ? "16%" : "50%",
              y: lifted ? "0%" : "-50%",
              scale: lifted ? 0.74 : 1,
              opacity: lifted ? 0.85 : 1,
            }}
            transition={spring.soft}
            className={`pointer-events-none absolute left-0 z-10 origin-left text-[12px] leading-none tracking-luxe-sm uppercase ${
              error ? "text-rose-300/85" : focused ? "text-gold-200" : "text-champagne-soft"
            }`}
          >
            {label}
          </motion.span>

          {/* Fills the box so every point inside is a hit target for the caret */}
          <input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            inputMode={inputMode}
            autoComplete={autoComplete}
            maxLength={maxLength}
            aria-label={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? `${id}-msg` : undefined}
            className="absolute inset-x-0 bottom-[10%] h-[46%] w-full bg-transparent p-0 font-display text-[clamp(15px,4vw,17px)] leading-none text-champagne caret-gold-300"
          />
        </div>
      </motion.label>

      <AnimatePresence mode="wait">
        {(error || hint) && (
          <motion.p
            key={error ?? hint}
            id={`${id}-msg`}
            role={error ? "alert" : undefined}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: ease.luxe }}
            className={`mt-2 pl-1 text-[11.5px] tracking-wide ${
              error ? "text-rose-300/90" : "text-champagne-soft/85"
            }`}
          >
            {error ?? hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
