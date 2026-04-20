import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAppStore } from "../hooks/useAppStore";
import BottomNav from "./BottomNav";
import QuickCheckInSheet from "./QuickCheckInSheet";
import ToastViewport from "./ToastViewport";

export default function AppShell({ children, currentPath, routes, onNavigate }) {
  const { sheet, closeSheet, toasts } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;

    const syncViewportHeight = () => {
      root.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    syncViewportHeight();

    window.addEventListener("resize", syncViewportHeight);
    window.addEventListener("orientationchange", syncViewportHeight);
    window.addEventListener("pageshow", syncViewportHeight);
    window.visualViewport?.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("scroll", syncViewportHeight);

    return () => {
      window.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);
      window.removeEventListener("pageshow", syncViewportHeight);
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("scroll", syncViewportHeight);
    };
  }, []);

  return (
    <div className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="app-shell-container mx-auto max-w-[480px] px-4">
        <motion.div
          className="app-frame relative rounded-[32px] border border-white/55 bg-[var(--panel)]/92 shadow-[0_30px_80px_rgba(88,76,54,0.12)] backdrop-blur-xl"
          layout
        >
          <main className="app-main px-4 pb-6 pt-4">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0.82, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </main>
          <BottomNav currentPath={currentPath} routes={routes} onNavigate={onNavigate} />
        </motion.div>
      </div>
      <QuickCheckInSheet open={sheet.open} onClose={closeSheet} sheet={sheet} />
      <ToastViewport toasts={toasts} />
    </div>
  );
}
