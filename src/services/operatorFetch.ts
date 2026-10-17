import { operatorKey } from "./a2aApi";

/**
 * Attach the operator key to mutating agent-runtime proxy calls (/api/agents/{id}/...), which the
 * backend protects when Agent360:Security:ProtectRuntimeProxyWrites is on. Uses a dedicated header so
 * existing Authorization headers are never overwritten. Reads and other origins are untouched.
 */
const PROTECTED = /^\/api\/agents\/[^/]+\/(agent-status|config\/|cron\/|mcp|tools|skills|workspace\/|memory)/;
const WRITE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function installOperatorFetch(): void {
  if (typeof window === "undefined" || (window.fetch as any).__agent360Operator) return;
  const original = window.fetch.bind(window);
  const wrapped = (input: RequestInfo | URL, init?: RequestInit) => {
    const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
    const key = operatorKey.get();
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
