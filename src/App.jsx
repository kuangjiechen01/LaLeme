import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import AppShell from "./components/AppShell";
import ChunkErrorBoundary from "./components/ChunkErrorBoundary";
import DashboardPage from "./sections/DashboardPage";
import HistoryPage from "./sections/HistoryPage";
import InsightsPage from "./sections/InsightsPage";
import SettingsPage from "./sections/SettingsPage";

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
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </ChunkErrorBoundary>
    </AppShell>
  );
}
