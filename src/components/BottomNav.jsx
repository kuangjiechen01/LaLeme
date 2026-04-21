import { motion } from "framer-motion";
import { BarChart3, History, House, Settings } from "lucide-react";

const iconMap = {
  "/": House,
  "/history": History,
  "/insights": BarChart3,
  "/settings": Settings,
};

export default function BottomNav({ currentPath, routes, onNavigate }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-[rgba(252,249,243,0.94)] px-3 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-14px_40px_rgba(93,72,51,0.10)] backdrop-blur-2xl dark:bg-[rgba(28,30,26,0.94)]">
      <div className="mx-auto max-w-[480px]">
        <div className="grid grid-cols-4 gap-1">
          {routes.map((route) => {
            const isActive = currentPath === route.path;
            const Icon = iconMap[route.path];

            return (
              <button
                key={route.path}
                type="button"
                className={`relative flex flex-col items-center gap-1 rounded-[22px] px-3 py-2 text-[11px] font-medium transition-colors ${
                  isActive ? "text-[var(--ink)]" : "text-[var(--muted)]"
                }`}
                onClick={() => onNavigate(route.path)}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-[22px] bg-[rgba(112,152,100,0.12)]"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10 rounded-full bg-white/60 p-2 dark:bg-white/8">
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <span className="relative z-10">{route.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
