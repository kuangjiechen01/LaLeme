import { AnimatePresence, motion } from "framer-motion";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import EmptyState from "../components/EmptyState";
import SectionCard from "../components/SectionCard";
import { useAppStore } from "../hooks/useAppStore";
import { groupRecordsByDate, STATUS_META, getHistoryRangeRecords } from "../lib/analytics";
import { relativeDateLabel } from "../lib/date";

const tabs = [
  { label: "今天", value: "today" },
  { label: "最近 7 天", value: "7" },
  { label: "最近 30 天", value: "30" },
  { label: "全部", value: "all" },
];

export default function HistoryPage() {
  const { records, openEdit, openQuickCreate, deleteRecord } = useAppStore();
  const [range, setRange] = useState("7");
  const [pendingDelete, setPendingDelete] = useState(null);
  const filtered = getHistoryRangeRecords(records, range);
  const grouped = groupRecordsByDate(filtered);

  return (
    <div className="space-y-4">
      <section className="page-header-card">
        <div>
          <p className="page-eyebrow">历史记录</p>
          <h1 className="page-title">你的肠道动态时间线</h1>
          <p className="page-description">
            记录会按时间自动排序。需要回顾、修改，或者删除，都可以在这里完成。
          </p>
        </div>
        <button type="button" className="secondary-button shrink-0" onClick={openQuickCreate}>
          <Plus className="h-4 w-4" />
          新增
        </button>
      </section>

      <SectionCard>
        <div className="rounded-[24px] bg-[var(--surface-soft)] p-1">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map((tab) => {
              const active = range === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  className={`relative rounded-[18px] px-2 py-3 text-xs font-medium transition ${
                    active ? "text-[var(--ink)]" : "text-[var(--muted)]"
                  }`}
                  onClick={() => setRange(tab.value)}
                >
                  {active ? (
                    <motion.span
                      layoutId="history-tab"
                      className="absolute inset-0 rounded-[18px] bg-white shadow-[0_10px_22px_rgba(91,74,53,0.10)] dark:bg-white/8"
                    />
                  ) : null}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="已筛选"
        title={filtered.length ? `共找到 ${filtered.length} 条记录` : "这个时间范围里还没有记录"}
      >
        {filtered.length ? (
          <div className="space-y-4">
            {grouped.map((group) => (
              <div key={group.date}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="text-sm font-semibold text-[var(--ink)]">
                    {relativeDateLabel(group.date)}
                  </div>
                  <div className="h-px flex-1 bg-[var(--line)]" />
                </div>
                <div className="space-y-3">
                  {group.records.map((record) => {
                    const meta = STATUS_META[record.status];
                    return (
                      <motion.article
                        key={record.id}
                        layout
                        className="timeline-card"
                        whileTap={{ scale: 0.985 }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-1 text-xs font-medium text-[var(--muted)] dark:bg-white/6">
                              <span className="h-2 w-2 rounded-full" style={{ background: meta.accent }} />
                              {record.time}
                            </div>
                            <div
                              className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium"
                              style={{ background: meta.soft, color: meta.accent }}
                            >
                              {meta.label}
                            </div>
                            <p className="mt-3 text-sm leading-6 text-[var(--ink)]">
                              {record.note || "这次没有留下备注。"}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              className="icon-button"
                              onClick={() => openEdit(record)}
                              aria-label="编辑记录"
                            >
                              <PencilLine className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="icon-button text-[var(--warning)]"
                              onClick={() => setPendingDelete(record)}
                              aria-label="删除记录"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="你的肠胃在等一条新动态"
            description="当前筛选范围里还没有内容。先记下一次，再回来看看自己的节律变化。"
            actionLabel="去记录一条"
            onAction={openQuickCreate}
          />
        )}
      </SectionCard>

      <AnimatePresence>
        {pendingDelete ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-[rgba(26,18,11,0.24)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingDelete(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-6 z-50 mx-auto max-w-[420px] px-4"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
            >
              <div className="rounded-[28px] border border-white/70 bg-[var(--panel)]/96 p-5 shadow-[0_22px_42px_rgba(81,60,40,0.16)] backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-[var(--ink)]">确认删除这条记录？</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  删除后不会自动恢复。你也可以先导出 JSON 备份，再进行整理。
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button type="button" className="secondary-button justify-center" onClick={() => setPendingDelete(null)}>
                    先保留
                  </button>
                  <button
                    type="button"
                    className="danger-button justify-center"
                    onClick={() => {
                      deleteRecord(pendingDelete.id);
                      setPendingDelete(null);
                    }}
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
