import { createContext, startTransition, useContext, useEffect, useState } from "react";

import { exportAppState, loadAppState, normalizeAppState, saveAppState } from "../lib/storage";
import { parseRecordDateTime, toLocalDateInputValue, toLocalTimeInputValue } from "../lib/date";

const AppStoreContext = createContext(null);

function createDraft(record) {
  return {
    id: record?.id ?? null,
    date: record?.date ?? toLocalDateInputValue(),
    time: record?.time ?? toLocalTimeInputValue(),
    status: record?.status ?? "smooth",
    note: record?.note ?? "",
  };
}

export function AppStoreProvider({ children }) {
  const [state, setState] = useState(loadAppState);
  const [sheet, setSheet] = useState({ open: false, mode: "create", draft: createDraft() });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");

    if (state.settings.theme === "system") {
      const query = window.matchMedia("(prefers-color-scheme: dark)");
      root.classList.add(query.matches ? "theme-dark" : "theme-light");
      return;
    }

    root.classList.add(state.settings.theme === "dark" ? "theme-dark" : "theme-light");
  }, [state.settings.theme]);

  useEffect(() => {
    if (!toasts.length) return undefined;
    const timeout = window.setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 2600);
    return () => window.clearTimeout(timeout);
  }, [toasts]);

  function pushToast(toast) {
    setToasts((current) => [
      ...current,
      {
        id: `toast_${Date.now()}`,
        tone: "default",
        ...toast,
      },
    ]);
  }

  function openQuickCreate() {
    setSheet({ open: true, mode: "create", draft: createDraft() });
  }

  function openEdit(record) {
    setSheet({ open: true, mode: "edit", draft: createDraft(record) });
  }

  function closeSheet() {
    setSheet((current) => ({ ...current, open: false }));
  }

  function upsertRecord(payload) {
    const timestamp = parseRecordDateTime(payload.date, payload.time).getTime();
    const record = {
      id: payload.id ?? `record_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`,
      date: payload.date,
      time: payload.time,
      timestamp,
      status: payload.status,
      note: payload.note.trim(),
    };

    setState((current) => {
      const records = current.records.filter((item) => item.id !== record.id);
      const next = {
        ...current,
        records: [record, ...records].sort((a, b) => b.timestamp - a.timestamp),
      };
      return next;
    });

    closeSheet();
    pushToast({
      title: payload.id ? "记录已更新" : "今天已成功打卡",
      description: payload.id ? "这条排便记录已经替换为新的内容。" : "新的肠道动态已经加入时间线。",
    });
  }

  function deleteRecord(recordId) {
    setState((current) => ({
      ...current,
      records: current.records.filter((item) => item.id !== recordId),
    }));
    pushToast({
      title: "记录已删除",
      description: "这条记录已从你的私密时间线中移除。",
    });
  }

  function updateSettings(patch) {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        ...patch,
      },
    }));
  }

  function updateThreshold(key, value) {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        thresholds: {
          ...current.settings.thresholds,
          [key]: value,
        },
      },
    }));
  }

  async function importState(file) {
    const text = await file.text();
    const payload = JSON.parse(text);
    startTransition(() => {
      setState(normalizeAppState(payload));
      pushToast({
        title: "数据已导入",
        description: "新的本地记录已经接管当前视图。",
      });
    });
  }

  function downloadState() {
    const json = exportAppState(state);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bowel-buddy-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    pushToast({
      title: "导出已准备好",
      description: "JSON 文件已经开始下载。",
    });
  }

  return (
    <AppStoreContext.Provider
      value={{
        records: state.records,
        settings: state.settings,
        sheet,
        toasts,
        openQuickCreate,
        openEdit,
        closeSheet,
        upsertRecord,
        deleteRecord,
        updateSettings,
        updateThreshold,
        importState,
        downloadState,
        pushToast,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const value = useContext(AppStoreContext);
  if (!value) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return value;
}
