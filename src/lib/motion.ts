import type { Transition, Variants } from "framer-motion";

/** Weighted, low-bounce springs. Everything in the app pulls from these. */
export const spring = {
  /** Screen and shared-element movement. */
  screen: { type: "spring", stiffness: 120, damping: 26, mass: 1.05 } as Transition,
  /** Cards, reveals, sheets. */
  soft: { type: "spring", stiffness: 160, damping: 28, mass: 0.9 } as Transition,
  /** Press feedback, keypad. */
  press: { type: "spring", stiffness: 520, damping: 34, mass: 0.6 } as Transition,
  /** Sheet travel. */
  sheet: { type: "spring", stiffness: 220, damping: 32, mass: 0.9 } as Transition,
};

export const ease = {
  luxe: [0.16, 1, 0.3, 1] as [number, number, number, number],
  exit: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

/** Screen enter: layered fade + small rise + light sharpening. */
export const screenVariants: Variants = {
  initial: { opacity: 0, y: 22, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...spring.screen, filter: { duration: 0.7, ease: ease.luxe } },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: "blur(8px)",
    transition: { duration: 0.42, ease: ease.exit },
  },
};

export const stagger: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

/** Staggered child reveal. Transform + opacity only. */
export const rise: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: spring.soft },
};

export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: ease.luxe } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: ease.exit } },
};

/** Shared-element ids used across screens. */
export const layout = {
  logo: "brand-logo",
  primaryAction: "primary-action",
} as const;
