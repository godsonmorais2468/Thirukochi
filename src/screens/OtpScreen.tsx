import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import GoldButton from "../components/GoldButton";
import LuxePanel from "../components/LuxePanel";
import OtpInput from "../components/OtpInput";
import ScreenTransition from "../components/ScreenTransition";
import { MOCK_OTP, OTP_COUNTDOWN, OTP_LENGTH } from "../data/mock";
import { maskPhone } from "../lib/format";
import { ease, layout, rise, stagger } from "../lib/motion";

interface OtpScreenProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

type Status = "idle" | "error" | "verified";

export default function OtpScreen({ phone, onVerified, onBack }: OtpScreenProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(OTP_COUNTDOWN);
  const [fieldKey, setFieldKey] = useState(0);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  const verify = (value: string) => {
    if (value.length < OTP_LENGTH) return;
    if (value === MOCK_OTP) {
      setStatus("verified");
      timeouts.current.push(window.setTimeout(onVerified, 900));
    } else {
      setStatus("error");
    }
  };

  const resend = () => {
    if (seconds > 0) return;
    setSeconds(OTP_COUNTDOWN);
    setCode("");
    setStatus("idle");
    setFieldKey((key) => key + 1);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <ScreenTransition className="overflow-hidden px-7 pb-[clamp(14px,2.4vh,36px)] lg:overflow-y-auto lg:px-16">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="mx-auto flex h-full w-full flex-col justify-center gap-[clamp(8px,1.6vh,18px)] pt-[max(0.75rem,env(safe-area-inset-top))] lg:justify-start lg:gap-0 lg:pt-0 lg:grid lg:max-w-[1240px] lg:grid-cols-[1.1fr_minmax(400px,460px)] lg:items-center lg:gap-24 lg:py-16 lg:pt-0"
      >
        <div className="flex flex-col lg:h-full lg:justify-center">
          <motion.button
            variants={rise}
            type="button"
            onClick={onBack}
            aria-label="Back to registration"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(215,175,92,0.2)] text-champagne-dim transition-colors hover:text-gold-200"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
          </motion.button>

          <motion.div variants={rise} className="mt-[clamp(8px,2vh,28px)] flex justify-center lg:mt-12 lg:justify-start">
            <BrandLogo variant="lockup" width={150} sizeClass="w-[clamp(112px,30vw,150px)] lg:w-[230px]" shared />
          </motion.div>

          <motion.div variants={rise} className="mt-[clamp(10px,2.4vh,48px)] lg:mt-14">
            <p className="text-[10px] tracking-luxe uppercase text-bronze">Verification</p>
            <h1 className="mt-2 font-display text-[clamp(23px,6.4vw,32px)] leading-tight text-champagne lg:text-[52px]">
              Enter your <span className="text-metal-shimmer">six digits</span>
            </h1>
            <p className="mt-3 text-[12.5px] text-champagne-dim lg:text-[15px]">
              Sent to <span className="text-champagne-soft">{maskPhone(phone)}</span>
            </p>
          </motion.div>
        </div>

        <motion.div variants={rise} className="mt-[clamp(10px,2vh,40px)] lg:mt-0">
          <LuxePanel>
        <div>
          <OtpInput
            key={fieldKey}
            length={OTP_LENGTH}
            status={status}
            onChange={(value) => {
              setCode(value);
              if (status === "error") setStatus("idle");
            }}
            onComplete={verify}
            disabled={status === "verified"}
          />

          <div className="mt-3 min-h-[18px]">
            <AnimatePresence mode="wait">
              {status === "error" && (
                <motion.p
                  key="error"
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: ease.luxe }}
                  className="text-[11.5px] text-rose-300/85"
                >
                  That code doesn&apos;t match. For this demo, use {MOCK_OTP}.
                </motion.p>
              )}
              {status === "verified" && (
                <motion.p
                  key="verified"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: ease.luxe }}
                  className="flex items-center gap-1.5 text-[11.5px] text-gold-200"
                >
                  <Check size={13} strokeWidth={2} />
                  Number verified
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11.5px]">
          <span className="text-champagne-soft/85">
            {seconds > 0 ? (
              <>
                Code expires in{" "}
                <span className="tabular-nums text-champagne-soft">
                  {mm}:{ss}
                </span>
              </>
            ) : (
              "Code expired"
            )}
          </span>
          <button
            type="button"
            onClick={resend}
            disabled={seconds > 0}
            className="tracking-luxe-sm uppercase text-gold-300 underline decoration-[rgba(179,135,28,0.5)] underline-offset-4 transition-opacity disabled:opacity-30"
          >
            Resend
          </button>
        </div>

          <div className="pt-[clamp(14px,2.4vh,28px)] lg:pt-10">
            <GoldButton
              layoutId={layout.primaryAction}
              onClick={() => verify(code)}
              disabled={code.length < OTP_LENGTH || status === "verified"}
              icon={<ShieldCheck size={15} strokeWidth={1.7} />}
            >
              {status === "verified" ? "Verified" : "Verify"}
            </GoldButton>
          </div>
          </LuxePanel>
        </motion.div>
      </motion.div>
    </ScreenTransition>
  );
}
