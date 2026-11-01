/**
 * Agent desktop viewer contract: Skyer must only iframe/open signed `/a360/{token}/`
 * URLs. The bare Selkies host is protected by Basic Auth and shows an admin prompt.
 */
import assert from "node:assert";
import { readFileSync } from "node:fs";

const api = readFileSync(new URL("../src/services/agentBrowserApi.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");

const m = api.match(/\/\^\\\/a360\\\/\[\^\/\]\+\\\/\?\$\//);
assert.ok(m, "isSignedAgentDesktopUrl must match only /a360/{token}/ paths");
const re = /^\/a360\/[^/]+\/?$/;
assert.ok(re.test("/a360/abc.def/"));
assert.ok(!re.test("/"));
assert.ok(!re.test("/a360/"));
assert.ok(!re.test("/vnc.html"));

assert.ok(api.includes("if (!isSignedAgentDesktopUrl(body.url)) throw"), "issueAgentDesktopUrl must reject unsigned URLs");

// No Selkies iframe/window may ever point at a bare desktop host. Either the page issues signed URLs
// (and the failure path keeps the CDP preview) or it does not iframe the desktop at all (CDP screencast).
const start = page.indexOf('issueAgentDesktopUrl(agentId, mode === "shared" ? "watch" : "control")');
if (start > 0) {
  const block = page.slice(start, page.indexOf("return () => { alive = false; };", start));
  assert.ok(!/setSrc\(`\$\{url/.test(block), "failure path must never iframe the bare viewer host");
  assert.ok(block.includes('setError(e instanceof DesktopAuthError ? "auth"'), "failure path must show the auth/preview fallback");
}
for (const m of page.matchAll(/<iframe[\s\S]{0,400}?src=\{([^}]+)\}/g)) {
  assert.ok(!/browserTarget\.url|\burl\b(?!\w)/.test(m[1]) || /src\b/.test(m[1]), `iframe must not load a bare desktop URL: ${m[1]}`);
}
assert.ok(!/window\.open\(\s*(browserTarget\.url|info\.viewerUrl)/.test(page), "never open a bare desktop host in a new tab");

console.log("✔ agent desktop signed-URL contract passed");
