import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Bell, Menu } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import BottomNavigation from "../components/BottomNavigation";
import type { NavKey } from "../components/BottomNavigation";
import GoldButton from "../components/GoldButton";
import GoldRateCard from "../components/GoldRateCard";
import PortfolioHero from "../components/PortfolioHero";
import PremiumBottomSheet from "../components/PremiumBottomSheet";
import QuickActionGrid from "../components/QuickActionGrid";
import SavingsGoal from "../components/SavingsGoal";
import ScreenTransition from "../components/ScreenTransition";
import { useIsDesktop } from "../hooks/useMediaQuery";
import { useToast } from "../hooks/useToasts";
import { formatGrams, formatRupees } from "../lib/format";
import { layout, rise, stagger } from "../lib/motion";
import { menuLinks, notifications, portfolio, schemes } from "../data/mock";

type Sheet = "none" | "schemes" | "portfolio" | "notifications" | "menu";

interface HomeScreenProps {
  name: string;
}

const navCopy: Record<NavKey, { title: string; detail: string }> = {
  home: { title: "Home", detail: "You're already here" },
  schemes: { title: "Schemes", detail: "Full catalogue arrives in the next build" },
  wallet: { title: "Wallet", detail: "Instalments and receipts, coming soon" },
  profile: { title: "Profile", detail: "KYC and preferences, coming soon" },
};

export default function HomeScreen({ name }: HomeScreenProps) {
  const [sheet, setSheet] = useState<Sheet>("none");
  const [nav, setNav] = useState<NavKey>("home");
  const toast = useToast();
  // Only one logo may claim the shared layoutId, so the hidden one is not rendered.
  const isDesktop = useIsDesktop();

  const firstName = name.trim().split(" ")[0] || "there";

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
          active={nav}
          orientation="rail"
          idPrefix="rail"
          className="mt-14"
          onChange={(key) => {
            setNav(key);
            if (key !== "home") toast(navCopy[key]);
          }}
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
      {/* Editorial top bar */}
      <motion.header
        variants={rise}
        initial="initial"
        animate="animate"
        className="flex items-center justify-between px-6 pt-[max(2.75rem,calc(env(safe-area-inset-top)+2.25rem))] pb-3 lg:px-12 lg:pt-11"
      >
        <button
          type="button"
          onClick={() => setSheet("menu")}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(215,175,92,0.2)] text-champagne-dim transition-colors hover:text-gold-200 lg:hidden"
        >
          <Menu size={15} strokeWidth={1.4} />
        </button>

        <div className="lg:hidden">
          {!isDesktop && <BrandLogo variant="wordmark" width={128} shared />}
        </div>

        <div className="hidden lg:block">
          <p className="text-[10px] tracking-luxe uppercase text-bronze">Namaskaram</p>
          <h1 className="mt-1.5 font-display text-[34px] leading-none text-champagne">{firstName}</h1>
        </div>

        <button
          type="button"
          onClick={() => setSheet("notifications")}
          aria-label={`Notifications, ${notifications.length} new`}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(215,175,92,0.2)] text-champagne-dim transition-colors hover:text-gold-200"
        >
          <Bell size={15} strokeWidth={1.4} />
          <span
            aria-hidden
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold-300"
            style={{ boxShadow: "0 0 8px 1px rgba(249,223,50,0.7)" }}
          />
        </button>
      </motion.header>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-32 lg:px-12 lg:pb-12"
      >
        <motion.div variants={rise} className="pt-4 pb-6 lg:hidden">
          <p className="text-[10px] tracking-luxe uppercase text-bronze">Namaskaram</p>
          <h1 className="mt-2 font-display text-[30px] leading-tight text-champagne">
            {firstName}
          </h1>
        </motion.div>

        <div className="mx-auto flex max-w-[1080px] flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:pt-6">
          <div className="lg:col-span-2">
            <PortfolioHero onOpen={() => setSheet("portfolio")} />
          </div>

          <GoldRateCard />
          <SavingsGoal />

          <div className="lg:col-span-2">
            <QuickActionGrid
              onAction={(action) =>
                toast({ title: `${action.label} selected`, detail: "Mock action — nothing is charged" })
              }
            />
          </div>

          <motion.div variants={rise} className="pt-2 lg:col-span-2 lg:max-w-[360px] lg:pt-0">
            <GoldButton
              layoutId={layout.primaryAction}
              onClick={() => setSheet("schemes")}
              icon={<ArrowRight size={15} strokeWidth={1.8} />}
            >
              Explore gold schemes
            </GoldButton>
          </motion.div>
        </div>
      </motion.div>

      <BottomNavigation
        active={nav}
        className="lg:hidden"
        onChange={(key) => {
          setNav(key);
          if (key !== "home") toast(navCopy[key]);
        }}
      />
      </div>

      <PremiumBottomSheet
        open={sheet === "schemes"}
        onClose={() => setSheet("none")}
        eyebrow="Curated plans"
        title="Gold schemes"
      >
        <ul className="flex flex-col gap-3">
          {schemes.map((scheme) => (
            <li
              key={scheme.name}
              className="rounded-2xl border border-[rgba(215,175,92,0.16)] px-5 py-4"
            >
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
        open={sheet === "portfolio"}
        onClose={() => setSheet("none")}
        eyebrow="Breakdown"
        title={formatRupees(portfolio.value)}
      >
        <ul className="flex flex-col gap-2.5">
          {portfolio.holdings.map((holding) => (
            <li
              key={holding.label}
              className="flex items-center justify-between rounded-2xl border border-[rgba(215,175,92,0.14)] px-5 py-4"
            >
              <span>
                <span className="block text-[13px] text-champagne">{holding.label}</span>
                <span className="block text-[11px] text-champagne-dim">{formatGrams(holding.grams)}</span>
              </span>
              <span className="font-display text-[18px] text-champagne-soft">
                {formatRupees(holding.value)}
              </span>
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
