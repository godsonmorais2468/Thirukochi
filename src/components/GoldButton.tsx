import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { spring } from "../lib/motion";

interface GoldButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "solid" | "quiet";
  icon?: ReactNode;
  layoutId?: string;
  className?: string;
  "aria-label"?: string;
}

/**
 * Primary metallic action. Press response is a 0.98 compression with a
 * highlight sweep and a collapsing shadow.
 */
export default function GoldButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "solid",
  icon,
  layoutId,
  className = "",
  ...rest
}: GoldButtonProps) {
  const reduced = useReducedMotion();
  const solid = variant === "solid";

  return (
    <motion.button
      {...rest}
      type={type}
      onClick={onClick}
      disabled={disabled}
      layoutId={layoutId}
      transition={spring.screen}
      initial={false}
      whileTap={disabled || reduced ? undefined : { scale: 0.98 }}
      whileHover={disabled || reduced ? undefined : { scale: 1.006 }}
      className={`group relative isolate w-full overflow-hidden rounded-2xl px-7 py-[18px] text-[13px] font-medium tracking-luxe-sm uppercase disabled:cursor-not-allowed ${
        solid
          ? "metal-gold text-wine-950 disabled:opacity-35 disabled:saturate-[0.4]"
          : "glass text-champagne disabled:opacity-40"
      } ${className}`}
      style={
        solid
          ? {
              boxShadow: disabled
                ? "none"
                : "0 20px 44px -22px rgba(249,223,50,0.5), 0 12px 30px -18px rgba(0,0,0,0.9)",
            }
          : undefined
      }
    >
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2.5"
        whileTap={disabled || reduced ? undefined : { scale: 0.995 }}
        transition={spring.press}
      >
        {children}
        {icon}
      </motion.span>

      {/* Highlight sweep on press and hover */}
      {!reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-0 w-1/4 skew-x-[-18deg]"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
            filter: "blur(6px)",
          }}
          initial={{ x: "-180%", opacity: 0 }}
          whileHover={disabled ? undefined : { x: "460%", opacity: 0.8 }}
          whileTap={disabled ? undefined : { x: "460%", opacity: 0.95 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      {/* Idle polish: a slow glint crossing the metal on its own */}
      {!reduced && !disabled && solid && (
        <span
          aria-hidden
          className="gloss-sweep pointer-events-none absolute inset-y-0 z-0 w-1/5 will-change-transform"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
            filter: "blur(7px)",
            animationDuration: "6s",
          }}
        />
      )}

      {/* Struck-metal edge */}
      {solid && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.62), inset 0 -8px 16px rgba(94,60,4,0.32), inset 0 0 0 1px rgba(110,74,12,0.45)",
          }}
        />
      )}
    </motion.button>
  );
}
