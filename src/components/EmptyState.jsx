import { motion } from "framer-motion";
import { MoonStar, Sparkles } from "lucide-react";

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[28px] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] ${
        compact ? "px-4 py-6" : "px-5 py-8"
      } text-center`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/75 shadow-[0_12px_24px_rgba(111,157,102,0.12)] dark:bg-white/6">
        <MoonStar className="h-6 w-6 text-[var(--accent-strong)]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[260px] text-sm leading-6 text-[var(--muted)]">{description}</p>
      {actionLabel ? (
        <button type="button" className="secondary-button mx-auto mt-5 inline-flex items-center gap-2" onClick={onAction}>
          <Sparkles className="h-4 w-4" />
          {actionLabel}
        </button>
      ) : null}
    </motion.div>
  );
}
