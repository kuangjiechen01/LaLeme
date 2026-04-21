import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AppStoreProvider } from "./hooks/useAppStore";
import "./styles.css";

function purgeLegacyOfflineData() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().catch(() => null);
      });
    }).catch(() => null);
  }

  if ("caches" in window) {
    window.caches.keys().then((keys) => {
      keys.forEach((key) => {
        window.caches.delete(key).catch(() => null);
      });
    }).catch(() => null);
  }
}

window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();

  const onceKey = "bowel-buddy-preload-retried";
  const hasRetried = window.sessionStorage.getItem(onceKey) === "1";

  if (hasRetried) {
    window.sessionStorage.removeItem(onceKey);
    return;
  }

  window.sessionStorage.setItem(onceKey, "1");
  window.location.reload();
});

window.addEventListener("pageshow", () => {
  window.sessionStorage.removeItem("bowel-buddy-preload-retried");
});

purgeLegacyOfflineData();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppStoreProvider>
        <App />
      </AppStoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
