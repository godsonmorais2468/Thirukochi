import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import { maskPhone } from "../../lib/format";
import { menuLinks, referral, wallet } from "../../data/mock";
import { rise, stagger } from "../../lib/motion";
import { useToast } from "../../hooks/useToasts";
import { formatGrams } from "../../lib/format";

interface ProfileTabProps {
  name: string;
  phone: string;
}

export default function ProfileTab({ name, phone }: ProfileTabProps) {
  const toast = useToast();
  const initial = (name.trim()[0] || "T").toUpperCase();

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6"
    >
      <motion.div variants={rise} className="lg:col-span-2">
        <p className="text-[10.5px] tracking-luxe uppercase text-bronze">Profile</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-champagne lg:text-[38px]">
          Your <span className="text-metal-shimmer">account</span>
        </h1>
      </motion.div>

      <GlassCard className="px-6 py-7" beamDelay={0}>
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="metal-gold flex h-14 w-14 items-center justify-center rounded-full font-display text-[24px] text-wine-950"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}
          >
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[22px] leading-none text-champagne">
              {name.trim() || "Guest"}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-champagne-dim">
              <Phone size={11} strokeWidth={1.6} className="text-bronze" />
              {maskPhone(phone)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5 text-[11px]">
          <span className="rounded-full border border-[rgba(215,175,92,0.24)] px-3 py-1.5 text-champagne-soft">
            {formatGrams(wallet.goldGrams)} held
          </span>
          <span className="rounded-full border border-[rgba(215,175,92,0.24)] px-3 py-1.5 text-champagne-soft">
            Code {referral.code}
          </span>
        </div>
      </GlassCard>

      <GlassCard className="px-6 py-4" beamDelay={2}>
        <ul className="flex flex-col">
          {menuLinks.map((link) => (
            <li key={link}>
              <button
                type="button"
                onClick={() => toast({ title: link, detail: "Placeholder destination" })}
                className="flex w-full items-center justify-between border-b border-[rgba(215,175,92,0.12)] py-4 text-left text-[13px] text-champagne-soft transition-colors last:border-b-0 hover:text-gold-200"
              >
                {link}
                <ArrowRight size={13} strokeWidth={1.5} className="text-champagne-dim" />
              </button>
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  );
}
