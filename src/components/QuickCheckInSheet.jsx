import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock3, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { useAppStore } from "../hooks/useAppStore";
import { toLocalDateInputValue, toLocalTimeInputValue } from "../lib/date";

const statusOptions = [
  { value: "smooth", label: "顺畅", hint: "轻松、通畅" },
  { value: "normal", label: "一般", hint: "状态普通" },
  { value: "difficult", label: "困难", hint: "偏慢、偏费力" },
];

export default function QuickCheckInSheet({ open, onClose, sheet }) {
  const { upsertRecord } = useAppStore();
  const [advanced, setAdvanced] = useState(false);
  const [draft, setDraft] = useState(sheet.draft);

  useEffect(() => {
    setDraft(sheet.draft);
    setAdvanced(sheet.mode === "edit");
  }, [sheet]);

  function updateDraft(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleQuickCreate() {
    upsertRecord({
      ...draft,
      date: toLocalDateInputValue(),
      time: toLocalTimeInputValue(),
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    upsertRecord(draft);
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-[rgba(31,24,15,0.28)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.section
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] px-4 pb-[calc(12px+env(safe-area-inset-bottom))]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            <div className="overflow-hidden rounded-[30px] border border-white/70 bg-[var(--panel)]/96 p-5 shadow-[0_-14px_40px_rgba(61,45,30,0.18)] backdrop-blur-xl">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
                    {sheet.mode === "edit" ? "编辑记录" : "快速打卡"}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                    {sheet.mode === "edit" ? "更新这条肠道动态" : "今天肠道汇报了吗？"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    你可以一键记录当前时间，也可以补充细节，让节律观察更完整。
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-white/70 p-2 text-[var(--muted)] transition hover:bg-white"
                  onClick={onClose}
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>

              {sheet.mode === "create" ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  className="shine-card mb-4 flex w-full items-center justify-between rounded-[24px] bg-[linear-gradient(135deg,#6f9d66_0%,#9aba7f_100%)] px-4 py-4 text-left text-white shadow-[0_18px_32px_rgba(103,143,87,0.28)]"
                  onClick={handleQuickCreate}
                >
                  <div>
                    <p className="text-sm text-white/78">立刻记为现在</p>
                    <p className="mt-1 text-xl font-semibold">今天拉了</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm">
                    <Clock3 className="h-4 w-4" />
                    当前时间
                  </span>
                </motion.button>
              ) : null}

              <button
                type="button"
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3 py-2 text-sm font-medium text-[var(--ink)]"
                onClick={() => setAdvanced((current) => !current)}
              >
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                {advanced ? "收起详细信息" : "补充状态和备注"}
              </button>

              <AnimatePresence initial={false}>
                {advanced ? (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="space-y-4 overflow-hidden"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <label className="field-card">
                        <span className="field-label">日期</span>
                        <input
                          className="field-input"
                          type="date"
                          value={draft.date}
                          onChange={(event) => updateDraft("date", event.target.value)}
                        />
                      </label>
                      <label className="field-card">
                        <span className="field-label">时间</span>
                        <input
                          className="field-input"
                          type="time"
                          value={draft.time}
                          onChange={(event) => updateDraft("time", event.target.value)}
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <p className="field-label">排便状态</p>
                      <div className="grid grid-cols-3 gap-2">
                        {statusOptions.map((option) => {
                          const active = draft.status === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              className={`rounded-[22px] border px-3 py-3 text-left transition ${
                                active
                                  ? "border-[rgba(111,157,102,0.45)] bg-[rgba(111,157,102,0.12)] shadow-[0_12px_24px_rgba(111,157,102,0.12)]"
                                  : "border-[var(--line)] bg-[var(--surface)]"
                              }`}
                              onClick={() => updateDraft("status", option.value)}
                            >
                              <div className="text-sm font-medium text-[var(--ink)]">{option.label}</div>
                              <div className="mt-1 text-xs text-[var(--muted)]">{option.hint}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="field-card">
                      <span className="field-label">备注</span>
                      <textarea
                        className="field-input min-h-24 resize-none"
                        placeholder="例如：今天晚一些、喝水有点少、作息刚恢复。"
                        value={draft.note}
                        onChange={(event) => updateDraft("note", event.target.value)}
                      />
                    </label>

                    <button type="submit" className="primary-button w-full">
                      {sheet.mode === "edit" ? "保存修改" : "完成记录"}
                    </button>
                  </motion.form>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
