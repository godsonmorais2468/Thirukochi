import { motion } from "framer-motion";
import GoldRateCard from "../../components/GoldRateCard";
import PromoCarousel from "../../components/PromoCarousel";
import ReferralCard from "../../components/ReferralCard";
import SchemeCallout from "../../components/SchemeCallout";
import { useIsDesktop } from "../../hooks/useMediaQuery";
import { rise, stagger } from "../../lib/motion";

interface HomeTabProps {
  name: string;
  onOpenSchemes: () => void;
}

const dateLabel = () =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" })
    .format(new Date())
    .toUpperCase();

const greetingFor = (hour: number) => {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export default function HomeTab({ name, onOpenSchemes }: HomeTabProps) {
  const firstName = name.trim().split(" ")[0] || "there";
  const isDesktop = useIsDesktop();

  const rate = <GoldRateCard />;
  const referral = <ReferralCard />;
  const schemes = <SchemeCallout onOpen={onOpenSchemes} />;
  const promo = <PromoCarousel />;

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-col gap-4">
      <motion.div variants={rise}>
        <p className="text-[10.5px] tracking-luxe uppercase text-bronze">{dateLabel()}</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-champagne lg:text-[38px]">
          {greetingFor(new Date().getHours())}, <span className="text-metal-shimmer">{firstName}</span>
        </h1>
      </motion.div>

      {isDesktop ? (
        /*
          Two independent columns rather than grid rows: each stacks tightly, so
          a short card never leaves a gap beside a taller one.
        */
        <div className="grid grid-cols-2 items-stretch gap-6">
          <div className="flex flex-col gap-6">
            {rate}
            {schemes}
          </div>
          <div className="flex flex-col gap-6">
            {referral}
            <div className="flex-1">{promo}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rate}
          {referral}
          {promo}
          {schemes}
        </div>
      )}
    </motion.div>
  );
}
