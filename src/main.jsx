import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import App from "./App";
import { AppStoreProvider } from "./hooks/useAppStore";
import "./styles.css";

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

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppStoreProvider>
        <App />
      </AppStoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
