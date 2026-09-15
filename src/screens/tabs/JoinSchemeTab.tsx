import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import GlassCard from "../../components/GlassCard";
import GoldButton from "../../components/GoldButton";
import { formatRupees } from "../../lib/format";
import { joinScheme, schemes } from "../../data/mock";
import { ease, rise, spring, stagger } from "../../lib/motion";
import { useToast } from "../../hooks/useToasts";

interface JoinSchemeTabProps {
  onJoined: () => void;
}

/** Field label in the house style: small, tracked, gold-lettered. */
function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <span className="mb-2.5 block text-[10px] tracking-luxe uppercase text-bronze">
      {children}
      {required && <span className="ml-1 text-gold-300">*</span>}
    </span>
  );
}

/** Square gold tick that fills when checked. */
function LuxeCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 text-left"
    >
      <motion.span
        aria-hidden
        animate={{
          borderColor: checked ? "rgba(249,223,50,0.75)" : "rgba(215,175,92,0.3)",
        }}
        whileTap={reduced ? undefined : { scale: 0.92 }}
        transition={spring.press}
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] ${
          checked ? "metal-gold" : ""
        }`}
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          background: checked ? undefined : "linear-gradient(158deg, rgba(52,8,8,0.8), rgba(18,1,1,0.9))",
        }}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={spring.press}
            >
              <Check size={13} strokeWidth={3} className="text-wine-950" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
      <span className="text-[12.5px] text-champagne-soft">{children}</span>
    </button>
  );
}

export default function JoinSchemeTab({ onJoined }: JoinSchemeTabProps) {
  const [scheme, setScheme] = useState("");
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [nominee, setNominee] = useState(false);
  const [nomineeName, setNomineeName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();
  const reduced = useReducedMotion();

  const amountValue = Number(amount.replace(/\D/g, ""));
  const schemeError = !scheme ? "Choose a scheme to continue." : undefined;
  const amountError = !amountValue ? "Enter a monthly amount." : amountValue < 1000 ? "Minimum ₹1,000 per month." : undefined;
  const ready = !schemeError && !amountError && agreed;

  const fieldStyle = {
    borderWidth: 1,
    borderStyle: "solid" as const,
    borderColor: "rgba(215,175,92,0.34)",
    background: "linear-gradient(158deg, rgba(52,8,8,0.86) 0%, rgba(18,1,1,0.92) 100%)",
  };

  const submit = () => {
    setSubmitted(true);
    if (!ready) return;
    toast({ title: `${scheme} subscribed`, detail: `${formatRupees(amountValue)} every month` });
    onJoined();
  };

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6"
    >
      <motion.div variants={rise} className="lg:col-span-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,223,50,0.3)] px-3.5 py-1.5 text-[10px] tracking-luxe uppercase text-gold-200">
          <Sparkles size={12} strokeWidth={1.6} />
          Join a scheme
        </span>
        <h1 className="mt-3 font-display text-[30px] leading-tight text-champagne lg:text-[38px]">
          Start your <span className="text-metal-shimmer">gold plan</span>
        </h1>
      </motion.div>

      {/* Scheme + amount */}
      <GlassCard className="px-6 py-6" beamDelay={0}>
        <div className="relative">
          <FieldLabel required>Select scheme</FieldLabel>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex h-[54px] w-full items-center justify-between rounded-2xl px-4 text-left"
            style={{
              ...fieldStyle,
              borderColor: submitted && schemeError ? "rgba(251,113,133,0.6)" : fieldStyle.borderColor,
            }}
          >
            <span className={`text-[14px] ${scheme ? "text-champagne" : "text-champagne-dim"}`}>
              {scheme || "Select a scheme"}
            </span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring.soft}>
              <ChevronDown size={16} strokeWidth={1.6} className="text-gold-300" />
            </motion.span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.ul
                role="listbox"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26, ease: ease.luxe }}
                className="glass absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl"
              >
                {schemes.map((option) => (
                  <li key={option.name}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={scheme === option.name}
                      onClick={() => {
                        setScheme(option.name);
                        setOpen(false);
                      }}
                      className="flex w-full items-baseline justify-between border-b border-[rgba(215,175,92,0.12)] px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-[rgba(249,223,50,0.06)]"
                    >
                      <span className="text-[13.5px] text-champagne">{option.name}</span>
                      <span className="text-[10.5px] text-champagne-dim">
                        {joinScheme.tenures[option.name]}
                      </span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {submitted && schemeError && (
            <p role="alert" className="mt-2 text-[11.5px] text-rose-300/90">{schemeError}</p>
          )}
        </div>

        <div className="mt-6">
          <FieldLabel required>Monthly amount</FieldLabel>
          <div
            className="flex h-[54px] items-center gap-2 rounded-2xl px-4"
            style={{
              ...fieldStyle,
              borderColor: submitted && amountError ? "rgba(251,113,133,0.6)" : fieldStyle.borderColor,
            }}
          >
            <span className="font-display text-[17px] text-gold-300">₹</span>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              placeholder="Amount"
              aria-label="Monthly amount"
              className="w-full bg-transparent font-display text-[17px] text-champagne caret-gold-300 placeholder:font-sans placeholder:text-[14px] placeholder:text-champagne-dim"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {joinScheme.presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors duration-300 ${
                  amountValue === preset
                    ? "border-[rgba(249,223,50,0.5)] text-gold-200"
                    : "border-[rgba(215,175,92,0.2)] text-champagne-dim hover:text-gold-200"
                }`}
              >
                {formatRupees(preset)}
              </button>
            ))}
          </div>

          {submitted && amountError && (
            <p role="alert" className="mt-2 text-[11.5px] text-rose-300/90">{amountError}</p>
          )}
        </div>
      </GlassCard>

      {/* Optional details */}
      <GlassCard className="px-6 py-6" beamDelay={1.8}>
        <FieldLabel>Referral code (optional)</FieldLabel>
        <div className="flex h-[54px] items-center rounded-2xl px-4" style={fieldStyle}>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="Referral code"
            aria-label="Referral code"
            maxLength={12}
            className="w-full bg-transparent font-display text-[16px] tracking-[0.14em] text-champagne caret-gold-300 placeholder:font-sans placeholder:text-[14px] placeholder:tracking-normal placeholder:text-champagne-dim"
          />
        </div>

        <div className="mt-6">
          <LuxeCheckbox checked={nominee} onChange={setNominee}>
            Add nominee
          </LuxeCheckbox>

          <AnimatePresence initial={false}>
            {nominee && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: ease.luxe }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex h-[54px] items-center rounded-2xl px-4" style={fieldStyle}>
                  <input
                    value={nomineeName}
                    onChange={(event) => setNomineeName(event.target.value)}
                    placeholder="Nominee name"
                    aria-label="Nominee name"
                    className="w-full bg-transparent font-display text-[16px] text-champagne caret-gold-300 placeholder:font-sans placeholder:text-[14px] placeholder:text-champagne-dim"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6">
          <FieldLabel>Remarks</FieldLabel>
          <textarea
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            rows={3}
            placeholder="Anything we should know"
            aria-label="Remarks"
            className="w-full resize-none rounded-2xl px-4 py-3 text-[13.5px] text-champagne caret-gold-300 placeholder:text-champagne-dim"
            style={fieldStyle}
          />
        </div>
      </GlassCard>

      {/* Confirm */}
      <motion.div variants={rise} className="lg:col-span-2">
        <GlassCard className="px-6 py-6" beamDelay={3.2}>
          <LuxeCheckbox checked={agreed} onChange={setAgreed}>
            I agree to the scheme terms and conditions
          </LuxeCheckbox>

          {submitted && !agreed && (
            <p role="alert" className="mt-2 pl-9 text-[11.5px] text-rose-300/90">
              Please accept the terms to continue.
            </p>
          )}

          <div className="mt-5 flex items-center justify-between text-[12px]">
            <span className="text-champagne-dim">You pay</span>
            <span className="font-display text-[20px] text-metal-gold">
              {amountValue ? `${formatRupees(amountValue)}/month` : "—"}
            </span>
          </div>

          <motion.div
            className="mt-5"
            animate={reduced || ready ? { opacity: 1 } : { opacity: 0.75 }}
            transition={{ duration: 0.3 }}
          >
            <GoldButton onClick={submit} icon={<Check size={15} strokeWidth={2.2} />}>
              Subscribe
            </GoldButton>
          </motion.div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
