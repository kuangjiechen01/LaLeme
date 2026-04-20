import { AnimatePresence, motion } from "framer-motion";

export default function ToastViewport({ toasts }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] mx-auto flex max-w-[480px] flex-col gap-2 px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-auto rounded-[22px] border border-white/65 bg-[rgba(255,255,255,0.78)] px-4 py-3 shadow-[0_20px_40px_rgba(79,63,44,0.12)] backdrop-blur-xl dark:bg-[rgba(26,30,28,0.82)]"
          >
            <div className="text-sm font-semibold text-[var(--ink)]">{toast.title}</div>
            {toast.description ? (
              <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{toast.description}</div>
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
