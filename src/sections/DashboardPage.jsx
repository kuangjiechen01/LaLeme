import { motion } from "framer-motion";
import {
  ArrowRight,
  BellDot,
  ChartColumnBig,
  ChevronRight,
  Clock3,
  HeartPulse,
  Plus,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { Bar, BarChart, Tooltip, XAxis } from "recharts";
import { useNavigate } from "react-router-dom";

import ChartSurface from "../components/ChartSurface";
import SectionCard from "../components/SectionCard";
import { useAppStore } from "../hooks/useAppStore";
import { formatHeroDate, formatLastRecord } from "../lib/date";
import { getSevenDayChart, getSummary } from "../lib/analytics";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[18px] border border-white/65 bg-[rgba(255,255,255,0.92)] px-3 py-2 text-xs shadow-[0_16px_30px_rgba(89,71,50,0.12)] dark:bg-[rgba(29,32,29,0.94)]">
      <div className="font-medium text-[var(--ink)]">{label}</div>
      <div className="mt-1 text-[var(--muted)]">记录 {payload[0].value} 次</div>
    </div>
  );
}

function ShortcutCard({ icon: Icon, title, description, onClick }) {
  return (
    <button type="button" className="group shortcut-card" onClick={onClick}>
      <div className="shortcut-icon">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-left">
        <div className="font-semibold text-[var(--ink)]">{title}</div>
        <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{description}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-[var(--muted)] transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}

export default function DashboardPage() {
  const { records, settings, openQuickCreate } = useAppStore();
  const navigate = useNavigate();
  const summary = getSummary(records, settings);
  const chartData = getSevenDayChart(records, 7);

  return (
    <div className="space-y-4 pb-2">
      <section className="hero-card overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(111,157,102,0.18),transparent_42%)]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
            拉了么
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[30px] font-semibold leading-[1.08] tracking-tight text-[var(--ink)]">
                今天肠道
                <br />
                汇报了吗？
              </h1>
              <p className="mt-3 max-w-[250px] text-sm leading-6 text-[var(--muted)]">
                一份私密、轻柔的节律观察。记录当下，也给未来的自己一个更清楚的身体线索。
              </p>
            </div>
            <div className="rounded-[26px] border border-white/55 bg-white/55 px-3 py-2 text-right shadow-[0_18px_26px_rgba(91,71,46,0.08)] dark:bg-white/6">
              <div className="text-xs text-[var(--muted)]">今天</div>
              <div className="mt-1 text-sm font-semibold text-[var(--ink)]">{formatHeroDate()}</div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard className="overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--muted)]">今日状态</p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-5xl font-semibold tracking-tight text-[var(--ink)]">
                {summary.todayCount}
              </span>
              <span className="pb-1 text-sm text-[var(--muted)]">次记录</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {summary.todayCount > 0
                ? `最近一次：${formatLastRecord(summary.lastRecord)}`
                : "今天还没有新的排便记录。"}
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            className="primary-button min-w-[136px] gap-2"
            onClick={openQuickCreate}
          >
            <Plus className="h-4 w-4" />
            今天拉了
          </motion.button>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3">
        <div className="mini-stat-card">
          <div className="mini-stat-icon bg-[rgba(111,157,102,0.12)] text-[var(--success)]">
            <ChartColumnBig className="h-4 w-4" />
          </div>
          <div className="mt-4 text-xs text-[var(--muted)]">最近 7 天</div>
          <div className="mt-2 text-2xl font-semibold text-[var(--ink)]">{summary.weeklyCount}</div>
          <div className="mt-1 text-xs leading-5 text-[var(--muted)]">总记录次数</div>
        </div>
        <div className="mini-stat-card">
          <div className="mini-stat-icon bg-[rgba(175,132,94,0.14)] text-[var(--accent)]">
            <Clock3 className="h-4 w-4" />
          </div>
          <div className="mt-4 text-xs text-[var(--muted)]">上一次</div>
          <div className="mt-2 text-xl font-semibold text-[var(--ink)]">{summary.lastSince}</div>
          <div className="mt-1 text-xs leading-5 text-[var(--muted)]">距离上次排便</div>
        </div>
      </div>

      <SectionCard
        eyebrow="节律速览"
        title="最近 7 天频率"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted)]"
            onClick={() => navigate("/insights")}
          >
            查看更多
            <ArrowRight className="h-4 w-4" />
          </button>
        }
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-3xl font-semibold text-[var(--ink)]">{summary.rhythmScore}</div>
            <div className="text-xs leading-5 text-[var(--muted)]">当前规律度评分</div>
          </div>
          <div className="rounded-[20px] bg-[var(--surface-soft)] px-3 py-2 text-right">
            <div className="text-xs text-[var(--muted)]">常见时段</div>
            <div className="mt-1 text-sm font-semibold text-[var(--ink)]">{summary.peakBucket}</div>
          </div>
        </div>
        <ChartSurface className="h-44">
          {({ width, height }) => (
            <BarChart width={width} height={height} data={chartData} barGap={8}>
              <XAxis
                axisLine={false}
                tickLine={false}
                dataKey="label"
                tick={{ fill: "var(--muted)", fontSize: 11 }}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(111,157,102,0.08)" }} />
              <Bar
                dataKey="count"
                radius={[14, 14, 6, 6]}
                fill="url(#dashboardBar)"
                maxBarSize={28}
                animationDuration={900}
              />
              <defs>
                <linearGradient id="dashboardBar" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7fab6e" />
                  <stop offset="100%" stopColor="#bed1a5" />
                </linearGradient>
              </defs>
            </BarChart>
          )}
        </ChartSurface>
      </SectionCard>

      <SectionCard
        eyebrow="温和提醒"
        title={summary.reminder.title}
        className={`reminder-card reminder-${summary.reminder.level}`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full bg-white/60 p-2 dark:bg-white/8">
            <BellDot className="h-4 w-4 text-[var(--accent-strong)]" />
          </div>
          <div className="space-y-2">
            <p className="text-sm leading-6 text-[var(--ink)]">{summary.reminder.message}</p>
            <p className="text-xs leading-5 text-[var(--muted)]">{summary.reminder.details}</p>
            <div className="inline-flex rounded-full bg-white/60 px-3 py-1.5 text-xs text-[var(--muted)] dark:bg-white/8">
              每日提醒时点：{settings.reminderTime}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="快捷入口" title="继续看看">
        <div className="space-y-3">
          <ShortcutCard
            icon={HeartPulse}
            title="历史记录"
            description="翻看今天、近 7 天或更久以前的动态。"
            onClick={() => navigate("/history")}
          />
          <ShortcutCard
            icon={ChartColumnBig}
            title="统计分析"
            description="观察频率、时段和规律度的变化。"
            onClick={() => navigate("/insights")}
          />
          <ShortcutCard
            icon={Settings2}
            title="提醒与设置"
            description="管理提醒阈值、语气风格和数据备份。"
            onClick={() => navigate("/settings")}
          />
        </div>
      </SectionCard>

      <div className="flex items-start gap-3 rounded-[24px] border border-white/60 bg-[rgba(255,255,255,0.72)] px-4 py-4 text-sm shadow-[0_16px_26px_rgba(97,79,53,0.08)] dark:bg-[rgba(31,35,31,0.7)]">
        <div className="rounded-full bg-[rgba(111,157,102,0.12)] p-2 text-[var(--success)]">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <p className="leading-6 text-[var(--muted)]">
          所有数据默认仅保存在你的设备里。这不是医疗诊断工具，而是一份日常健康记录。
        </p>
      </div>
    </div>
  );
}
