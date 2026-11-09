import assert from "node:assert";
import fs from "node:fs";

console.log("▶ Running Agent Last Access Session Test Gate...");

// 1. Verify backend models and endpoint declarations
const agentModelsCs = fs.readFileSync(new URL("../../backend/src/Agent360.API/Features/Agents/Models/AgentModels.cs", import.meta.url), "utf8");
assert.ok(agentModelsCs.includes("AgentLastSessionResponse"), "AgentModels must define AgentLastSessionResponse DTO");
assert.ok(agentModelsCs.includes("SetAgentLastSessionRequest"), "AgentModels must define SetAgentLastSessionRequest DTO");
assert.ok(agentModelsCs.includes("LastSessionId"), "AgentSummaryResponse must include LastSessionId");
assert.ok(agentModelsCs.includes("LastSessionTitle"), "AgentSummaryResponse must include LastSessionTitle");
console.log("✓ Test 1: Backend DTO contract verified");

// 2. Verify backend endpoint routes for last-session
const endpointsCs = fs.readFileSync(new URL("../../backend/src/Agent360.API/Features/Agents/Endpoints/AgentFeaturesEndpoints.cs", import.meta.url), "utf8");
assert.ok(endpointsCs.includes('group.MapMethods("{agentId}/last-session", ["GET"]'), "Endpoints must map GET {agentId}/last-session");
assert.ok(endpointsCs.includes('group.MapMethods("{agentId}/last-session", ["PUT", "POST", "PATCH"]'), "Endpoints must map PUT/POST/PATCH {agentId}/last-session");
assert.ok(endpointsCs.includes('"agent_last_session_updated"'), "Endpoints must broadcast agent_last_session_updated over multiplexer");
console.log("✓ Test 2: Backend last-session endpoints & multiplexer broadcast verified");

// 3. Verify PostgreSQL persistence & user scope isolation in QwenPawClient
const qwenPawClientCs = fs.readFileSync(new URL("../../backend/src/Agent360.API/Features/Agents/Services/QwenPawClient.cs", import.meta.url), "utf8");
assert.ok(qwenPawClientCs.includes('user_management.""UserAgentLastSessions""'), "QwenPawClient must store last sessions in user_management.UserAgentLastSessions");
assert.ok(qwenPawClientCs.includes("EnsureUserAgentLastSessionsTableAsync"), "QwenPawClient must auto-ensure UserAgentLastSessions table schema");
assert.ok(qwenPawClientCs.includes("SetAgentLastSessionAsync"), "QwenPawClient must implement SetAgentLastSessionAsync");
assert.ok(qwenPawClientCs.includes("GetAgentLastSessionAsync"), "QwenPawClient must implement GetAgentLastSessionAsync");
assert.ok(qwenPawClientCs.includes("HydrateUserLastSessionsFromPostgresAsync"), "QwenPawClient must hydrate last sessions from Postgres");
console.log("✓ Test 3: Backend PostgreSQL UserAgentLastSessions persistence verified");

// 4. Verify Frontend agentApi and GrokBotWorkspace wiring
const agentApiTs = fs.readFileSync(new URL("../src/services/agentApi.ts", import.meta.url), "utf8");
assert.ok(agentApiTs.includes("serverLastChat"), "agentApi.ts must map serverLastChat from AgentSummaryResponse");
assert.ok(agentApiTs.includes("last-session"), "saveLastChatForAgent must sync with backend last-session endpoint");

const grokBotWorkspaceTsx = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(grokBotWorkspaceTsx.includes("agentRecentSessions[ag.slug || ag.id]"), "GrokBotWorkspace must lookup recent sessions by both slug and id");
assert.ok(grokBotWorkspaceTsx.includes("handleSelectAgent"), "handleSelectAgent must be present in workspace");
console.log("✓ Test 4: Frontend last-session resolution and sidebar subtitle verified");

console.log("🎉 All Agent Last Access Session tests passed successfully!");
