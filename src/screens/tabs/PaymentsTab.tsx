import { motion } from "framer-motion";
import { CalendarClock, Check, Download } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import { useCountUp } from "../../hooks/useCountUp";
import { formatGrams, formatRupees } from "../../lib/format";
import { payments } from "../../data/mock";
import { rise, stagger } from "../../lib/motion";
import { useToast } from "../../hooks/useToasts";

export default function PaymentsTab() {
  const paid = useCountUp(payments.paidThisYear, { duration: 1.6, delay: 0.25 });
  const toast = useToast();

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6"
    >
      <motion.div variants={rise} className="lg:col-span-2">
        <p className="text-[10.5px] tracking-luxe uppercase text-bronze">Payments</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-champagne lg:text-[38px]">
          Payment <span className="text-metal-shimmer">history</span>
        </h1>
      </motion.div>

      <GlassCard className="px-6 py-7" beamDelay={0}>
        <p className="text-[10px] tracking-luxe uppercase text-bronze">Paid this year</p>
        <p className="mt-3 font-display text-[36px] leading-none text-metal-gold">{formatRupees(paid)}</p>
        <p className="mt-4 text-[11.5px] text-champagne-soft/85">
          {payments.history.length} instalments · {payments.history[0].scheme}
        </p>
      </GlassCard>

      <GlassCard className="px-6 py-7" beamDelay={1.6}>
        <div className="flex items-center gap-2.5">
          <CalendarClock size={14} strokeWidth={1.5} className="text-gold-300" />
          <p className="text-[10px] tracking-luxe uppercase text-bronze">Next instalment</p>
        </div>
        <p className="mt-3 font-display text-[28px] leading-none text-champagne">
          {formatRupees(payments.nextDue.amount)}
        </p>
        <p className="mt-2.5 text-[11.5px] text-champagne-dim">
          Due {payments.nextDue.date} · {payments.nextDue.scheme}
        </p>
        <button
          type="button"
          onClick={() => toast({ title: "Payment reminder set", detail: payments.nextDue.date })}
          className="mt-4 text-[10px] tracking-luxe-sm uppercase text-gold-300 underline decoration-[rgba(179,135,28,0.5)] underline-offset-4"
        >
          Remind me
        </button>
      </GlassCard>

      <div className="lg:col-span-2">
        <GlassCard className="px-6 py-6" beamDelay={3}>
          <p className="text-[10px] tracking-luxe uppercase text-bronze">All transactions</p>

          <ul className="mt-4 flex flex-col">
            {payments.history.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-3 border-b border-[rgba(215,175,92,0.12)] py-4 last:border-b-0"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(158deg, rgba(145,100,15,0.42), rgba(30,4,4,0.5))",
                    border: "1px solid rgba(215,175,92,0.26)",
                  }}
                >
                  <Check size={14} strokeWidth={2} className="text-gold-200" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] text-champagne">{entry.scheme}</span>
                  <span className="block truncate text-[11px] text-champagne-dim">
                    {entry.date} · {entry.method}
                  </span>
                </span>

                <span className="text-right">
                  <span className="block font-display text-[17px] text-champagne">
                    {formatRupees(entry.amount)}
                  </span>
                  <span className="block text-[10.5px] text-champagne-dim">{formatGrams(entry.grams)}</span>
                </span>

                <button
                  type="button"
                  onClick={() => toast({ title: `Receipt ${entry.id}`, detail: "Mock download for the demo" })}
                  aria-label={`Download receipt ${entry.id}`}
                  className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-champagne-dim transition-colors hover:text-gold-200"
                >
                  <Download size={14} strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </motion.div>
  );
}
