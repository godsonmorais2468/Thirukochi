import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Menu } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import BottomNavigation from "../components/BottomNavigation";
import type { NavKey } from "../components/BottomNavigation";
import FloatingAction from "../components/FloatingAction";
import PremiumBottomSheet from "../components/PremiumBottomSheet";
import ScreenTransition from "../components/ScreenTransition";
import TopBar from "../components/TopBar";
import HomeTab from "./tabs/HomeTab";
import WalletTab from "./tabs/WalletTab";
import PaymentsTab from "./tabs/PaymentsTab";
import ProfileTab from "./tabs/ProfileTab";
import { useIsDesktop } from "../hooks/useMediaQuery";
import { useToast } from "../hooks/useToasts";
import { formatRupees } from "../lib/format";
import { ease } from "../lib/motion";
import { menuLinks, notifications, schemes } from "../data/mock";

type Sheet = "none" | "schemes" | "notifications" | "menu";

interface HomeScreenProps {
  name: string;
  phone: string;
}

export default function HomeScreen({ name, phone }: HomeScreenProps) {
  const [sheet, setSheet] = useState<Sheet>("none");
  const [tab, setTab] = useState<NavKey>("home");
  const toast = useToast();
  // Only one logo may claim the shared layoutId, so the hidden one is not rendered.
  const isDesktop = useIsDesktop();
  const initial = (name.trim()[0] || "T").toUpperCase();

  return (
    <ScreenTransition className="lg:grid lg:h-full lg:grid-cols-[272px_1fr]">
      {/* Desktop rail */}
      <aside
        className="hidden border-r border-[rgba(215,175,92,0.12)] px-7 py-11 backdrop-blur-xl lg:flex lg:flex-col"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,1,1,0.82) 0%, rgba(34,3,3,0.78) 55%, rgba(14,0,0,0.86) 100%)",
        }}
      >
        {isDesktop && <BrandLogo variant="lockup" width={168} shared />}

        <BottomNavigation
          active={tab}
          orientation="rail"
          idPrefix="rail"
          className="mt-14"
          onChange={setTab}
        />

        <button
          type="button"
          onClick={() => setSheet("menu")}
          className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-[11px] tracking-luxe-sm uppercase text-champagne-dim transition-colors hover:text-gold-200"
        >
          <Menu size={16} strokeWidth={1.4} />
          Account
        </button>
      </aside>

      <div className="flex h-full min-h-0 flex-col">
        <TopBar
          initial={initial}
          showLogo={!isDesktop}
          onNotifications={() => setSheet("notifications")}
          onProfile={() => setTab("profile")}
        />

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-32 lg:px-12 lg:pb-12">
          <div className="mx-auto max-w-[1080px] pt-2 lg:pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.36, ease: ease.luxe }}
              >
                {tab === "home" && <HomeTab name={name} onOpenSchemes={() => setSheet("schemes")} />}
                {tab === "wallet" && <WalletTab />}
                {tab === "payments" && <PaymentsTab />}
                {tab === "profile" && <ProfileTab name={name} phone={phone} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <FloatingAction
          label="Add an instalment"
          onClick={() => toast({ title: "Quick add", detail: "Mock action — nothing is charged" })}
        />

        <BottomNavigation active={tab} className="lg:hidden" onChange={setTab} />
      </div>

      <PremiumBottomSheet
        open={sheet === "schemes"}
        onClose={() => setSheet("none")}
        eyebrow="Curated plans"
        title="Gold schemes"
      >
        <ul className="flex flex-col gap-3">
          {schemes.map((scheme) => (
            <li key={scheme.name} className="rounded-2xl border border-[rgba(215,175,92,0.16)] px-5 py-4">
              <div className="flex items-baseline justify-between">
                <p className="font-display text-[19px] text-champagne">{scheme.name}</p>
                <p className="text-[11px] text-champagne-dim">{scheme.tenure}</p>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-champagne-dim">{scheme.note}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-champagne-soft">
                  From {formatRupees(scheme.minimum)}/month
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSheet("none");
                    toast({ title: `${scheme.name} enquiry sent`, detail: "A concierge will call you" });
                  }}
                  className="text-[10px] tracking-luxe-sm uppercase text-gold-300 underline decoration-[rgba(179,135,28,0.5)] underline-offset-4"
                >
                  Enquire
                </button>
              </div>
            </li>
          ))}
        </ul>
      </PremiumBottomSheet>

      <PremiumBottomSheet
        open={sheet === "notifications"}
        onClose={() => setSheet("none")}
        eyebrow="Recent"
        title="Notifications"
      >
        <ul className="flex flex-col gap-2.5">
          {notifications.map((item) => (
            <li key={item.title} className="rounded-2xl border border-[rgba(215,175,92,0.14)] px-5 py-4">
              <div className="flex items-baseline justify-between">
                <p className="text-[13px] text-champagne">{item.title}</p>
                <p className="text-[10.5px] text-champagne-dim">{item.time}</p>
              </div>
              <p className="mt-1 text-[11.5px] text-champagne-dim">{item.body}</p>
            </li>
          ))}
        </ul>
      </PremiumBottomSheet>

      <PremiumBottomSheet
        open={sheet === "menu"}
        onClose={() => setSheet("none")}
        eyebrow="Your account"
        title={name.trim() || "Guest"}
      >
        <ul className="flex flex-col">
          {menuLinks.map((link) => (
            <li key={link}>
              <button
                type="button"
                onClick={() => {
                  setSheet("none");
                  toast({ title: link, detail: "Placeholder destination" });
                }}
                className="flex w-full items-center justify-between border-b border-[rgba(215,175,92,0.12)] py-4 text-left text-[13px] text-champagne-soft transition-colors hover:text-gold-200"
              >
                {link}
                <ArrowRight size={13} strokeWidth={1.5} className="text-champagne-dim" />
              </button>
            </li>
          ))}
        </ul>
      </PremiumBottomSheet>
    </ScreenTransition>
  );
}
