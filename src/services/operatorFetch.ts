import { operatorKey } from "./a2aApi";

/**
 * Attach the operator key to mutating agent-runtime proxy calls (/api/agents/{id}/...), which the
 * backend protects when Agent360:Security:ProtectRuntimeProxyWrites is on. Uses a dedicated header so
 * existing Authorization headers are never overwritten. Reads and other origins are untouched.
 */
// Mirrors the backend OperatorWriteGuardMiddleware + runtime proxy guard. Chat send/stop, uploads and the
// turn-telemetry beacon stay open server-side, so they are not listed here.
const PROTECTED = new RegExp(
  "^/api(?:/v\\d+)?/(?:" +
    [
      "agents/[^/]+/(?:agent-status|config/|cron/|mcp|tools|skills|workspace/|memory|compact-context|active-model|media/send)",
      "agents/(?:approvals/|compact-context|iam/)",
      "approvals/",
      "libraries/skills/",
      "mcps/",
      "tools/",
      "schedules/",
      "media/",
      "chats/[^/]+/share",
      "integrations/",
      "mcp(?:/|$)",
    ].join("|") +
    ")"
);
const WRITE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function installOperatorFetch(): void {
  if (typeof window === "undefined" || (window.fetch as any).__agent360Operator) return;
  const original = window.fetch.bind(window);
  const wrapped = (input: RequestInfo | URL, init?: RequestInit) => {
    const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
    const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(raw, window.location.origin);
    const key = operatorKey.get();
    const token = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("skyer_access_token") : null;

    if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) {
      const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (key && WRITE.has(method) && PROTECTED.test(url.pathname) && !headers.has("X-Agent360-Operator-Token")) {
        headers.set("X-Agent360-Operator-Token", key);
      }
      return original(input, { ...init, headers });
    }

    if (!key || !WRITE.has(method)) return original(input, init);
    const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin || !PROTECTED.test(url.pathname)) return original(input, init);
    const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
    if (!headers.has("X-Agent360-Operator-Token")) headers.set("X-Agent360-Operator-Token", key);
    return original(input, { ...init, headers });
  };
  (wrapped as any).__agent360Operator = true;
  window.fetch = wrapped as typeof window.fetch;
}
