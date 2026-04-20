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
    <div className="sticky bottom-0 left-0 right-0 z-20 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-4">
      <nav className="relative overflow-hidden rounded-[28px] border border-white/65 bg-[rgba(252,249,243,0.86)] p-2 shadow-[0_20px_60px_rgba(93,72,51,0.12)] backdrop-blur-2xl dark:bg-[rgba(28,30,26,0.86)]">
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
      </nav>
    </div>
  );
}
