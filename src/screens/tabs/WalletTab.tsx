import { motion } from "framer-motion";
import { Gift, TrendingUp, Users } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import ReferralCard from "../../components/ReferralCard";
import { useCountUp } from "../../hooks/useCountUp";
import { formatGrams, formatRupees } from "../../lib/format";
import { referral, wallet } from "../../data/mock";
import { ease, rise, stagger } from "../../lib/motion";

/** Wallet reads as the referral ledger: what was earned, and what is still pending. */
export default function WalletTab() {
  const earned = useCountUp(referral.bonusEarned, { duration: 1.6, delay: 0.25 });
  const grams = useCountUp(wallet.goldGrams, { duration: 1.6, delay: 0.35 });
  const schemeProgress = (wallet.scheme.paid / wallet.scheme.total) * 100;

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6"
    >
      <motion.div variants={rise} className="lg:col-span-2">
        <p className="text-[10.5px] tracking-luxe uppercase text-bronze">Wallet</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-champagne lg:text-[38px]">
          Referral <span className="text-metal-shimmer">bonus</span>
        </h1>
      </motion.div>

      <div className="lg:col-span-2">
        <GlassCard className="px-6 py-7" beamDelay={0}>
          <p className="text-[10px] tracking-luxe uppercase text-bronze">Bonus earned</p>
          <p className="mt-3 font-display text-[40px] leading-none text-metal-gold">
            {formatRupees(earned)}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[11.5px]">
            <span className="rounded-full border border-[rgba(215,175,92,0.24)] px-3 py-1.5 text-champagne-soft">
              {formatRupees(referral.bonusPending)} pending
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-[rgba(215,175,92,0.24)] px-3 py-1.5 text-champagne-soft">
              <Users size={12} strokeWidth={1.6} className="text-gold-300" />
              {referral.joined} joined of {referral.invited}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300/85">
              <TrendingUp size={12} strokeWidth={1.8} />
              Gold value {formatRupees(wallet.goldValue)}
            </span>
          </div>

          <p className="mt-5 text-[11px] text-champagne-dim">
            Holding {formatGrams(grams)} · {wallet.scheme.name} instalment {wallet.scheme.paid} of{" "}
            {wallet.scheme.total}
          </p>

          <div
            className="relative mt-3 h-[6px] w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={Math.round(schemeProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Scheme progress"
            style={{ background: "linear-gradient(180deg, rgba(12,0,0,0.7), rgba(50,10,10,0.45))" }}
          >
            <motion.span
              className="metal-gold absolute inset-y-0 left-0 w-full origin-left rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: schemeProgress / 100 }}
              transition={{ duration: 1.6, delay: 0.5, ease: ease.luxe }}
            />
          </div>
        </GlassCard>
      </div>

      <ReferralCard />

      <GlassCard className="px-6 py-6" beamDelay={2.2}>
        <div className="flex items-center gap-2.5">
          <Gift size={14} strokeWidth={1.5} className="text-gold-300" />
          <p className="text-[10px] tracking-luxe uppercase text-bronze">Bonus history</p>
        </div>

        <ul className="mt-4 flex flex-col">
          {referral.history.map((entry) => {
            const pending = entry.status === "Pending";
            return (
              <li
                key={entry.name}
                className="flex items-center justify-between border-b border-[rgba(215,175,92,0.12)] py-3.5 last:border-b-0"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] text-champagne">{entry.name}</span>
                  <span className="block truncate text-[11px] text-champagne-dim">
                    {entry.note} · {entry.date}
                  </span>
                </span>
                <span className="pl-3 text-right">
                  <span
                    className={`block font-display text-[16px] ${pending ? "text-champagne-dim" : "text-metal-gold"}`}
                  >
                    {pending ? "+" : "+"}
                    {formatRupees(entry.amount)}
                  </span>
                  <span
                    className={`block text-[10px] tracking-luxe-sm uppercase ${
                      pending ? "text-bronze" : "text-emerald-300/80"
                    }`}
                  >
                    {entry.status}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </GlassCard>
    </motion.div>
  );
}
