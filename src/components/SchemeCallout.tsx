import { ArrowRight, Sparkles } from "lucide-react";
import GlassCard from "./GlassCard";
import GoldButton from "./GoldButton";
import { schemeCallout } from "../data/mock";
import { layout } from "../lib/motion";

interface SchemeCalloutProps {
  onOpen: () => void;
}

export default function SchemeCallout({ onOpen }: SchemeCalloutProps) {
  return (
    <GlassCard className="px-6 py-7" beamDelay={2.8}>
      <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,223,50,0.3)] px-3.5 py-1.5 text-[10px] tracking-luxe uppercase text-gold-200">
        <Sparkles size={12} strokeWidth={1.6} />
        {schemeCallout.eyebrow}
      </span>

      <h3 className="mt-4 font-display text-[26px] leading-[1.15] text-champagne">
        {schemeCallout.title}
      </h3>
      <p className="mt-3 text-[12.5px] leading-relaxed text-champagne-soft/80">{schemeCallout.body}</p>

      <div className="mt-6">
        <GoldButton
          layoutId={layout.primaryAction}
          onClick={onOpen}
          icon={<ArrowRight size={15} strokeWidth={1.8} />}
        >
          {schemeCallout.action}
        </GoldButton>
      </div>
    </GlassCard>
  );
}
