import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import { useAppStore } from "../hooks/useAppStore";
import BottomNav from "./BottomNav";
import QuickCheckInSheet from "./QuickCheckInSheet";
import ToastViewport from "./ToastViewport";

export default function AppShell({ children, currentPath, routes, onNavigate }) {
  const { sheet, closeSheet, toasts } = useAppStore();
  const location = useLocation();

  return (
    <div className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="mx-auto min-h-screen max-w-[480px] px-4 pb-[calc(100px+env(safe-area-inset-bottom))] pt-5">
        <motion.div
          className="relative min-h-[calc(100vh-2rem)] rounded-[32px] border border-white/55 bg-[var(--panel)]/92 shadow-[0_30px_80px_rgba(88,76,54,0.12)] backdrop-blur-xl"
          layout
        >
          <main className="px-4 pb-6 pt-4">
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
