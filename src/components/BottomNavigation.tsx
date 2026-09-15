import { motion, useReducedMotion } from "framer-motion";
import { Home, Wallet, Receipt, User, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { spring } from "../lib/motion";

export type NavKey = "home" | "wallet" | "join" | "payments" | "profile";

interface NavItem {
  key: NavKey;
  label: string;
  icon: LucideIcon;
}

/** `join` sits in the middle on the dock and is raised out of the bar. */
const items: NavItem[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "join", label: "Join Scheme", icon: Plus },
  { key: "payments", label: "Payments", icon: Receipt },
  { key: "profile", label: "Profile", icon: User },
];

interface BottomNavigationProps {
  active: NavKey;
  onChange: (key: NavKey) => void;
  /** `bar` is the phone dock, `rail` is the desktop sidebar column. */
  orientation?: "bar" | "rail";
  /** Both instances can be mounted at once, so shared ids must not collide. */
  idPrefix?: string;
  className?: string;
}

export default function BottomNavigation({
  active,
  onChange,
  orientation = "bar",
  idPrefix = "nav",
  className = "",
}: BottomNavigationProps) {
  const rail = orientation === "rail";
  const reduced = useReducedMotion();

  return (
    <nav
      aria-label="Primary"
      className={
        rail
          ? `flex flex-col gap-1.5 ${className}`
          : `glass absolute inset-x-0 bottom-0 z-30 flex items-end rounded-t-[26px] px-2 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+12px)] ${className}`
      }
    >
      {items.map(({ key, label, icon: Icon }) => {
        const isActive = key === active;
        const isJoin = key === "join";

        // Raised gold action in the middle of the phone dock.
        if (isJoin && !rail) {
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center"
            >
              <motion.span
                aria-hidden
                whileTap={reduced ? undefined : { scale: 0.92 }}
                transition={spring.press}
                className="metal-gold -mt-8 flex h-14 w-14 items-center justify-center rounded-full text-wine-950"
                style={{
                  boxShadow: isActive
                    ? "0 18px 38px -14px rgba(249,223,50,0.75), inset 0 1px 0 rgba(255,255,255,0.55)"
                    : "0 14px 32px -16px rgba(249,223,50,0.55), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                <Plus size={24} strokeWidth={2} />
              </motion.span>
              <span
                className={`mt-1.5 text-[9.5px] tracking-luxe-sm uppercase transition-colors duration-500 ${
                  isActive ? "text-gold-200" : "text-champagne-dim"
                }`}
              >
                {label}
              </span>
            </button>
          );
        }

        // Highlighted rail entry on desktop.
        if (isJoin && rail) {
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-current={isActive ? "page" : undefined}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={spring.press}
              className="metal-gold mb-3 flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-wine-950"
              style={{
                boxShadow: isActive
                  ? "0 18px 40px -18px rgba(249,223,50,0.8), inset 0 1px 0 rgba(255,255,255,0.55)"
                  : "0 12px 30px -18px rgba(249,223,50,0.6), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <Plus size={17} strokeWidth={2.2} />
              <span className="text-[11px] font-medium tracking-luxe-sm uppercase">{label}</span>
            </motion.button>
          );
        }

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-current={isActive ? "page" : undefined}
            className={
              rail
                ? "relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-left"
                : "relative flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-2"
            }
          >
            {isActive && (
              <motion.span
                layoutId={`${idPrefix}-indicator`}
                aria-hidden
                className={rail ? "absolute inset-0 rounded-2xl" : "absolute inset-x-2 inset-y-0 rounded-2xl"}
                style={{
                  background: rail
                    ? "linear-gradient(120deg, rgba(145,100,15,0.26) 0%, rgba(40,6,6,0.2) 100%)"
                    : "radial-gradient(70% 60% at 50% 34%, rgba(249,223,50,0.18) 0%, rgba(249,223,50,0) 72%)",
                  boxShadow: "inset 0 1px 0 rgba(251,241,201,0.12)",
                }}
                transition={spring.soft}
              />
            )}

            <Icon
              size={rail ? 17 : 19}
              strokeWidth={1.4}
              className={`relative z-10 transition-colors duration-500 ${
                isActive ? "text-gold-300" : "text-champagne-dim"
              }`}
            />
            <span
              className={`relative z-10 tracking-luxe-sm uppercase transition-colors duration-500 ${
                rail ? "text-[11px]" : "text-[9.5px]"
              } ${isActive ? "text-gold-200" : "text-champagne-dim/70"}`}
            >
              {label}
            </span>

            {isActive && (
              <motion.span
                layoutId={`${idPrefix}-underline`}
                aria-hidden
                className={
                  rail
                    ? "metal-gold-soft absolute left-0 top-1/2 h-7 w-px -translate-y-1/2 rounded-full"
                    : "metal-gold-soft absolute -bottom-0.5 h-px w-7 rounded-full"
                }
                transition={spring.soft}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
