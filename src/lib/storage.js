import { createSampleState } from "../data/mockData";
import { parseRecordDateTime } from "./date";

export const STORAGE_KEY = "bowel-buddy-state-v1";

function normalizeRecord(record) {
  const date = record?.date;
  const time = record?.time;
  if (!date || !time) return null;

  const timestamp =
    typeof record.timestamp === "number"
      ? record.timestamp
      : parseRecordDateTime(date, time).getTime();

  return {
    id: record.id ?? `record_${Math.random().toString(36).slice(2, 10)}`,
    date,
    time,
    timestamp,
    status: ["smooth", "normal", "difficult"].includes(record.status)
      ? record.status
      : "normal",
    note: typeof record.note === "string" ? record.note : "",
  };
}

function normalizeSettings(settings) {
  return {
    reminderTime: settings?.reminderTime ?? "20:30",
    thresholds: {
      noRecordDays: Number(settings?.thresholds?.noRecordDays ?? 2),
      minWeeklyCount: Number(settings?.thresholds?.minWeeklyCount ?? 3),
    },
    tone: ["formal", "gentle", "light"].includes(settings?.tone)
      ? settings.tone
      : "gentle",
    theme: ["system", "light", "dark"].includes(settings?.theme)
      ? settings.theme
      : "system",
  };
}

export function normalizeAppState(payload) {
  return {
    version: 1,
    records: (payload?.records ?? [])
      .map(normalizeRecord)
      .filter(Boolean)
      .sort((a, b) => b.timestamp - a.timestamp),
    settings: normalizeSettings(payload?.settings ?? {}),
  };
}

export function loadAppState() {
  if (typeof window === "undefined") return createSampleState();
  const cached = window.localStorage.getItem(STORAGE_KEY);
  if (!cached) return createSampleState();

  try {
    return normalizeAppState(JSON.parse(cached));
  } catch {
    return createSampleState();
  }
}

export function saveAppState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportAppState(state) {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      ...state,
    },
    null,
    2,
  );
}
