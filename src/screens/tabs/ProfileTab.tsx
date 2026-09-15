import { motion } from "framer-motion";
import { BadgeCheck, ChevronRight, LogOut, Phone } from "lucide-react";
import { useState } from "react";
import GlassCard from "../../components/GlassCard";
import PremiumBottomSheet from "../../components/PremiumBottomSheet";
import GoldButton from "../../components/GoldButton";
import { maskPhone } from "../../lib/format";
import { profile } from "../../data/mock";
import { ease, rise, stagger } from "../../lib/motion";
import { useToast } from "../../hooks/useToasts";

interface ProfileTabProps {
  name: string;
  phone: string;
  onSignOut: () => void;
}

const PIN_FIELDS = [
  { key: "current", label: "Current MPIN" },
  { key: "next", label: "New MPIN" },
  { key: "confirm", label: "Confirm new MPIN" },
] as const;

type PinKey = (typeof PIN_FIELDS)[number]["key"];

export default function ProfileTab({ name, phone, onSignOut }: ProfileTabProps) {
  const [mpinOpen, setMpinOpen] = useState(false);
  const [pins, setPins] = useState<Record<PinKey, string>>({ current: "", next: "", confirm: "" });
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();
  const initial = (name.trim()[0] || "T").toUpperCase();

  const pinError =
    pins.current.length !== 4
      ? "Enter your current 4-digit MPIN."
      : pins.next.length !== 4
        ? "New MPIN must be 4 digits."
        : pins.next === pins.current
          ? "New MPIN must differ from the current one."
          : pins.confirm !== pins.next
            ? "The confirmation doesn't match."
            : undefined;

  const saveMpin = () => {
    setSubmitted(true);
    if (pinError) return;
    setMpinOpen(false);
    setPins({ current: "", next: "", confirm: "" });
    setSubmitted(false);
    toast({ title: "MPIN updated", detail: "Use the new PIN next time you sign in" });
  };

  const openItem = (key: string, label: string) => {
    if (key === "mpin") {
      setMpinOpen(true);
      return;
    }
    toast({ title: label, detail: "Placeholder destination" });
  };

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

      {/* Identity */}
      <GlassCard className="px-6 py-6" beamDelay={0}>
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="metal-gold flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-[24px] text-wine-950"
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

        <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1.5 rounded-full border border-[rgba(249,223,50,0.28)] px-3 py-1.5 text-gold-200">
            <BadgeCheck size={12} strokeWidth={1.8} />
            KYC {profile.kyc}
          </span>
          <span className="rounded-full border border-[rgba(215,175,92,0.22)] px-3 py-1.5 text-champagne-soft">
            Member since {profile.memberSince}
          </span>
        </div>
      </GlassCard>

      {/* Grouped settings */}
      <div className="flex flex-col gap-4 lg:gap-6">
        {profile.sections.map((section, index) => (
          <GlassCard key={section.title} className="px-6 py-5" beamDelay={1.2 + index * 1.1}>
            <p className="text-[10px] tracking-luxe uppercase text-bronze">{section.title}</p>

            <ul className="mt-3 flex flex-col">
              {section.items.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => openItem(item.key, item.label)}
                    className="group flex w-full items-center justify-between gap-3 border-b border-[rgba(215,175,92,0.12)] py-3.5 text-left transition-colors last:border-b-0"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] text-champagne-soft transition-colors group-hover:text-gold-200">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-champagne-dim">
                        {item.hint}
                      </span>
                    </span>
                    <ChevronRight
                      size={15}
                      strokeWidth={1.5}
                      className="shrink-0 text-champagne-dim transition-colors group-hover:text-gold-200"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}

        {/* Sign out lives here on phones, and on the desktop rail as well */}
        <motion.button
          variants={rise}
          type="button"
          onClick={onSignOut}
          className="glass flex items-center justify-center gap-2.5 rounded-[var(--radius-card)] px-6 py-4 text-[12px] tracking-luxe-sm uppercase text-champagne-soft transition-colors hover:text-gold-200"
        >
          <LogOut size={14} strokeWidth={1.6} />
          Sign out
        </motion.button>
      </div>

      <PremiumBottomSheet
        open={mpinOpen}
        onClose={() => setMpinOpen(false)}
        eyebrow="Security"
        title="Change MPIN"
      >
        <div className="flex flex-col gap-4">
          {PIN_FIELDS.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-2 block text-[10px] tracking-luxe uppercase text-bronze">
                {field.label}
              </span>
              <input
                value={pins[field.key]}
                onChange={(event) =>
                  setPins((current) => ({
                    ...current,
                    [field.key]: event.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                inputMode="numeric"
                type="password"
                autoComplete="off"
                aria-label={field.label}
                className="h-[52px] w-full rounded-2xl px-4 font-display text-[20px] tracking-[0.5em] text-champagne caret-gold-300"
                style={{
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "rgba(215,175,92,0.34)",
                  background: "linear-gradient(158deg, rgba(52,8,8,0.86) 0%, rgba(18,1,1,0.92) 100%)",
                }}
              />
            </label>
          ))}

          {submitted && pinError && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, ease: ease.luxe }}
              className="text-[11.5px] text-rose-300/90"
            >
              {pinError}
            </motion.p>
          )}

          <GoldButton onClick={saveMpin}>Update MPIN</GoldButton>
        </div>
      </PremiumBottomSheet>
    </motion.div>
  );
}
