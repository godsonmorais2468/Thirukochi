import { motion } from "framer-motion";
import GoldRateCard from "../../components/GoldRateCard";
import PromoCarousel from "../../components/PromoCarousel";
import ReferralCard from "../../components/ReferralCard";
import SchemeCallout from "../../components/SchemeCallout";
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

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6"
    >
      <motion.div variants={rise} className="lg:col-span-2">
        <p className="text-[10.5px] tracking-luxe uppercase text-bronze">{dateLabel()}</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-champagne lg:text-[38px]">
          {greetingFor(new Date().getHours())},{" "}
          <span className="text-metal-shimmer">{firstName}</span>
        </h1>
      </motion.div>

      <div className="lg:col-span-2">
        <GoldRateCard />
      </div>

      <ReferralCard />
      <PromoCarousel />

      <div className="lg:col-span-2">
        <SchemeCallout onOpen={onOpenSchemes} />
      </div>
    </motion.div>
  );
}
