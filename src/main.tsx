import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { installOperatorFetch } from "./services/operatorFetch";
import { installAuthFetch } from "./services/authFetch";

// authFetch (outer): token refresh on Bearer 401 + sign-in redirect; operatorFetch (inner): attaches tokens.
installOperatorFetch();
installAuthFetch();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

declare const __APP_BUILD__: string;

// Register Progressive Web App Service Worker for offline resilience
if ("serviceWorker" in navigator && !window.location.host.includes("localhost") && !window.location.host.includes("127.0.0.1") && !window.location.host.startsWith("172.")) {
  window.addEventListener("load", () => {
    // Versioned URL + updateViaCache:none: a new build always installs a new SW even if a CDN or the
    // browser still holds an old /sw.js; reload once when the new SW takes control.
    const build = typeof __APP_BUILD__ !== "undefined" ? __APP_BUILD__ : "dev";
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (hadController && !reloaded) {
        reloaded = true;
        window.location.reload();
      }
    });
    navigator.serviceWorker
      .register(`/sw.js?v=${encodeURIComponent(build)}`, { updateViaCache: "none" })
      .then((reg) => reg.update())
      .catch((err) => {
        console.warn("SW registration failed: ", err);
      });
  });
}
