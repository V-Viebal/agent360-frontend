/**
 * Browser stream auth contract: the live screencast WebSocket authenticates via ?access_token=, which the
 * authFetch wrapper never sees. Every (re)connect must renew an expiring token first, otherwise a tab that
 * outlives its 1h Logto access token reconnects forever with 401 and the Computer view stays blank.
 */
import assert from "node:assert";
import { readFileSync } from "node:fs";

const auth = readFileSync(new URL("../src/services/authFetch.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");

assert.ok(/export async function ensureFreshAccessToken\(\)/.test(auth), "authFetch must export ensureFreshAccessToken");
const fn = auth.slice(auth.indexOf("export async function ensureFreshAccessToken"), auth.indexOf("Background silent renew loop"));
assert.ok(fn.includes("getOrRenewAccessToken()"), "ensureFreshAccessToken must use the single-flight refresh");
assert.ok(fn.includes("redirectToSignIn()"), "an unrenewable expired session must go to sign-in, not reconnect forever");

const getter = auth.slice(auth.indexOf("export function getStoredToken"), auth.indexOf("export function setStoredToken"));
assert.ok(/tokenExpiry\(fromLocal\) > tokenExpiry\(fromSession\)/.test(getter), "getStoredToken must prefer the newer cross-tab access token");
assert.ok(/key === REFRESH\) return fromLocal/.test(getter), "getStoredToken must use the latest rotated refresh token written by any tab");

const start = page.indexOf("const connectWs = async () => {");
assert.ok(start > 0, "browser stream connectWs must be async");
const head = page.slice(start, page.indexOf("agentBrowserStreamWsUrl(", start));
assert.ok(head.includes("await ensureFreshAccessToken()"), "connectWs must renew the token before building the stream URL");
assert.ok(page.slice(start, start + 12000).includes("reconnectTimer = setTimeout(connectWs, delayMs)"), "reconnects must re-run the async connectWs (token renewal included)");

// Runtime check of the cross-tab selection rule against real JWT-shaped tokens.
const mk = (exp) => `h.${Buffer.from(JSON.stringify({ exp })).toString("base64url")}.s`;
globalThis.atob = (b) => Buffer.from(b, "base64").toString("binary");
const tokenExpiry = new Function("token", auth.slice(auth.indexOf("function tokenExpiry"), auth.indexOf("export function getStoredToken")).replace(/^function tokenExpiry\(token: string \| null\): number \{/, "").replace(/\}\s*$/, ""));
assert.strictEqual(tokenExpiry(mk(200)), 200);
assert.strictEqual(tokenExpiry("garbage"), 0);
assert.ok(tokenExpiry(mk(300)) > tokenExpiry(mk(100)));

console.log("✔ browser stream token freshness contract passed");
