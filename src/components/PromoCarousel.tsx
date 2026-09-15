import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { promos } from "../data/mock";
import { useToast } from "../hooks/useToasts";
import { ease, rise, spring } from "../lib/motion";

const ROTATE_MS = 6000;

/** Editorial jewellery motif drawn in line-gold, no photography. */
function NecklaceMotif() {
  const reduced = useReducedMotion();
  return (
    <svg
      aria-hidden
      className="absolute right-0 top-1/2 h-[78%] max-h-[230px] w-[38%] -translate-y-1/2 lg:w-[42%]"
      viewBox="0 0 200 220"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="promo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#91640F" />
          <stop offset="50%" stopColor="#F9DF32" />
          <stop offset="100%" stopColor="#B3871C" />
        </linearGradient>
      </defs>
      <path d="M40 24 C 40 104, 160 104, 160 24" stroke="url(#promo-gold)" strokeWidth="1.6" opacity="0.85" />
      <path d="M52 26 C 52 92, 148 92, 148 26" stroke="url(#promo-gold)" strokeWidth="1" opacity="0.5" />
      {[62, 80, 100, 120, 138].map((x, i) => (
        <circle key={x} cx={x} cy={88 - Math.abs(100 - x) * 0.18} r={2.6 - i * 0.1} fill="url(#promo-gold)" opacity="0.9" />
      ))}
      <path d="M100 96 L 112 118 L 100 140 L 88 118 Z" fill="url(#promo-gold)" opacity="0.92" />
      <circle cx="150" cy="160" r="22" stroke="url(#promo-gold)" strokeWidth="1.4" opacity="0.7" />
      <motion.circle
        cx="72"
        cy="150"
        r="1.8"
        fill="#FBF1C9"
        animate={reduced ? undefined : { opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="168"
        cy="60"
        r="1.6"
        fill="#FBF1C9"
        animate={reduced ? undefined : { opacity: [0, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function PromoCarousel() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const toast = useToast();
  const promo = promos[index];

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % promos.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [reduced]);

  return (
    <motion.div variants={rise} className="relative h-full">
      <div
        className="glass relative isolate flex h-full min-h-[224px] flex-col overflow-hidden rounded-[var(--radius-card)] px-6 py-7"
      >
        <NecklaceMotif />

        <AnimatePresence mode="wait">
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: ease.luxe }}
            className="relative z-10 flex max-w-[56%] flex-1 flex-col justify-center"
          >
            <p className="text-[10px] tracking-luxe uppercase text-bronze">{promo.eyebrow}</p>
            <h3 className="mt-2.5 font-display text-[26px] leading-[1.12] text-champagne">{promo.title}</h3>
            <p className="mt-2.5 text-[12px] leading-relaxed text-champagne-soft/80">{promo.body}</p>

            <motion.button
              type="button"
              onClick={() => toast({ title: promo.title, detail: "Collection page is mocked for the demo" })}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={spring.press}
              className="metal-gold mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-medium tracking-luxe-sm uppercase text-wine-950"
            >
              {promo.action}
              <ArrowRight size={14} strokeWidth={2} />
            </motion.button>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mt-6 flex shrink-0 items-center gap-2">
          {promos.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${item.eyebrow}`}
              aria-current={i === index}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === index ? 26 : 8,
                background: i === index ? "linear-gradient(90deg,#91640F,#F9DF32,#B3871C)" : "rgba(215,175,92,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
