import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface LuxePanelProps {
  children: ReactNode;
  className?: string;
}

const cornerPositions = [
  { top: "-6px", left: "-6px" },
  { top: "-6px", right: "-6px" },
  { bottom: "-6px", left: "-6px" },
  { bottom: "-6px", right: "-6px" },
];

function Sparkle({ delay }: { delay: number }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="absolute"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 3.4, delay, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
    >
      <path
        d="M12 0 L13.6 10.4 L24 12 L13.6 13.6 L12 24 L10.4 13.6 L0 12 L10.4 10.4 Z"
        fill="#FBF1C9"
      />
    </motion.svg>
  );
}

/**
 * The ornate presentation frame: a gold-edged glass plate with a rotating
 * border beam, a travelling sheen and twinkling corner stars. Everything
 * animates transform/opacity only, so the loops stay cheap.
 */
export default function LuxePanel({ children, className = "" }: LuxePanelProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {/* Outer gold rail, with the beam sweeping around inside it */}
      <div
        className="relative overflow-hidden rounded-[30px] p-[1.5px]"
        style={{
          background:
            "linear-gradient(140deg, rgba(249,223,50,0.5) 0%, rgba(145,100,15,0.14) 32%, rgba(249,223,50,0.34) 58%, rgba(110,74,12,0.16) 100%)",
        }}
      >
        {!reduced && (
          <div
            aria-hidden
            className="beam-spin absolute left-1/2 top-1/2 h-[240%] w-[240%] will-change-transform"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(249,223,50,0) 0deg, rgba(249,223,50,0) 260deg, rgba(251,241,201,0.85) 330deg, rgba(249,223,50,0) 360deg)",
            }}
          />
        )}

        {/* Glass plate */}
        <div
          className="relative overflow-hidden rounded-[28px] p-2"
          style={{
            background:
              "linear-gradient(152deg, rgba(64,10,10,0.94) 0%, rgba(30,3,3,0.96) 48%, rgba(14,0,0,0.97) 100%)",
            backdropFilter: "blur(30px) saturate(115%)",
            WebkitBackdropFilter: "blur(30px) saturate(115%)",
            boxShadow:
              "inset 0 1px 0 rgba(251,241,201,0.24), 0 40px 90px -40px rgba(0,0,0,0.95)",
          }}
        >
          {/* Gold aurora breathing behind the content */}
          {!reduced && (
            <>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full will-change-transform"
                style={{
                  background:
                    "radial-gradient(circle, rgba(249,223,50,0.16) 0%, rgba(249,223,50,0) 70%)",
                  filter: "blur(26px)",
                }}
                animate={{ x: [0, 26, 0], y: [0, 18, 0], opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -right-12 h-60 w-60 rounded-full will-change-transform"
                style={{
                  background:
                    "radial-gradient(circle, rgba(179,135,28,0.2) 0%, rgba(179,135,28,0) 70%)",
                  filter: "blur(30px)",
                }}
                animate={{ x: [0, -22, 0], y: [0, -16, 0], opacity: [0.45, 0.9, 0.45] }}
                transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              />
            </>
          )}

          {/* Travelling gloss across the whole plate */}
          {!reduced && (
            <span
              aria-hidden
              className="gloss-sweep pointer-events-none absolute inset-y-0 z-20 w-[36%] will-change-transform"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,240,200,0.16) 45%, rgba(255,255,255,0.26) 52%, rgba(255,240,200,0.12) 60%, rgba(255,255,255,0) 100%)",
                filter: "blur(2px)",
                animationDuration: "10s",
              }}
            />
          )}

          {/* Inner hairline frame */}
          <div
            className="relative rounded-[22px] px-6 py-7 lg:px-8 lg:py-9"
            style={{
              border: "1px solid rgba(215,175,92,0.28)",
              boxShadow:
                "inset 0 1px 0 rgba(251,241,201,0.14), inset 0 0 40px rgba(249,223,50,0.04)",
            }}
          >
            {/* Soft top-edge glow, breathing */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-x-10 -top-px h-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(249,223,50,0) 0%, rgba(251,241,201,0.85) 50%, rgba(249,223,50,0) 100%)",
              }}
              animate={reduced ? undefined : { opacity: [0.25, 0.9, 0.25] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            {children}
          </div>
        </div>
      </div>

      {/* Corner stars */}
      {!reduced &&
        cornerPositions.map((position, i) => (
          <span key={i} className="pointer-events-none absolute" style={position}>
            <Sparkle delay={i * 1.1} />
          </span>
        ))}
    </div>
  );
}
