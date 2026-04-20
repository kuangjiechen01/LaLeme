import { lazy, Suspense } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import AppShell from "./components/AppShell";
import ChunkErrorBoundary from "./components/ChunkErrorBoundary";

const DashboardPage = lazy(() => import("./sections/DashboardPage"));
const HistoryPage = lazy(() => import("./sections/HistoryPage"));
const InsightsPage = lazy(() => import("./sections/InsightsPage"));
const SettingsPage = lazy(() => import("./sections/SettingsPage"));

const routes = [
  { path: "/", label: "首页" },
  { path: "/history", label: "记录" },
  { path: "/insights", label: "统计" },
  { path: "/settings", label: "设置" },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell
      currentPath={location.pathname}
      routes={routes}
      onNavigate={navigate}
    >
      <ChunkErrorBoundary resetKey={location.pathname}>
        <Suspense
          fallback={
            <div className="section-card flex min-h-[220px] items-center justify-center text-sm text-[var(--muted)]">
              正在整理这一页的内容…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </ChunkErrorBoundary>
    </AppShell>
  );
}
