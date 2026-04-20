import { motion } from "framer-motion";
import { Activity, CalendarDays, Clock4, Flame, Waves } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";

import EmptyState from "../components/EmptyState";
import SectionCard from "../components/SectionCard";
import { useAppStore } from "../hooks/useAppStore";
import {
  getRhythmHighlights,
  getSevenDayChart,
  getSummary,
  getTimeDistribution,
  getWeekdayTrend,
} from "../lib/analytics";

const chartTabs = [
  { label: "最近 7 天", value: 7 },
  { label: "最近 30 天", value: 30 },
];

function BasicTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[18px] border border-white/60 bg-[rgba(255,255,255,0.92)] px-3 py-2 text-xs shadow-[0_16px_30px_rgba(89,71,50,0.12)] dark:bg-[rgba(29,32,29,0.94)]">
      <div className="font-medium text-[var(--ink)]">{label ?? payload[0]?.name}</div>
      <div className="mt-1 text-[var(--muted)]">{payload[0].value} 次</div>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, hint }) {
  return (
    <div className="stat-pill">
      <div className="stat-pill-icon">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-4 text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[var(--ink)]">{value}</div>
      <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{hint}</div>
    </div>
  );
}

export default function InsightsPage() {
  const { records, settings } = useAppStore();
  const [days, setDays] = useState(7);
  const summary = getSummary(records, settings);
  const rhythmHighlights = getRhythmHighlights(records);
  const frequencyChart = getSevenDayChart(records, days);
  const weekdayChart = getWeekdayTrend(records);
  const timeDistribution = getTimeDistribution(records);

  return (
    <div className="space-y-4">
      <section className="page-header-card">
        <div>
          <p className="page-eyebrow">统计分析</p>
          <h1 className="page-title">观察频率，也观察节律</h1>
          <p className="page-description">
            用更柔和的方式看数据，知道自己最近是稳定、拖延，还是只是作息在变化。
          </p>
        </div>
      </section>

      <SectionCard className="overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--accent-strong) ${summary.rhythmScore * 3.6}deg, rgba(197,184,162,0.35) 0deg)`,
              }}
            />
            <div className="absolute inset-[10px] rounded-full bg-[var(--panel)]" />
            <div className="relative text-center">
              <div className="text-3xl font-semibold text-[var(--ink)]">{summary.rhythmScore}</div>
              <div className="text-xs text-[var(--muted)]">规律度</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-[22px] bg-[var(--surface-soft)] px-4 py-3">
              <div className="text-sm font-medium text-[var(--ink)]">节律观察</div>
              <div className="mt-2 text-sm leading-6 text-[var(--muted)]">
                常见活跃时段在 <span className="font-semibold text-[var(--ink)]">{rhythmHighlights.activeWindow}</span>，
                平均记录时间约 <span className="font-semibold text-[var(--ink)]">{rhythmHighlights.averageTime}</span>。
              </div>
            </div>
            <div className="mt-3 flex gap-3 text-xs text-[var(--muted)]">
              <span className="rounded-full bg-[rgba(111,157,102,0.12)] px-3 py-2 text-[var(--success)]">
                连续记录 {summary.consecutiveDays} 天
              </span>
              <span className="rounded-full bg-[rgba(175,132,94,0.12)] px-3 py-2 text-[var(--accent)]">
                平均 {summary.avgDaily} 次/日
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3">
        <StatPill icon={Activity} label="今日次数" value={summary.todayCount} hint="今天已记录" />
        <StatPill icon={CalendarDays} label="最近 7 天" value={summary.weeklyCount} hint="总记录次数" />
        <StatPill icon={Flame} label="最近 30 天" value={summary.monthlyCount} hint="总记录次数" />
        <StatPill icon={Clock4} label="距上次" value={summary.lastSince} hint="上次排便已经过去" />
      </div>

      <SectionCard eyebrow="频率变化" title="最近记录趋势">
        {records.length ? (
          <>
            <div className="mb-4 flex rounded-[22px] bg-[var(--surface-soft)] p-1">
              {chartTabs.map((tab) => {
                const active = days === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    className={`relative flex-1 rounded-[18px] px-3 py-2 text-sm font-medium ${
                      active ? "text-[var(--ink)]" : "text-[var(--muted)]"
                    }`}
                    onClick={() => setDays(tab.value)}
                  >
                    {active ? (
                      <motion.span
                        layoutId="insight-range"
                        className="absolute inset-0 rounded-[18px] bg-white shadow-[0_10px_22px_rgba(91,74,53,0.10)] dark:bg-white/8"
                      />
                    ) : null}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frequencyChart} barGap={10}>
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    interval={days === 30 ? 4 : 0}
                    minTickGap={days === 30 ? 18 : 10}
                    tick={{ fill: "var(--muted)", fontSize: 11 }}
                  />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} width={26} />
                  <Tooltip content={<BasicTooltip />} cursor={{ fill: "rgba(111,157,102,0.08)" }} />
                  <Bar dataKey="count" radius={[14, 14, 6, 6]} fill="#7fab6e" animationDuration={780} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <EmptyState
            compact
            title="还没有统计数据"
            description="先添加一条记录，趋势图和节律观察就会慢慢出现。"
          />
        )}
      </SectionCard>

      <SectionCard eyebrow="节律分布" title="哪几天、哪个时段更常见">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] bg-[var(--surface-soft)] p-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
              <Waves className="h-4 w-4 text-[var(--accent)]" />
              一周趋势
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekdayChart}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} width={26} />
                  <Tooltip content={<BasicTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#b07a53"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#b07a53" }}
                    activeDot={{ r: 5, fill: "#7fab6e" }}
                    animationDuration={820}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[24px] bg-[var(--surface-soft)] p-3">
            <div className="mb-3 text-sm font-medium text-[var(--ink)]">常见排便时段</div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeDistribution}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={44}
                    outerRadius={70}
                    paddingAngle={4}
                    animationDuration={860}
                  >
                    {timeDistribution.map((item) => (
                      <Cell key={item.label} fill={item.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<BasicTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {timeDistribution.map((item) => (
                <div key={item.label} className="rounded-[18px] bg-white/70 px-3 py-2 text-xs dark:bg-white/6">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.fill }} />
                    <span className="text-[var(--ink)]">{item.label}</span>
                  </div>
                  <div className="mt-1 text-[var(--muted)]">{item.value} 次</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
