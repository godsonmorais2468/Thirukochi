import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { rise, spring } from "../lib/motion";

interface GlassCardProps {
  children: ReactNode;
  /** Makes the card a button and enables the lift interaction. */
  onClick?: () => void;
  layoutId?: string;
  className?: string;
  padded?: boolean;
  label?: string;
  /** Offsets the running edge light so neighbouring cards stay out of sync. */
  beamDelay?: number;
}

/** Frosted maroon surface with a metallic hairline and a long diffused shadow. */
export default function GlassCard({
  children,
  onClick,
  layoutId,
  className = "",
  padded = true,
  label,
  beamDelay = 0,
}: GlassCardProps) {
  const reduced = useReducedMotion();
  const interactive = Boolean(onClick);

  return (
    <motion.div
      variants={rise}
      layoutId={layoutId}
      transition={spring.soft}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={label}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      whileHover={interactive && !reduced ? { y: -3 } : undefined}
      whileTap={interactive && !reduced ? { scale: 0.988 } : undefined}
      className={`glass relative isolate overflow-hidden rounded-[var(--radius-card)] transition-shadow duration-500 ${
        interactive ? "cursor-pointer hover:glass-raised" : ""
      } ${padded ? "p-6" : ""} ${className}`}
    >
      {/* Reflection along the top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(249,223,50,0) 0%, rgba(251,241,201,0.55) 50%, rgba(249,223,50,0) 100%)",
        }}
      />

      {!reduced && (
        <>
          {/* Light running along the top rail */}
          <span
            aria-hidden
            className="rail-sweep pointer-events-none absolute top-0 h-px w-1/3 will-change-transform"
            style={{
              background:
                "linear-gradient(90deg, rgba(249,223,50,0) 0%, rgba(255,250,225,0.95) 50%, rgba(249,223,50,0) 100%)",
              animationDelay: `${beamDelay}s`,
            }}
          />

          {/* Slow gloss crossing the surface */}
          <span
            aria-hidden
            className="gloss-sweep pointer-events-none absolute inset-y-0 w-[30%] will-change-transform"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,244,214,0.09) 50%, rgba(255,255,255,0) 100%)",
              animationDelay: `${beamDelay + 1.2}s`,
              animationDuration: "11s",
            }}
          />
        </>
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
