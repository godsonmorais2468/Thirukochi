import { motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Gift, Share2 } from "lucide-react";
import { useState } from "react";
import GlassCard from "./GlassCard";
import { referral } from "../data/mock";
import { useToast } from "../hooks/useToasts";
import { spring } from "../lib/motion";

export default function ReferralCard() {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const reduced = useReducedMotion();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referral.code);
    } catch {
      // Clipboard can be blocked; the toast still confirms the intent.
    }
    setCopied(true);
    toast({ title: "Referral code copied", detail: referral.code });
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="px-6 py-6" beamDelay={1.4}>
      {/* Ribbon curl in the corner */}
      <svg aria-hidden className="pointer-events-none absolute -right-2 -top-2 h-28 w-28 opacity-70" viewBox="0 0 100 100" fill="none">
        <path d="M96 4 C 70 4, 62 22, 62 44 C 62 64, 48 72, 30 74" stroke="rgba(215,175,92,0.4)" strokeWidth="1" />
        <circle cx="96" cy="4" r="2" fill="rgba(249,223,50,0.8)" />
        <motion.circle
          cx="30"
          cy="74"
          r="2"
          fill="rgba(249,223,50,0.9)"
          animate={reduced ? undefined : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      <div className="flex items-center gap-3.5">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(158deg, rgba(145,100,15,0.5), rgba(30,4,4,0.5))",
            border: "1px solid rgba(215,175,92,0.3)",
            boxShadow: "inset 0 1px 0 rgba(251,241,201,0.22)",
          }}
        >
          <Gift size={17} strokeWidth={1.4} className="text-gold-200" />
        </span>
        <div>
          <p className="text-[10px] tracking-luxe uppercase text-bronze">Referral code</p>
          <p className="mt-1 font-display text-[19px] leading-none text-champagne">{referral.headline}</p>
        </div>
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed text-champagne-soft/85">{referral.body}</p>

      <div
        className="mt-5 flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          border: "1px dashed rgba(215,175,92,0.34)",
          background: "linear-gradient(158deg, rgba(52,8,8,0.7) 0%, rgba(18,1,1,0.8) 100%)",
        }}
      >
        <span className="flex-1 font-display text-[22px] tracking-[0.18em] text-metal-gold">
          {referral.code}
        </span>

        <button
          type="button"
          onClick={() => toast({ title: "Share sheet", detail: "Mock action for the demo" })}
          aria-label="Share referral code"
          className="flex h-9 w-9 items-center justify-center rounded-full text-champagne-dim transition-colors hover:text-gold-200"
        >
          <Share2 size={15} strokeWidth={1.5} />
        </button>

        <motion.button
          type="button"
          onClick={copy}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          transition={spring.press}
          className="metal-gold flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-medium tracking-luxe-sm uppercase text-wine-950"
        >
          {copied ? <Check size={13} strokeWidth={2.4} /> : <Copy size={13} strokeWidth={2} />}
          {copied ? "Copied" : "Copy"}
        </motion.button>
      </div>
    </GlassCard>
  );
}
