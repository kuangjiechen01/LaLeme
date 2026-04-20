import { useRef } from "react";
import { BellRing, Download, FileUp, LockKeyhole, MoonStar, Palette, Shield } from "lucide-react";

import SectionCard from "../components/SectionCard";
import { useAppStore } from "../hooks/useAppStore";

const tones = [
  { value: "formal", label: "正式", hint: "更克制、更稳定" },
  { value: "gentle", label: "温和", hint: "默认推荐，像认真设计过的产品文案" },
  { value: "light", label: "轻松", hint: "更柔和，也带一点轻盈感" },
];

const themes = [
  { value: "system", label: "跟随系统" },
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
];

function Stepper({ label, description, value, onChange, min = 1, max = 10, suffix }) {
  return (
    <div className="rounded-[22px] bg-[var(--surface-soft)] px-4 py-4">
      <div className="text-sm font-medium text-[var(--ink)]">{label}</div>
      <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{description}</div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-2xl font-semibold text-[var(--ink)]">
          {value}
          <span className="ml-1 text-sm text-[var(--muted)]">{suffix}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" className="step-button" onClick={() => onChange(Math.max(min, value - 1))}>
            -
          </button>
          <button type="button" className="step-button" onClick={() => onChange(Math.min(max, value + 1))}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    updateThreshold,
    downloadState,
    importState,
    pushToast,
  } = useAppStore();
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-4 pb-3">
      <section className="page-header-card">
        <div>
          <p className="page-eyebrow">设置</p>
          <h1 className="page-title">提醒、语气和数据都在这里</h1>
          <p className="page-description">
            这是一份给自己看的小工具，所以提醒可以柔一点，隐私也该交给自己掌控。
          </p>
        </div>
      </section>

      <SectionCard eyebrow="提醒设置" title="让提醒更贴合你">
        <div className="space-y-3">
          <label className="field-card">
            <span className="field-label">
              <BellRing className="h-4 w-4 text-[var(--accent)]" />
              提醒时间
            </span>
            <input
              className="field-input"
              type="time"
              value={settings.reminderTime}
              onChange={(event) => updateSettings({ reminderTime: event.target.value })}
            />
          </label>
          <div className="grid gap-3">
            <Stepper
              label="超过几天未记录提醒"
              description="如果超过这个天数仍无新记录，首页将出现温和提醒。"
              value={settings.thresholds.noRecordDays}
              suffix="天"
              onChange={(value) => updateThreshold("noRecordDays", value)}
            />
            <Stepper
              label="最近 7 天少于几次提醒"
              description="如果近 7 天总记录次数低于这个值，会提示你留意状态。"
              value={settings.thresholds.minWeeklyCount}
              suffix="次"
              onChange={(value) => updateThreshold("minWeeklyCount", value)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="界面与文案" title="让它更像你的产品">
        <div className="space-y-3">
          <div className="rounded-[22px] bg-[var(--surface-soft)] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
              <Palette className="h-4 w-4 text-[var(--accent)]" />
              文案风格
            </div>
            <div className="grid gap-2">
              {tones.map((tone) => {
                const active = settings.tone === tone.value;
                return (
                  <button
                    key={tone.value}
                    type="button"
                    className={`rounded-[20px] border px-4 py-3 text-left transition ${
                      active
                        ? "border-[rgba(111,157,102,0.45)] bg-[rgba(111,157,102,0.12)]"
                        : "border-[var(--line)] bg-white/70 dark:bg-white/5"
                    }`}
                    onClick={() => updateSettings({ tone: tone.value })}
                  >
                    <div className="font-medium text-[var(--ink)]">{tone.label}</div>
                    <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{tone.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[22px] bg-[var(--surface-soft)] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
              <MoonStar className="h-4 w-4 text-[var(--accent)]" />
              主题模式
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => {
                const active = settings.theme === theme.value;
                return (
                  <button
                    key={theme.value}
                    type="button"
                    className={`rounded-[18px] px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-[rgba(111,157,102,0.14)] text-[var(--ink)] shadow-[0_10px_18px_rgba(111,157,102,0.12)]"
                        : "bg-white/70 text-[var(--muted)] dark:bg-white/5"
                    }`}
                    onClick={() => updateSettings({ theme: theme.value })}
                  >
                    {theme.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="数据管理" title="导入与导出">
        <div className="space-y-3">
          <button type="button" className="settings-action" onClick={downloadState}>
            <span className="settings-action-icon">
              <Download className="h-4 w-4" />
            </span>
            <span>
              <span className="block font-medium text-[var(--ink)]">导出 JSON</span>
              <span className="mt-1 block text-xs text-[var(--muted)]">
                下载本地数据快照，方便备份或迁移到未来的云同步版本。
              </span>
            </span>
          </button>

          <button
            type="button"
            className="settings-action"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="settings-action-icon">
              <FileUp className="h-4 w-4" />
            </span>
            <span>
              <span className="block font-medium text-[var(--ink)]">导入 JSON</span>
              <span className="mt-1 block text-xs text-[var(--muted)]">
                选择之前导出的数据文件，本地视图会直接切换到新内容。
              </span>
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                await importState(file);
              } catch {
                pushToast({
                  title: "导入失败",
                  description: "这个文件看起来不是可识别的应用数据。",
                });
              } finally {
                event.target.value = "";
              }
            }}
          />
        </div>
      </SectionCard>

      <SectionCard eyebrow="隐私说明" title="这份记录只属于你">
        <div className="space-y-3 text-sm leading-6 text-[var(--muted)]">
          <div className="flex items-start gap-3 rounded-[22px] bg-[var(--surface-soft)] px-4 py-4">
            <span className="settings-action-icon">
              <LockKeyhole className="h-4 w-4" />
            </span>
            默认情况下，所有记录都保存在当前设备的本地浏览器中，不会自动上传。
          </div>
          <div className="flex items-start gap-3 rounded-[22px] bg-[var(--surface-soft)] px-4 py-4">
            <span className="settings-action-icon">
              <Shield className="h-4 w-4" />
            </span>
            本应用用于日常健康记录与习惯提醒，不提供医疗诊断建议；如果你有持续不适，请咨询专业医生。
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
