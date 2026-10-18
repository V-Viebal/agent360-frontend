import { operatorKey } from "./a2aApi";

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
// Reads the backend protects (Admin agent list, chat/workspace history): an unlocked operator key satisfies them
// when there is no Logto session, so the operator console keeps working without SSO.
const PROTECTED_READ = /^\/api(?:\/v\d+)?\/agents(?:$|\/[^/]+\/(?:chats|workspace))/;

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
      if (key && !headers.has("X-Agent360-Operator-Token") &&
          ((WRITE.has(method) && PROTECTED.test(url.pathname)) || (!token && !WRITE.has(method) && PROTECTED_READ.test(url.pathname)))) {
        headers.set("X-Agent360-Operator-Token", key);
      }
      return original(input, { ...init, headers });
    }

    if (!key || !WRITE.has(method)) return original(input, init);
    if (url.origin !== window.location.origin || !PROTECTED.test(url.pathname)) return original(input, init);
    const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
    if (!headers.has("X-Agent360-Operator-Token")) headers.set("X-Agent360-Operator-Token", key);
    return original(input, { ...init, headers });
  };
  (wrapped as any).__agent360Operator = true;
  window.fetch = wrapped as typeof window.fetch;
}
