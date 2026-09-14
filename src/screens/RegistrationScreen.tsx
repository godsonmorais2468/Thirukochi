import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Phone, User } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import GoldButton from "../components/GoldButton";
import LuxePanel from "../components/LuxePanel";
import ScreenTransition from "../components/ScreenTransition";
import TextField from "../components/TextField";
import { layout, rise, stagger } from "../lib/motion";
import type { Account } from "../types";

interface RegistrationScreenProps {
  onContinue: (account: Account) => void;
}

export default function RegistrationScreen({ onContinue }: RegistrationScreenProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nameError = name.trim().length < 2 ? "Enter your full name as on your records." : undefined;
  const digits = phone.replace(/\D/g, "");
  const phoneError = digits.length !== 10 ? "A 10-digit Indian mobile number is required." : undefined;
  const valid = !nameError && !phoneError;

  const submit = () => {
    setSubmitted(true);
    if (!valid) return;
    onContinue({ name: name.trim(), phone: digits });
  };

  return (
    <ScreenTransition className="overflow-y-auto px-8 pb-9 lg:px-16">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="mx-auto flex h-full w-full flex-col pt-[max(3.25rem,calc(env(safe-area-inset-top)+2.5rem))] lg:grid lg:max-w-[1240px] lg:grid-cols-[1.1fr_minmax(400px,460px)] lg:items-center lg:gap-24 lg:py-16 lg:pt-0"
      >
        {/* Editorial column */}
        <div className="flex flex-col lg:h-full lg:justify-center lg:pt-0">
          <motion.div variants={rise} className="relative flex justify-center lg:justify-start">
            {/* Halo breathing behind the mark */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -inset-10 -z-10"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(249,223,50,0.16) 0%, rgba(249,223,50,0) 68%)",
                filter: "blur(18px)",
              }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.96, 1.05, 0.96] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <BrandLogo variant="lockup" width={190} sizeClass="w-[190px] lg:w-[250px]" shared />
          </motion.div>

          <motion.div variants={rise} className="mt-11 lg:mt-14">
            <p className="text-[10px] tracking-luxe uppercase text-bronze">Est. Kochi</p>
            <h1 className="mt-3 font-display text-[40px] leading-[1.05] text-champagne lg:text-[64px]">
              A private gold
              <br />
              <span className="text-metal-shimmer italic">portfolio</span>, opened.
            </h1>
            <p className="mt-4 max-w-[30ch] text-[12.5px] leading-relaxed text-champagne-dim lg:mt-6 lg:max-w-[42ch] lg:text-[15px]">
              Begin with your name and number. Everything after takes under a minute.
            </p>
          </motion.div>
        </div>

        {/* Form column */}
        <motion.div variants={rise} className="mt-8 lg:mt-0">
          <LuxePanel>
          <p className="text-[10.5px] tracking-luxe uppercase text-gold-200/85">Open your account</p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
            className="mt-6 flex flex-col gap-4"
          >
            <TextField
              label="Full name"
              value={name}
              onChange={setName}
              autoComplete="name"
              icon={<User size={15} strokeWidth={1.5} />}
              glossDelay={0}
              error={submitted ? nameError : undefined}
            />
            <TextField
              label="Mobile number"
              value={phone}
              onChange={(next) => setPhone(next.replace(/[^\d\s+]/g, ""))}
              inputMode="tel"
              autoComplete="tel"
              maxLength={15}
              icon={<Phone size={15} strokeWidth={1.5} />}
              glossDelay={0.22}
              error={submitted ? phoneError : undefined}
              hint={!submitted ? "We send a one-time code to this number." : undefined}
            />
            <button type="submit" className="sr-only">
              Continue
            </button>
          </form>

          <div className="pt-7">
            <GoldButton
              onClick={submit}
              layoutId={layout.primaryAction}
              icon={<ArrowRight size={15} strokeWidth={1.8} />}
            >
              Continue
            </GoldButton>

            <p className="mt-5 text-center text-[10px] leading-relaxed text-champagne-soft/70">
              By continuing you accept our terms and privacy notice.
              <br />
              This is a demonstration — no data leaves your device.
            </p>
          </div>
          </LuxePanel>
        </motion.div>
      </motion.div>
    </ScreenTransition>
  );
}
