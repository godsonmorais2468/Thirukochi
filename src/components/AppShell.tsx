import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import LuxuryBackground from "./LuxuryBackground";
import ToastStack from "./Toast";
import ResetDemo from "./ResetDemo";
import { ToastContext } from "../hooks/useToasts";
import type { ToastInput } from "../hooks/useToasts";
import type { ToastMessage } from "../types";

interface AppShellProps {
  children: ReactNode;
  onReset: () => void;
}

/**
 * The device frame: full-bleed on phones, a seated mockup on wider screens.
 * Hosts the atmosphere, the toast stack and the demo reset.
 */
export default function AppShell({ children, onReset }: AppShellProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);

  const pushToast = useCallback(({ title, detail }: ToastInput) => {
    const id = nextId.current;
    nextId.current += 1;
    setToasts((current) => [...current, { id, title, detail }].slice(-2));
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const value = useMemo(() => pushToast, [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {/*
        Under lg the app is a phone: full-bleed on small screens, seated in a
        device frame on tablets. From lg up the frame is dropped and the app
        takes the whole viewport as a desktop layout.
      */}
      <div className="flex min-h-dvh w-full items-center justify-center bg-wine-950 sm:p-8 lg:p-0">
        {/* Ambient spill behind the device on tablet previews */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 hidden sm:block lg:hidden"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 42%, rgba(84,0,0,0.55) 0%, rgba(18,0,0,0) 72%)",
          }}
        />

        <div
          className="relative h-dvh w-full overflow-hidden bg-wine-950 shadow-[0_60px_140px_-50px_rgba(0,0,0,0.95),0_0_0_1px_rgba(215,175,92,0.16)] sm:h-[844px] sm:max-h-[94vh] sm:w-[390px] sm:rounded-[46px] lg:h-dvh lg:max-h-none lg:w-full lg:rounded-none lg:shadow-none"
        >
          <LuxuryBackground />
          <div className="relative z-10 h-full">{children}</div>
          <ToastStack toasts={toasts} />
          <ResetDemo onReset={onReset} />
        </div>
      </div>
    </ToastContext.Provider>
  );
}
