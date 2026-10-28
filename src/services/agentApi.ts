export function cleanModelDisplayName(rawModel: string): string {
  if (!rawModel) return "";
  let m = rawModel.trim();
  if (m.includes("/")) {
    m = m.split("/").pop()!;
  }
  return m;
}

import { InfraAgent, AgentSession, ChatMessage, SessionCollaborationRoom, SessionRoomTurn } from "../types/agent";
import { operatorKey } from "./a2aApi";
import { redirectToSignIn } from "./authFetch";
import { authConfig } from "../config/authConfig";

export const API_BASE_URL = "/api";

/** Thrown when the fleet list needs a (different) sign-in; callers show it instead of fake agents. */
export class AgentListAuthError extends Error {
  constructor(public status: number) {
    super(status === 403 ? "Your account is not allowed to view the agent fleet." : "Sign in to load your agents.");
  }
}

export function hasCredential(): boolean {
  try {
    return !!(sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || operatorKey.get());
  } catch {
    return false;
  }
}

async function waitForCredential(maxMs: number): Promise<void> {
  const start = Date.now();
  while (!hasCredential() && Date.now() - start < maxMs) {
    await new Promise((r) => setTimeout(r, 150));
  }
}

export function getAuthHeaders(agentId?: string): Record<string, string> {
  let token = "";
  let opToken = "";
  try {
    token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || "";
    if (!token) {
      opToken = localStorage.getItem("agent360.a2a.operatorKey") || localStorage.getItem("operator_token") || operatorKey.get() || "";
    }
  } catch {}

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (opToken) {
    headers["X-Agent360-Operator-Token"] = opToken;
    headers["X-Operator-Token"] = opToken;
  }
  if (agentId) {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    headers["X-Agent-Id"] = cleanId;
  }
  return headers;
}

export async function authorizedFetch(url: string, init?: RequestInit, agentId?: string): Promise<Response> {
  const authHeaders = getAuthHeaders(agentId);
  const headers = new Headers(init?.headers || {});
  for (const [key, value] of Object.entries(authHeaders)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }
  return fetch(url, { ...init, headers });
}

export async function fetchInfraAgents(): Promise<InfraAgent[]> {
  // Real data only: a failed fleet load must never be replaced by mock agents (their ids such as `swe-lead`
  // do not exist on any runtime and every follow-up call 404s). Transient 401s right after sign-in are retried.
  // The workspace mounts while the SSO callback is still storing the token; calling before it exists only
  // produces 401s. Wait (bounded) for a credential, then call; 401 is retried only when a credential exists.
  await waitForCredential(1500);
  if (!hasCredential()) {
    // No session and no operator key: an API call can only 401. Go to sign-in instead of probing.
    if (typeof window !== "undefined" && window.location.pathname !== "/callback" && !(window as any).__agent360SignInRedirect) {
      (window as any).__agent360SignInRedirect = true;
      redirectToSignIn();
    }
    throw new AgentListAuthError(401);
  }
  let res: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await authorizedFetch(`${API_BASE_URL}/agents`, { headers: { Accept: "application/json" } });
    if (res.ok || (res.status !== 401 && res.status < 500)) break;
    if (res.status === 401 && !hasCredential()) break;
    await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
  }
  if (!res || !res.ok) {
    const status = res?.status ?? 0;
    if (status === 401 || status === 403) throw new AgentListAuthError(status);
    throw new Error(`Failed to fetch agents: HTTP ${status}`);
  }
  {
    const data = await res.json();
    const rawList = Array.isArray(data) ? data : (data.agents || []);
    // Filter to load only enabled agents (handling both backend DTO and direct Skyer schema)
    // Exclude root default template, keep all infra agents (enabled and disabled)
    const validAgents = rawList.filter((a: any) => a.id !== 'default');
    return validAgents.map((a: any) => {
      const idStr = (a.id || "").toLowerCase();
      const slugStr = (a.slug || "").toLowerCase();
      let nodeStr = a.node || "";

      let instanceKey = "node-3rd";
      let displayNode = a.node || "Node 3rd (Core) - ai.hmz.one";

      if (idStr.startsWith("gm-") || slugStr.startsWith("gm-") || nodeStr.includes("6th") || nodeStr.includes("gia mộc")) {
        instanceKey = "node-6th";
        displayNode = a.node || "Node 6th (Gia Mộc) - ai-gm.antares.vn";
      } else if (idStr.startsWith("climax-") || slugStr.startsWith("climax-") || idStr.startsWith("planthy-") || slugStr.startsWith("planthy-") || nodeStr.includes("5th")) {
        instanceKey = "node-5th";
        displayNode = a.node || "Node 5th (Isolated) - antares.vn";
      } else if (idStr.startsWith("agentteams-") || slugStr.startsWith("agentteams-") || idStr.includes("llm360") || idStr.includes("tsx") || nodeStr.includes("4th")) {
        instanceKey = "node-4th";
        displayNode = a.node || "Node 4th (Swarm & Inference) - hmz.one";
      } else if (nodeStr.includes("7th") || idStr.includes("control")) {
        instanceKey = "node-7th";
        displayNode = a.node || "Node 7th (Control) - control.hmz.one";
      } else if (idStr.startsWith("its-") || slugStr.startsWith("its-") || idStr.startsWith("gl-") || slugStr.startsWith("gl-") || nodeStr.includes("8th") || (displayNode && displayNode.includes("8th"))) {
        instanceKey = "node-8th";
        displayNode = a.node || "Node 8th (ITS & GL) - antares.vn";
      } else if (nodeStr.includes("2nd")) {
        instanceKey = "node-2nd";
        displayNode = a.node || "Node 2nd (Platform) - api-agent360.antares.vn";
      }

      return {
        id: a.id,
        name: a.name || a.id,
        slug: a.slug || a.id,
        roleTag: a.roleTag || (a.pinned ? "Core" : "Operations"),
        node: displayNode,
        instanceId: instanceKey,
        enabled: a.enabled ?? (a.status !== "disabled" && a.startup_status !== "disabled"),
        status: (a.enabled === false || a.status === "disabled" || a.startup_status === "disabled") ? "disabled" : (a.status || (a.startup_status === "running" ? "active" : "idle")),
        model: cleanModelDisplayName((typeof a.model === "string" ? a.model : null) || a.active_model?.model || a.backend_model || "gpt-5.6-luna"),
        runtimeVersion: (a.runtimeVersion || "Skyer v2.2.1").replace(/qwenpaw|agentcore/gi, "AgentCore"),
        uptime: a.uptime || "Online (Private)",
        memoryUsageMb: a.memoryUsageMb || 256,
        description: a.description || "Active autonomous infrastructure agent",
        tools: a.tools || [],
        sessions: a.sessions || [],
        canToggle: a.can_toggle ?? a.canToggle ?? true,
        isRootAgent: a.is_root_agent ?? a.isRootAgent ?? false
      };
    });
  }
}

export async function markChatAsRead(chatId: string, agentId?: string): Promise<boolean> {
  try {
    const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    const endpoint = cleanAgentId
      ? `${API_BASE_URL}/agents/${encodeURIComponent(cleanAgentId)}/chats/${encodeURIComponent(chatId)}/read`
      : `${API_BASE_URL}/chats/${encodeURIComponent(chatId)}/read`;
    const res = await authorizedFetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }, cleanAgentId);
    return res.ok;
  } catch {
    return false;
  }
}

const _agentChatsCache = new Map<string, { data: AgentSession[]; timestamp: number }>();

export function getCurrentCacheUserScope(): string {
  try {
    if (typeof window === "undefined") return "anon";
    const profileRaw = sessionStorage.getItem("skyer_user_profile") || localStorage.getItem("skyer_user_profile");
    if (profileRaw) {
      const parsed = JSON.parse(profileRaw);
      if (parsed?.sub) return String(parsed.sub).trim();
    }
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
    if (token && token.includes(".")) {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload?.sub) return String(payload.sub).trim();
    }
    const opKey = localStorage.getItem("agent360.a2a.operatorKey") || localStorage.getItem("operator_token");
    if (opKey) return "operator";
  } catch {}
  return "anon";
}

function getScopedChatsCacheKey(agentId?: string): string {
  const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "default";
  const scope = getCurrentCacheUserScope();
  return `${scope}:${cleanAgentId}`;
}

export function updateCachedAgentChatsRead(agentId?: string): void {
  const scopedKey = getScopedChatsCacheKey(agentId);
  const cached = _agentChatsCache.get(scopedKey);
  if (cached && Array.isArray(cached.data)) {
    cached.data = cached.data.map((c) => ({ ...c, unread: false }));
    _agentChatsCache.set(scopedKey, cached);
  }
  try {
    const raw = sessionStorage.getItem(`agent360_chats_cache_${scopedKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const updated = JSON.stringify(parsed.map((c: any) => ({ ...c, unread: false })));
        sessionStorage.setItem(`agent360_chats_cache_${scopedKey}`, updated);
        localStorage.setItem(`agent360_chats_cache_${scopedKey}`, updated);
      }
    }
  } catch {}
}

export function getCachedAgentChats(agentId?: string): AgentSession[] | null {
  const scope = getCurrentCacheUserScope();
  if (scope === "anon") return null;
  const scopedKey = getScopedChatsCacheKey(agentId);
  const cached = _agentChatsCache.get(scopedKey);
  if (cached && Date.now() - cached.timestamp < 120_000) {
    return cached.data;
  }
  try {
    const raw = sessionStorage.getItem(`agent360_chats_cache_${scopedKey}`)
      || localStorage.getItem(`agent360_chats_cache_${scopedKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        _agentChatsCache.set(scopedKey, { data: parsed, timestamp: Date.now() });
        return parsed;
      }
    }
  } catch {}
  return null;
}

export async function fetchAgentChats(agentId?: string): Promise<AgentSession[]> {
  try {
    const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    const endpoint = cleanAgentId
      ? `${API_BASE_URL}/agents/${encodeURIComponent(cleanAgentId)}/chats`
      : `${API_BASE_URL}/chats`;

    // Retry transient errors during initial load / token initialization
    let res: Response | null = null;
    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        res = await authorizedFetch(endpoint, {
          headers: { Accept: "application/json" }
        }, cleanAgentId);
        if (res.ok) break;
        if (res.status === 401 || res.status === 403) {
          const scopedKey = getScopedChatsCacheKey(cleanAgentId);
          _agentChatsCache.delete(scopedKey);
          try {
            sessionStorage.removeItem(`agent360_chats_cache_${scopedKey}`);
            localStorage.removeItem(`agent360_chats_cache_${scopedKey}`);
          } catch {}
          return [];
        }
        if (res.status === 404 && cleanAgentId) {
          // If cleanAgentId 404s, try fallback with raw agentId or /chats
          break;
        }
      } catch (e) {
        lastError = e;
      }
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }

    if (!res || !res.ok) {
      throw new Error(`Failed to fetch chats: ${res ? res.statusText : lastError?.message || "network error"}`);
    }
    const data = await res.json();
    const rawList = Array.isArray(data) ? data : (data.chats || []);
    // Sort latest chats to the top (newest updated_at or created_at first)
    const sortedRaw = [...rawList].sort((a: any, b: any) => {
      const timeA = new Date(a.updated_at || a.last_finished_at || a.created_at || 0).getTime();
      const timeB = new Date(b.updated_at || b.last_finished_at || b.created_at || 0).getTime();
      return timeB - timeA;
    });

    const result = sortedRaw.map((c: any) => {
      let cleanTitle = (c.name || c.title || c.topic || '').trim();
      // Never expose raw technical UUID or session hashes to the UI
      if (!cleanTitle || /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(cleanTitle) || /^[0-9a-f]{16,}/i.test(cleanTitle) || cleanTitle.toLowerCase().startsWith('chat ') || cleanTitle.toLowerCase().startsWith('session ')) {
        const sid = c.session_id || '';
        if (sid && !/^[0-9a-f-]{16,}/i.test(sid) && sid.length <= 14) {
          cleanTitle = `Hội thoại #${sid}`;
        } else {
          cleanTitle = "Cuộc hội thoại";
        }
      }
      const displayTitle = cleanTitle;

      let rawSnippet = c.last_message?.content || c.lastMessageSnippet || c.snippet || '';
      // If rawSnippet is missing, check client-side cached messages for this session
      if (!rawSnippet || rawSnippet === 'Chưa có tin nhắn mới' || /^[0-9a-f-]{16,}/i.test(rawSnippet)) {
        try {
          const key = `${getCurrentCacheUserScope()}:${cleanAgentId || 'default'}:${c.id}`;
          const rawCache = sessionStorage.getItem(`agent360_msgcache_${key}`);
          if (rawCache) {
            const parsedMsgs = JSON.parse(rawCache);
            if (Array.isArray(parsedMsgs) && parsedMsgs.length > 0) {
              const lastMsg = parsedMsgs[parsedMsgs.length - 1];
              if (lastMsg && lastMsg.content) {
                rawSnippet = lastMsg.content.trim().replace(/\s+/g, ' ').slice(0, 100);
              }
            }
          }
        } catch {}
      }
      if (!rawSnippet || /^[0-9a-f-]{16,}/i.test(rawSnippet)) {
        rawSnippet = c.title || (c.channel && c.channel !== 'console' ? `Kênh ${c.channel}` : 'Chưa có tin nhắn mới');
      }
      const snippet = rawSnippet;
      const updatedStr = c.updated_at
        ? new Date(c.updated_at).toLocaleDateString([], { month: "short", day: "numeric" })
        : "Recently";

      // Extract or infer channel (telegram, zalo, discord, slack, or console)
      let rawChannel = (c.channel || "").toLowerCase().trim();
      if (!rawChannel) {
        const sid = (c.session_id || c.id || "").toLowerCase();
        if (sid.includes("telegram") || sid.startsWith("tg_") || sid.includes("tg-")) {
          rawChannel = "telegram";
        } else if (sid.includes("zalo") || sid.startsWith("zl_") || sid.includes("zl-")) {
          rawChannel = "zalo";
        } else if (sid.includes("discord")) {
          rawChannel = "discord";
        } else if (sid.includes("slack")) {
          rawChannel = "slack";
        } else {
          rawChannel = "console";
        }
      }

      const isRunning = Boolean(
        c.is_running ||
        c.status === "running" ||
        c.status === "in_progress"
      );

      return {
        id: c.id,
        title: displayTitle,
        updatedAt: updatedStr,
        messageCount: c.message_count || c.messagesCount || 1,
        lastMessageSnippet: snippet,
        unread: Boolean(c.unread ?? c.is_unread ?? false),
        name: displayTitle,
        session_id: c.session_id,
        agentId: cleanAgentId || c.agent_id || "default",
        channel: rawChannel,
        status: isRunning ? "running" : (c.status || "idle"),
        is_running: isRunning,
        isRunning: isRunning,
        _rawUpdatedAt: c.updated_at || c.last_finished_at || c.created_at || ""
      };
    });

    // Populate SWR in-memory, sessionStorage, and localStorage fallback cache (strictly scoped by user sub)
    const scope = getCurrentCacheUserScope();
    if (result && result.length > 0 && scope !== "anon") {
      const scopedKey = getScopedChatsCacheKey(cleanAgentId);
      _agentChatsCache.set(scopedKey, { data: result, timestamp: Date.now() });
      try {
        const serialized = JSON.stringify(result.slice(0, 100));
        sessionStorage.setItem(`agent360_chats_cache_${scopedKey}`, serialized);
        localStorage.setItem(`agent360_chats_cache_${scopedKey}`, serialized);
      } catch {}
    }

    return result;
  } catch (err) {
    const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "default";
    const fallbackCached = getCachedAgentChats(cleanAgentId);
    if (fallbackCached && fallbackCached.length > 0) {
      console.warn("fetchAgentChats error, preserving cached chat list for", cleanAgentId, err);
      return fallbackCached;
    }
    console.warn("fetchAgentChats error, returning empty list", err);
    return [];
  }
}


export async function fetchActiveChats(): Promise<string[]> {
  try {
    const res = await authorizedFetch(`${API_BASE_URL}/chats/active`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function updateAgentActiveModel(agentId: string, providerId: string, model: string): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const putRes = await authorizedFetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/active-model`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ scope: "agent", agent_id: cleanId, provider_id: providerId, model }),
    }, cleanId);
    if (!putRes.ok) {
      console.warn(`updateAgentActiveModel failed: HTTP ${putRes.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Failed to update agent active model:", err);
    return false;
  }
}

export interface ModelOption {
  providerId: string;
  providerName: string;
  model: string;
  name: string;
}

export async function fetchAvailableModels(): Promise<ModelOption[]> {
  try {
    // compact view: ids/names only (~a few KB) instead of the ~820 KB raw provider catalog
    let res = await authorizedFetch(`${API_BASE_URL}/agents/models?view=compact`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      res = await authorizedFetch(`${API_BASE_URL}/models`, {
        headers: { Accept: "application/json" }
      });
    }
    if (!res.ok) throw new Error(`Failed to fetch models: ${res.statusText}`);
    const providers = await res.json();
    const list: ModelOption[] = [];
    if (Array.isArray(providers)) {
      // Prioritize llm360 providers so active gateway models are matched first
      const sortedProviders = [...providers].sort((a, b) => {
        const aIsLlm = (a.id || "").toLowerCase().startsWith("llm360");
        const bIsLlm = (b.id || "").toLowerCase().startsWith("llm360");
        if (aIsLlm && !bIsLlm) return -1;
        if (!aIsLlm && bIsLlm) return 1;
        return 0;
      });

      for (const p of sortedProviders) {
        const pModels = [
          ...(p.discovered_models || []),
          ...(p.extra_models || []),
          ...(p.models || [])
        ];
        for (const m of pModels) {
          if (m && m.id) {
            const cleanId = m.id.includes("/") ? m.id.split("/").pop()! : m.id;
            const lower = cleanId.toLowerCase();
            // Filter out non-chat / media / embedding / auxiliary models
            const nonChatPatterns = [
              "embedding", "embed", "tts", "audio", "video", "imagine", "imagen",
              "veo", "lyria", "generate-preview", "metadata_health", "moderation", "rerank", "dall-e", "flux"
            ];
            if (nonChatPatterns.some(pat => lower.includes(pat))) {
              continue;
            }
            if (!list.some(x => x.model === cleanId)) {
              list.push({
                providerId: p.id,
                providerName: p.name || p.id,
                model: cleanId,
                name: m.name || cleanId,
              });
            }
          }
        }
      }
    }
    return list;
  } catch (err) {
    console.warn("Failed to fetch available models, using default list:", err);
    return [
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "gpt-5.6-luna", name: "GPT-5.6 Luna" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "grok-4.7", name: "Grok 4.7" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "gpt-6-sol", name: "GPT-6 Sol" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "grok-4.6", name: "Grok 4.6" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "claude-opus-4.6-thinking", name: "Claude Opus 4.6" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "gemini-3.7-flash-tiered", name: "Gemini 3.7 Flash" },
    ];
  }
}

export type LibraryCategory = "all" | "pages" | "files" | "apps" | "images" | "media";

export interface WorkspaceTreeNode {
  name: string;
  path: string;
  kind: "file" | "directory";
  previewKind?: string | null;
  category?: string | null;
  extension?: string | null;
  mimeType?: string | null;
  size?: number | null;
  modifiedAt?: string | null;
  children?: WorkspaceTreeNode[];
}

export interface WorkspaceLibraryResult {
  entries: WorkspaceTreeNode[];
  categoryCounts: Record<string, number>;
  formatCounts: Record<string, number>;
  totalCount: number;
}

const PAGE_EXTS = new Set(["md", "mdx", "html", "htm"]);
const APP_EXTS = new Set(["py", "ts", "tsx", "js", "jsx", "sh", "bash", "cs", "go", "rs", "java", "cpp", "c", "h", "css", "scss", "less", "sql", "vue", "svelte"]);
const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "ico", "bmp"]);
const MEDIA_EXTS = new Set(["mp4", "webm", "mov", "avi", "mp3", "wav", "ogg", "m4a", "aac", "flac"]);

function inferClientCategory(pathOrName: string, kind: string): { category: string; previewKind: string; ext: string } {
  if (kind === "directory") return { category: "directory", previewKind: "directory", ext: "" };
  const ext = (pathOrName.split(".").pop() || "").toLowerCase();
  if (!pathOrName.includes(".")) return { category: "files", previewKind: "text", ext: "" };
  if (PAGE_EXTS.has(ext)) return { category: "pages", previewKind: ext === "html" || ext === "htm" ? "html" : "markdown", ext };
  if (APP_EXTS.has(ext)) return { category: "apps", previewKind: "code", ext };
  if (IMAGE_EXTS.has(ext)) return { category: "images", previewKind: "image", ext };
  if (MEDIA_EXTS.has(ext)) return { category: "media", previewKind: ["mp4", "webm", "mov", "avi"].includes(ext) ? "video" : "audio", ext };
  if (ext === "pdf") return { category: "files", previewKind: "pdf", ext };
  if (ext === "csv" || ext === "tsv") return { category: "files", previewKind: "csv", ext };
  if (["xlsx", "xls", "xlsm"].includes(ext)) return { category: "files", previewKind: "spreadsheet", ext };
  if (["docx", "doc"].includes(ext)) return { category: "files", previewKind: "document", ext };
  return { category: "files", previewKind: "text", ext };
}

export async function fetchWorkspaceLibrary(
  agentId?: string,
  options?: { category?: string; ext?: string; search?: string; includeSystem?: boolean }
): Promise<WorkspaceLibraryResult> {
  const cleanId = (agentId || "mons").replace(/^bot:agent360:/, "");
  const params = new URLSearchParams();
  if (options?.category && options.category !== "all") params.set("category", options.category);
  if (options?.ext) params.set("ext", options.ext);
  if (options?.search) params.set("search", options.search);
  if (options?.includeSystem) params.set("includeSystem", "true");
  const qs = params.toString() ? `?${params.toString()}` : "";

  try {
    const res = await authorizedFetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/workspace/tree${qs}`, {
      headers: { Accept: "application/json" }
    }, cleanId);
    if (!res.ok) {
      throw new Error(`Failed to fetch workspace library: ${res.statusText}`);
    }
    const data = await res.json();
    const rawEntries = Array.isArray(data) ? data : (data.entries || data.files || []);
    const entries: WorkspaceTreeNode[] = rawEntries.map((e: any) => {
      const pathStr = e.path || e.name || "";
      const kind = e.kind === "directory" || e.type === "directory" ? "directory" : "file";
      const inferred = inferClientCategory(pathStr, kind);
      const rawName = e.name || pathStr.split("/").pop() || "file";
      return {
        name: rawName.includes("/") ? (rawName.split("/").pop() || rawName) : rawName,
        path: pathStr,
        kind,
        previewKind: e.preview_kind || e.previewKind || inferred.previewKind,
        category: e.category || inferred.category,
        extension: e.extension || inferred.ext || null,
        mimeType: e.mime_type || e.mimeType || null,
        size: typeof e.size === "number" ? e.size : null,
        modifiedAt: e.modified_at || e.modifiedAt || e.modified_time || null
      };
    });

    const categoryCounts: Record<string, number> = data.category_counts || data.categoryCounts || {};
    const formatCounts: Record<string, number> = data.format_counts || data.formatCounts || {};
    if (Object.keys(categoryCounts).length === 0) {
      categoryCounts.all = entries.length;
      for (const item of entries) {
        const c = item.category || "files";
        categoryCounts[c] = (categoryCounts[c] || 0) + 1;
        if (item.extension) {
          formatCounts[item.extension] = (formatCounts[item.extension] || 0) + 1;
        }
      }
    }

    return {
      entries,
      categoryCounts,
      formatCounts,
      totalCount: typeof data.total_count === "number" ? data.total_count : entries.length
    };
  } catch (err) {
    console.warn(`fetchWorkspaceLibrary failed for ${cleanId}:`, err);
    return { entries: [], categoryCounts: { all: 0 }, formatCounts: {}, totalCount: 0 };
  }
}

export async function fetchWorkspaceTree(agentId?: string): Promise<WorkspaceTreeNode[]> {
  const result = await fetchWorkspaceLibrary(agentId);
  return result.entries;
}

export async function fetchWorkspaceFileContent(agentId: string, filePath: string): Promise<string> {
  const cleanId = (agentId || "mons").replace(/^bot:agent360:/, "");
  try {
    const res = await authorizedFetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/workspace/file-content?path=${encodeURIComponent(filePath)}`, {
      headers: { Accept: "application/json" }
    }, cleanId);
    if (!res.ok) {
      throw new Error(`Failed to fetch file content: ${res.statusText}`);
    }
    const json = await res.json();
    return typeof json === "string" ? json : (json.content || "");
  } catch (err) {
    console.warn(`fetchWorkspaceFileContent failed for ${cleanId}/${filePath}:`, err);
    return `# ${filePath}\n\n[Unable to load live content]`;
  }
}


export async function getSignedWorkspaceFileUrl(agentId: string, filePath: string, inline = true): Promise<string | null> {
  const cleanId = (agentId || "mons").replace(/^bot:agent360:/, "");
  try {
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/workspace/signed-file-url?path=${encodeURIComponent(filePath)}&inline=${inline ? "true" : "false"}`,
      {},
      cleanId
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || null;
  } catch (err) {
    console.warn(`getSignedWorkspaceFileUrl failed for ${cleanId}/${filePath}:`, err);
    return null;
  }
}

export async function fetchWorkspaceFileBlobUrl(agentId: string, filePath: string, inline = true): Promise<string | null> {
  const cleanId = (agentId || "mons").replace(/^bot:agent360:/, "");
  try {
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/workspace/file-download?path=${encodeURIComponent(filePath)}&inline=${inline ? "true" : "false"}`,
      {},
      cleanId
    );
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn(`fetchWorkspaceFileBlobUrl failed for ${cleanId}/${filePath}:`, err);
    return null;
  }
}

export async function downloadWorkspaceFile(agentId: string, filePath: string, fileName?: string): Promise<boolean> {
  const url = await fetchWorkspaceFileBlobUrl(agentId, filePath, false);
  if (!url) return false;
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || filePath.split("/").pop() || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
  } catch {
    URL.revokeObjectURL(url);
    return false;
  }
}

// Fast Client-Side Dialogue Session Cache for Instant Navigation (User-Sub Isolated)
const _chatMessagesCache = new Map<string, { messages: ChatMessage[]; timestamp: number }>();

export function getCachedChatMessages(chatId: string, agentId?: string): ChatMessage[] | null {
  const scope = getCurrentCacheUserScope();
  if (scope === "anon") return null;
  const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "default";
  const key = `${scope}:${cleanAgentId}:${chatId}`;
  const cached = _chatMessagesCache.get(key);
  if (cached && cached.messages) {
    return cached.messages;
  }
  try {
    const raw = sessionStorage.getItem(`agent360_msgcache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        _chatMessagesCache.set(key, { messages: parsed, timestamp: Date.now() });
        return parsed;
      }
    }
  } catch {}
  return null;
}

export function setCachedChatMessages(chatId: string, messages: ChatMessage[], agentId?: string): void {
  const scope = getCurrentCacheUserScope();
  if (scope === "anon") return;
  const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "default";
  const key = `${scope}:${cleanAgentId}:${chatId}`;
  _chatMessagesCache.set(key, { messages, timestamp: Date.now() });
  try {
    sessionStorage.setItem(`agent360_msgcache_${key}`, JSON.stringify(messages.slice(-200)));
  } catch {}
}

function extractMediaTagsFromContentParts(parts: any[], existingText: string): string {
  if (!Array.isArray(parts)) return "";
  const added: string[] = [];
  for (const item of parts) {
    if (!item || typeof item !== "object") continue;
    const t = String(item.type || "").toLowerCase();
    if (t === "text" || t === "data" || t === "reasoning") continue;
    const rawUrl =
      (typeof item.image_url === "string" ? item.image_url : item.image_url?.url) ||
      (typeof item.file_url === "string" ? item.file_url : item.file_url?.url) ||
      (typeof item.audio_url === "string" ? item.audio_url : item.audio_url?.url) ||
      (typeof item.video_url === "string" ? item.video_url : item.video_url?.url) ||
      (typeof item.url === "string" ? item.url : "") ||
      (typeof item.path === "string" ? item.path : "") ||
      (typeof item.file_path === "string" ? item.file_path : "");
    if (!rawUrl) continue;
    const cleanUrl = String(rawUrl).trim();
    if (!cleanUrl || existingText.includes(cleanUrl)) continue;
    const fallbackName = cleanUrl.replace(/\\/g, "/").split("/").pop() || "attachment";
    const fileName = String(item.file_name || item.filename || item.name || fallbackName).trim();
    added.push(`[Attached File: ${fileName} (${cleanUrl})]`);
  }
  return added.join("\n");
}

export function parseRawChatMessages(rawList: any[], chatId: string, isSessionActive: boolean = false): ChatMessage[] {
  const turns: ChatMessage[] = [];
  let currentAsst: ChatMessage | null = null;

  for (let mIdx = 0; mIdx < rawList.length; mIdx++) {
    const m = rawList[mIdx];
    const role = m.role || "user";
    const mtype = m.type || m.message_type || "";
    const ts = m.metadata?.timestamp || m.created_at || (m.timestamp ? new Date(m.timestamp * 1000).toISOString() : new Date().toISOString());

    if (role === "user") {
      currentAsst = null;
      let userContent = "";
      if (typeof m.content === "string") {
        userContent = m.content;
      } else if (Array.isArray(m.content)) {
        userContent = m.content
          .filter((c: any) => c.type === "text" || !c.type)
          .map((c: any) => c.text || "")
          .join("\n");
        const mediaTags = extractMediaTagsFromContentParts(m.content, userContent);
        if (mediaTags) {
          userContent = userContent ? `${userContent}\n\n${mediaTags}` : mediaTags;
        }
      }
      let roomCtxIdx = userContent.indexOf("[SHARED SESSION ROOM CONTEXT]");
      if (roomCtxIdx < 0) roomCtxIdx = userContent.indexOf("[AGENTTEAMS COLLABORATION ROOM");
      if (roomCtxIdx >= 0) {
        const tail = userContent.slice(roomCtxIdx);
        let head = userContent.slice(0, roomCtxIdx).trimEnd();
        const tailAttachments = tail.match(/\[Attached File:\s*[^\n\r]+?\s*\([^()\n\r]+\)\]/gi) || [];
        for (const att of tailAttachments) {
          if (!head.includes(att)) {
            head = head ? `${head}\n\n${att}` : att;
          }
        }
        userContent = head;
      }
      turns.push({
        id: m.id || `${chatId}-${mIdx}-user`,
        role: "user",
        content: userContent || "(Empty user message)",
        timestamp: ts,
        runId: m.metadata?.run_id || undefined,
        roomId: m.metadata?.room_id || undefined,
        reactions: Array.isArray(m.reactions) ? m.reactions : (Array.isArray(m.metadata?.reactions) ? m.metadata.reactions : undefined),
        metadata: m.metadata || undefined,
      });
    } else if (role === "assistant") {
      // Narrator Model: Specialist room turns (visibility="room" or collaborator_reply) belong in collaboration_room Flow Tree only, never as separate main chat bubbles
      const msgVisibility = m.metadata?.visibility;
      const msgTurnKind = m.metadata?.turn_kind;
      const msgAuthorRole = m.metadata?.author_role;
      const msgSenderAgentId = m.metadata?.sender_agent_id || undefined;
      if (
        msgVisibility === "room" ||
        msgTurnKind === "collaborator_reply" ||
        msgTurnKind === "collaborator_progress" ||
        msgTurnKind === "question" ||
        msgTurnKind === "manager_guard" ||
        msgAuthorRole === "collaborator" ||
        Boolean(msgSenderAgentId)
      ) {
        continue;
      }

      const msgRoomId = m.metadata?.room_id || undefined;
      const msgRunId = m.metadata?.run_id || undefined;
      const msgRoundNo = typeof m.metadata?.round_no === "number" ? m.metadata.round_no : undefined;
      const msgReceipt = m.metadata?.receipt || undefined;
      const isNarratorMilestone = msgTurnKind === "host_kickoff" || msgTurnKind === "host_progress" || msgTurnKind === "synthesis" || Boolean(msgReceipt);

      // Keep Host narrator bubbles (host_kickoff, host_progress, synthesis) as distinct bubbles so inline receipts render between them!
      if (
        currentAsst &&
        (currentAsst.senderAgentId !== msgSenderAgentId ||
          currentAsst.roomId !== msgRoomId ||
          isNarratorMilestone ||
          Boolean(currentAsst.turnKind) ||
          Boolean(currentAsst.roomReceipt))
      ) {
        currentAsst = null;
      }
      if (!currentAsst) {
        const metaSteps = Array.isArray(m.metadata?.steps) ? m.metadata.steps : [];
        const metaTools = metaSteps.filter((s: any) => s.kind === "tool_call");
        currentAsst = {
          id: m.id || `${chatId}-${mIdx}-asst`,
          role: "assistant",
          content: "",
          timestamp: ts,
          steps: [...metaSteps],
          toolCalls: [...metaTools],
          reasoning: m.metadata?.reasoning || "",
          senderAgentId: undefined,
          senderAgentName: undefined,
          authorRole: msgAuthorRole || "host",
          roomId: msgRoomId,
          matrixRoomId: m.metadata?.matrix_room_id || undefined,
          elementRoomUrl: m.metadata?.element_room_url || undefined,
          runId: msgRunId,
          roundNo: msgRoundNo,
          turnKind: msgTurnKind || undefined,
          visibility: msgVisibility || "main",
          roomReceipt: msgReceipt,
          reactions: Array.isArray(m.reactions) ? m.reactions : (Array.isArray(m.metadata?.reactions) ? m.metadata.reactions : undefined),
          metadata: m.metadata || undefined
        };
        turns.push(currentAsst);
      }

      let textContent = "";
      const callDatas: any[] = [];
      if (typeof m.content === "string") {
        textContent = m.content;
      } else if (Array.isArray(m.content)) {
        for (const item of m.content) {
          if (item && typeof item === "object") {
            if (item.type === "text" && item.text) {
              textContent += item.text + "\n";
            } else if (item.type === "data" && item.data) {
              callDatas.push(item.data);
            }
          }
        }
        const asstMediaTags = extractMediaTagsFromContentParts(m.content, textContent);
        if (asstMediaTags) {
          textContent = textContent ? `${textContent}\n\n${asstMediaTags}` : asstMediaTags;
        }
      }

      if (mtype === "reasoning" || mtype === "thinking") {
        const r = textContent.trim();
        if (r) {
          currentAsst.reasoning = currentAsst.reasoning ? currentAsst.reasoning + "\n" + r : r;
          currentAsst.steps!.push({
            kind: "reasoning",
            text: r
          });
        }
      } else if (mtype === "plugin_call" || mtype === "tool" || mtype === "tool_call" || mtype === "function_call") {
        const payload = m.payload || m.data || {};
        const toolCalls = payload.tool_calls || (payload.name ? [payload] : callDatas);
        for (const tc of toolCalls) {
          const stepItem = {
            kind: "tool_call" as const,
            id: tc.id || tc.call_id || m.id,
            call_id: tc.call_id || tc.id,
            tool: tc.function?.name || tc.name || "Tool Call",
            args: typeof tc.arguments === "string" ? tc.arguments : (typeof tc.function?.arguments === "string" ? tc.function.arguments : JSON.stringify(tc.function?.arguments || tc.args || {})),
            state: "calling" as const
          };
          currentAsst.steps!.push(stepItem);
          currentAsst.toolCalls!.push({
            id: stepItem.id,
            call_id: stepItem.call_id,
            tool: stepItem.tool,
            args: stepItem.args,
            state: "calling"
          });
        }
      } else if (mtype === "plugin_call_output" || mtype === "tool_result" || mtype === "function_result") {
        const payload = m.payload || m.data || {};
        const results = Array.isArray(payload) ? payload : (callDatas.length > 0 ? callDatas : [payload]);
        for (const d of results) {
          const cid = d.call_id || d.tool_call_id || d.id;
          const strOut = typeof d.output === "string" ? d.output : (typeof d.result === "string" ? d.result : JSON.stringify(d.output || d.result || d));
          const toolState = d.state === "success" || d.status === "completed" || (!d.error && d.status !== "error") ? "success" as const : "error" as const;
          
          if (currentAsst.steps) {
            let matched = false;
            for (const s of currentAsst.steps) {
              if (s.call_id && s.call_id === cid) {
                s.result = strOut;
                s.state = toolState;
                matched = true;
                break;
              }
            }
            if (!matched) {
              currentAsst.steps.push({
                kind: "tool_call",
                id: cid || m.id,
                call_id: cid,
                tool: d.name || "Tool Output",
                args: "",
                result: strOut,
                state: toolState
              });
            }
          }

          if (currentAsst.toolCalls) {
            let matched = false;
            for (const tc of currentAsst.toolCalls) {
              if (tc.call_id && tc.call_id === cid) {
                tc.result = strOut;
                tc.state = toolState;
                matched = true;
                break;
              }
            }
            if (!matched) {
              currentAsst.toolCalls.push({
                id: cid || m.id,
                call_id: cid,
                tool: d.name || "Tool Output",
                args: "",
                result: strOut,
                state: toolState
              });
            }
          }
        }
      } else if (mtype === "message" || !mtype) {
        if (callDatas.length > 0) {
          for (const d of callDatas) {
            const cid = d.call_id || d.tool_call_id || d.id;
            const toolName = d.name || "Tool";
            const rawArgs = d.arguments !== undefined
              ? (typeof d.arguments === "string" ? d.arguments : JSON.stringify(d.arguments))
              : (d.args !== undefined ? (typeof d.args === "string" ? d.args : JSON.stringify(d.args)) : "");
            const hasOutput = d.output !== undefined || d.result !== undefined;
            const strOut = hasOutput
              ? (typeof d.output === "string" ? d.output : (typeof d.result === "string" ? d.result : JSON.stringify(d.output || d.result)))
              : undefined;
            const toolState = hasOutput
              ? ((d.state === "error" || d.status === "error" || d.error) ? "error" : "success")
              : "calling";

            if (currentAsst.steps) {
              let matched = false;
              if (cid) {
                for (const s of currentAsst.steps) {
                  if (s.call_id === cid || s.id === cid) {
                    if (hasOutput) {
                      s.result = strOut;
                      s.state = toolState;
                    }
                    if (rawArgs && !s.args) s.args = rawArgs;
                    matched = true;
                    break;
                  }
                }
              }
              if (!matched) {
                currentAsst.steps.push({
                  kind: "tool_call",
                  id: cid || `step-${Date.now()}-${Math.random()}`,
                  call_id: cid,
                  tool: toolName,
                  args: rawArgs,
                  result: strOut,
                  state: toolState
                });
              }
            }

            if (currentAsst.toolCalls) {
              let matched = false;
              if (cid) {
                for (const tc of currentAsst.toolCalls) {
                  if (tc.call_id === cid || tc.id === cid) {
                    if (hasOutput) {
                      tc.result = strOut;
                      tc.state = toolState;
                    }
                    if (rawArgs && !tc.args) tc.args = rawArgs;
                    matched = true;
                    break;
                  }
                }
              }
              if (!matched) {
                currentAsst.toolCalls.push({
                  id: cid || `call-${Date.now()}-${Math.random()}`,
                  call_id: cid,
                  tool: toolName,
                  args: rawArgs,
                  result: strOut,
                  state: toolState
                });
              }
            }
          }
        }

        if (Array.isArray(m.steps) && m.steps.length > 0) {
          for (const s of m.steps) {
            const sid = s.id || s.call_id;
            const sTool = s.name || s.tool || "Tool";
            const sArgs = s.arguments || s.args || "";
            const sOut = s.output || s.result || "";
            const sState = s.status === "completed" || s.status === "succeeded" ? "success" : (s.status === "failed" || s.status === "error" ? "error" : "calling");

            if (currentAsst.steps && !currentAsst.steps.some(existing => existing.call_id === sid || existing.id === sid)) {
              currentAsst.steps.push({
                kind: "tool_call",
                id: sid || `step-${Date.now()}`,
                call_id: sid,
                tool: sTool,
                args: typeof sArgs === "string" ? sArgs : JSON.stringify(sArgs),
                result: typeof sOut === "string" ? sOut : JSON.stringify(sOut),
                state: sState
              });
            }
          }
        }

        const t = textContent.trim();
        if (t) {
          if (t.startsWith("The user said ") || t.startsWith("According to my activation instructions")) {
            currentAsst.reasoning = currentAsst.reasoning ? currentAsst.reasoning + "\n" + t : t;
            currentAsst.steps!.push({
              kind: "reasoning",
              text: t
            });
          } else {
            if (!currentAsst.textSegments) currentAsst.textSegments = [];
            if (currentAsst.textSegments[currentAsst.textSegments.length - 1] !== t) {
              currentAsst.textSegments.push(t);
            }
            if (currentAsst.content) {
              currentAsst.content += "\n\n" + t;
            } else {
              currentAsst.content = t;
            }
          }
        }
        if (ts) {
          currentAsst.timestamp = ts;
        }
      }
    }
  }

  const filteredTurns: ChatMessage[] = [];
  for (let idx = 0; idx < turns.length; idx++) {
    const t = turns[idx];
    const isLatestTurn = idx === turns.length - 1;

    if (t.role === "user") {
      if (t.content.includes("# 引导模式") || t.content.includes("BOOTSTRAP.md")) {
        continue;
      }
      const last = filteredTurns[filteredTurns.length - 1];
      if (last && last.role === "user" && last.content.trim() === t.content.trim()) {
        continue;
      }
    }

    if (t.role === "assistant") {
      const shouldReconcile = !isSessionActive || !isLatestTurn;
      if (shouldReconcile) {
        if (t.steps) {
          for (const s of t.steps) {
            if (s.kind === "tool_call" && s.state === "calling") {
              s.state = "success";
            }
          }
        }
        if (t.toolCalls) {
          for (const tc of t.toolCalls) {
            if (tc.state === "calling") {
              tc.state = "success";
            }
          }
        }
      }
    }

    if (t.content || (t.steps && t.steps.length > 0) || (t.toolCalls && t.toolCalls.length > 0) || t.reasoning) {
      filteredTurns.push(t);
    }
  }

  return filteredTurns;
}

export async function fetchChatMessages(chatId: string, agentId?: string): Promise<ChatMessage[]> {
  try {
    const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    // Priority URLs: /api/agents/chats/:chatId (direct history endpoint on AgentFeaturesEndpoints)
    const urlsToTry = [
      cleanAgentId ? `${API_BASE_URL}/agents/${encodeURIComponent(cleanAgentId)}/chats/${encodeURIComponent(chatId)}` : null,
      cleanAgentId ? `${API_BASE_URL}/agents/chats/${encodeURIComponent(chatId)}?agentId=${encodeURIComponent(cleanAgentId)}` : null,
      `${API_BASE_URL}/agents/chats/${encodeURIComponent(chatId)}`,
      `${API_BASE_URL}/chats/${encodeURIComponent(chatId)}`
    ].filter(Boolean) as string[];

    const reqHeaders: Record<string, string> = { Accept: "application/json", ...getAuthHeaders(cleanAgentId) };

    let res: Response | null = null;
    for (const u of urlsToTry) {
      try {
        const attempt = await fetch(u, { headers: reqHeaders });
        if (attempt.status === 401 || attempt.status === 403) {
          const key = `${getCurrentCacheUserScope()}:${cleanAgentId || "default"}:${chatId}`;
          _chatMessagesCache.delete(key);
          try {
            sessionStorage.removeItem(`agent360_msgcache_${key}`);
          } catch {}
          return [];
        }
        if (attempt.ok) {
          res = attempt;
          break;
        }
      } catch {}
    }
    if (!res || !res.ok) {
      throw new Error(`Failed to fetch messages for chat ${chatId}`);
    }
    const data = await res.json();
    if (typeof window !== "undefined") {
      const candidateRoom = data && !Array.isArray(data) ? data.collaboration_room : null;
      const isMultiAgent = Boolean(
        candidateRoom &&
        ((Array.isArray(candidateRoom.participants) && candidateRoom.participants.some((p: any) => p.role === "collaborator")) ||
         (Array.isArray(candidateRoom.turns) && candidateRoom.turns.some((t: any) => t.kind === "collaborator_reply" || t.kind === "collaborator_progress" || t.kind === "host_kickoff" || t.kind === "host_progress")))
      );
      window.dispatchEvent(new CustomEvent("agent360_room_synced", { detail: { chatId, room: isMultiAgent ? candidateRoom : null } }));
    }
    const isRunningOnServer = Boolean(data && !Array.isArray(data) && (data.status === "running" || data.status === "in_progress" || data.is_running));
    const rawList = Array.isArray(data) ? data : (data.messages || []);
    const filteredTurns = parseRawChatMessages(rawList, chatId, isRunningOnServer);
    if (filteredTurns.length === 0) {
      const existingCached = getCachedChatMessages(chatId, agentId);
      const isTurnActive = typeof window !== "undefined" && sessionStorage.getItem(`agent360_active_turn_${chatId}`) === "true";
      if (existingCached && existingCached.length > 0 && (isTurnActive || isRunningOnServer)) {
        return existingCached;
      }
    }
    setCachedChatMessages(chatId, filteredTurns, agentId);
    return filteredTurns;
  } catch (err) {
    const existingCached = getCachedChatMessages(chatId, agentId);
    if (existingCached && existingCached.length > 0) {
      return existingCached;
    }
    if (chatId.startsWith("session-")) {
      return [];
    }
    console.warn("fetchChatMessages failed", err);
    throw err;
  }
}

export async function fetchSkills(agentId?: string): Promise<string[]> {
  try {
    const cleanId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    const res = await authorizedFetch(cleanId ? `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/skills` : `${API_BASE_URL}/agents/skills`, {
      headers: { Accept: "application/json" }
    }, cleanId);
    if (!res.ok) {
      throw new Error(`Failed to fetch skills: ${res.statusText}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((s: any) => typeof s === "string" ? s : (s.name || JSON.stringify(s)));
    }
    return [];
  } catch (err) {
    console.warn("fetchSkills fallback", err);
    return [];
  }
}

export interface AgentMcpClient {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  transport: string;
  url?: string;
  command?: string;
  access_summary?: {
    default_effect: string;
    overrides_count: number;
  };
}

export async function fetchAgentMcpClients(agentId: string): Promise<AgentMcpClient[]> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(`${API_BASE_URL}/mcp?agentIdQuery=${encodeURIComponent(cleanId)}`, {
      headers: {
        Accept: "application/json",
        "X-Agent-Id": cleanId,
      },
    }, cleanId);
    if (!res.ok) {
      throw new Error(`Failed to fetch MCP clients: ${res.statusText}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`fetchAgentMcpClients fallback for ${agentId}:`, err);
    return [];
  }
}


export interface AgentChannelConfig {
  name: string;
  enabled: boolean;
  type: string;
  details?: Record<string, any>;
}

export interface AgentScheduleJob {
  id: string;
  name: string;
  enabled: boolean;
  cronExpr: string;
  timezone?: string;
  targetChannel?: string;
  promptSnippet?: string;
}

export async function fetchAgentChannels(agentId: string): Promise<AgentChannelConfig[]> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/config/channels`, {
      headers: { Accept: "application/json" }
    }, cleanId);
    if (!res.ok) throw new Error("Failed to fetch agent channels");
    const channelsObj = await res.json();
    
    const list: AgentChannelConfig[] = [];
    for (const [key, val] of Object.entries<any>(channelsObj)) {
      list.push({
        name: key.toUpperCase(),
        enabled: Boolean(val?.enabled),
        type: key,
        details: val
      });
    }
    return list;
  } catch (err) {
    console.warn("fetchAgentChannels failed", err);
    return [];
  }
}

export async function toggleAgentChannel(agentId: string, channelType: string, enabled: boolean): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const channelPath = `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/config/channels/${encodeURIComponent(channelType)}`;
    const getRes = await fetch(channelPath, { headers: { Accept: "application/json" } });
    if (!getRes.ok) throw new Error("Failed to fetch channel config");
    const current = await getRes.json();
    const putRes = await fetch(channelPath, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...current, enabled })
    });
    return putRes.ok;
  } catch (err) {
    console.warn("toggleAgentChannel error", err);
    return false;
  }
}

function agentScopedPath(agentId: string | undefined, path: string): string {
  if (!agentId) return ""; const cleanId = agentId.replace(/^bot:agent360:/, "");
  return `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/${path.replace(/^\//, "")}`;
}

export async function fetchAgentSchedules(agentId?: string): Promise<AgentScheduleJob[]> {
  try {
    const cleanId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    const res = await authorizedFetch(agentScopedPath(agentId, "cron/jobs"), {
      headers: { Accept: "application/json" }
    }, cleanId);
    if (!res.ok) throw new Error("Failed to fetch cron jobs");
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    return list.map((j: any) => ({
      id: j.id,
      name: j.name || "Scheduled Automation",
      enabled: j.enabled !== false,
      cronExpr: j.schedule?.cron || "0 0 * * *",
      timezone: j.schedule?.timezone || "Asia/Ho_Chi_Minh",
      targetChannel: j.dispatch?.channel || "console",
      promptSnippet: j.request?.input?.[0]?.content?.[0]?.text?.slice(0, 100) || "Routine automation run"
    }));
  } catch (err) {
    console.warn("fetchAgentSchedules failed", err);
    return [];
  }
}


export async function updateAgentChannelConfig(agentId: string, channelType: string, newConfig: Record<string, any>): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const channelPath = `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/config/channels/${encodeURIComponent(channelType)}`;
    const getRes = await fetch(channelPath, { headers: { Accept: "application/json" } });
    if (!getRes.ok) throw new Error("Failed to fetch channel config");
    const current = await getRes.json();
    const putRes = await fetch(channelPath, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...current, ...newConfig })
    });
    return putRes.ok;
  } catch (err) {
    console.warn("updateAgentChannelConfig error", err);
    return false;
  }
}

export async function createOrUpdateSchedule(jobData: any): Promise<boolean> {
  try {
    const isEdit = Boolean(jobData.id && !jobData.id.startsWith("new-"));
    const endpoint = isEdit
      ? agentScopedPath(jobData.agentId, `cron/jobs/${encodeURIComponent(jobData.id)}`)
      : agentScopedPath(jobData.agentId, "cron/jobs");
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...(isEdit ? { id: jobData.id } : {}),
      name: jobData.name || "Automated Schedule",
      enabled: jobData.enabled !== false,
      schedule: {
        type: "cron",
        cron: jobData.cronExpr || "0 0 * * *",
        timezone: jobData.timezone || "Asia/Ho_Chi_Minh"
      },
      task_type: "agent",
      request: {
        input: [
          {
            role: "user",
            type: "message",
            content: [{ type: "text", text: jobData.promptSnippet || "Automated task execution" }]
          }
        ],
        session_id: `${jobData.targetChannel || "console"}:automated-${Date.now()}`,
        user_id: "agent360-scheduler"
      },
      dispatch: {
        type: "channel",
        channel: jobData.targetChannel || "console",
        target: { session_id: `${jobData.targetChannel || "console"}:automated` },
        mode: "final",
        silent: false
      },
      save_result_to_inbox: true,
      runtime: {
        max_concurrency: 1,
        timeout_seconds: 600,
        misfire_grace_seconds: 600
      }
    };

    const res = await fetch(endpoint, {
      method: method,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn("createOrUpdateSchedule error", err);
    return false;
  }
}

export interface TurnTelemetryPayload {
  agentId: string;
  sessionId: string;
  model: string;
  ttftMs: number;
  totalDurationMs: number;
  tokenCount: number;
  tokensPerSec: number;
  estimatedCostUsd: number;
  node: string;
}

export async function sendTurnTelemetryBeacon(payload: TurnTelemetryPayload): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/agents/analytics/turn-telemetry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.warn("Failed to dispatch turn telemetry beacon:", err);
    return false;
  }
}

export async function deleteSchedule(jobId: string, agentId?: string): Promise<boolean> {
  try {
    const res = await fetch(agentScopedPath(agentId, `cron/jobs/${encodeURIComponent(jobId)}`), {
      method: "DELETE",
      headers: { Accept: "application/json" }
    });
    return res.ok;
  } catch (err) {
    console.warn("deleteSchedule error", err);
    return false;
  }
}

export async function toggleScheduleStatus(jobId: string, currentEnabled: boolean, agentId?: string): Promise<boolean> {
  try {
    const action = currentEnabled ? "pause" : "resume";
    const res = await fetch(agentScopedPath(agentId, `cron/jobs/${encodeURIComponent(jobId)}/${action}`), {
      method: "POST",
      headers: { Accept: "application/json" }
    });
    return res.ok;
  } catch (err) {
    console.warn("toggleScheduleStatus error", err);
    return false;
  }
}

import { InfraNodeInstance, BotDeploymentInstance } from "../types/instance";

export async function fetchInfraInstances(): Promise<InfraNodeInstance[]> {
  try {
    const res = await authorizedFetch(`${API_BASE_URL}/instances`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch instances: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("fetchInfraInstances fallback:", err);
    return [];
  }
}

export async function fetchBotDeployments(botId: string): Promise<BotDeploymentInstance[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/bots/${encodeURIComponent(botId)}/deployments`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch bot deployments: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`fetchBotDeployments fallback for ${botId}:`, err);
    return [];
  }
}

export interface CompactContextResponse {
  success: boolean;
  agent_id: string;
  session_id?: string;
  action: string;
  details?: any;
}

export async function compactAgentContext(agentId: string, sessionId?: string, hint?: string): Promise<CompactContextResponse> {
  try {
    const cleanAgent = agentId.replace(/^bot:agent360:/, "").trim();
    const res = await authorizedFetch(`${API_BASE_URL}/agents/compact-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        agent_id: cleanAgent,
        session_id: sessionId,
        hint: hint,
        clean_history_gc: true,
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to compact context: ${res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn("compactAgentContext error:", err);
    return {
      success: false,
      agent_id: agentId,
      session_id: sessionId,
      action: "error",
      details: { error: err.message },
    };
  }
}

export interface ToolCallReceipt {
  schema: string;
  tool_call_id: string;
  bot_id: string;
  bot_binding_id?: string;
  deployment_id?: string;
  run_id: string;
  capability_id: string;
  input_hash?: string;
  authorization_decision_id: string;
  policy_hash: string;
  status: "proposed" | "denied" | "awaiting_approval" | "running" | "succeeded" | "failed" | "cancelled";
  output_hash?: string;
  error?: string;
}

export async function fetchToolCallReceipts(sessionId: string, agentId?: string): Promise<ToolCallReceipt[]> {
  try {
    const cleanAgent = agentId ? agentId.replace(/^bot:agent360:/, "").trim() : "";
    const url = cleanAgent
      ? `${API_BASE_URL}/agents/sessions/${encodeURIComponent(sessionId)}/tool-receipts?agentId=${encodeURIComponent(cleanAgent)}`
      : `${API_BASE_URL}/agents/sessions/${encodeURIComponent(sessionId)}/tool-receipts`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch receipts: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("fetchToolCallReceipts fallback:", err);
    return [];
  }
}

export interface AgentLoopModeConfig {
  mode: "default" | "goal" | "mission";
  updated_at?: string;
  options?: {
    max_steps?: number;
    require_verification?: boolean;
    auto_continue?: boolean;
  };
}

export async function fetchAgentLoopMode(agentId: string): Promise<AgentLoopModeConfig> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/loop-mode`, {
      headers: { Accept: "application/json", "X-Agent-Id": cleanId },
    }, cleanId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.mode) return data;
    }
  } catch (err) {
    console.warn(`fetchAgentLoopMode fallback for ${agentId}:`, err);
  }
  // Local fallback
  try {
    const saved = localStorage.getItem(`agent360_loop_mode_${agentId}`);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { mode: "default" };
}

export async function updateAgentLoopMode(agentId: string, mode: "default" | "goal" | "mission"): Promise<AgentLoopModeConfig> {
  const config: AgentLoopModeConfig = {
    mode,
    updated_at: new Date().toISOString(),
  };

  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/loop-mode`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Agent-Id": cleanId },
      body: JSON.stringify(config),
    }).catch(() => null);
  } catch {}

  try {
    localStorage.setItem(`agent360_loop_mode_${agentId}`, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent("agent360_loop_mode_changed", { detail: { agentId, mode } }));
  } catch {}

  return config;
}

export async function toggleAgentEnabled(agentId: string, enabled: boolean): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ enabled }),
    }, cleanId);

    if (res.ok) {
      return true;
    }
    console.warn(`toggleAgentEnabled failed: HTTP ${res.status}`);
    return false;
  } catch (err) {
    console.warn("toggleAgentEnabled error:", err);
    return false;
  }
}

export async function stopConsoleChat(sessionId: string, agentId?: string): Promise<boolean> {
  try {
    const cleanId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    const res = await authorizedFetch(`${API_BASE_URL}/agents/console/chat/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        sessionId,
        agent_id: cleanId,
        agentId: cleanId,
      }),
    }, cleanId).catch(() => null);

    if (res && res.ok) return true;

    const fallbackRes = await authorizedFetch(`${API_BASE_URL}/console/chat/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        sessionId,
        agent_id: cleanId,
        agentId: cleanId,
      }),
    }, cleanId).catch(() => null);

    return !!(fallbackRes && fallbackRes.ok);
  } catch (err) {
    console.warn("stopConsoleChat error:", err);
    return false;
  }
}


export async function fetchChatSessionRoom(agentId: string, chatId: string, ensure: boolean = false): Promise<SessionCollaborationRoom | null> {
  if (!agentId || !chatId) return null;
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/chats/${encodeURIComponent(chatId)}/room${ensure ? "?ensure=true" : ""}`,
      { headers: { Accept: "application/json" } },
      cleanId
    );
    if (!res.ok) return null;
    const data = await res.json();
    const room = data?.room || null;
    if (!ensure && room) {
      const hasCollab =
        (Array.isArray(room.participants) && room.participants.some((p: any) => p.role === "collaborator")) ||
        (Array.isArray(room.turns) && room.turns.some((t: any) => t.kind === "collaborator_reply" || t.kind === "collaborator_progress" || t.kind === "host_kickoff" || t.kind === "host_progress"));
      if (!hasCollab) return null;
    }
    return room;
  } catch {
    return null;
  }
}

export async function pullAgentIntoChatRoom(
  agentId: string,
  chatId: string,
  collaboratorAgentId: string,
  options: {
    objective?: string;
    contextSnippet?: string;
    hostSessionId?: string;
    autoDispatch?: boolean;
  } = {}
): Promise<{ room: SessionCollaborationRoom; collaborator_turn?: SessionRoomTurn } | null> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const cleanCollab = collaboratorAgentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/chats/${encodeURIComponent(chatId)}/room/pull`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          collaborator_agent_id: cleanCollab,
          objective: options.objective,
          context_snippet: options.contextSnippet,
          host_session_id: options.hostSessionId,
          auto_dispatch: Boolean(options.autoDispatch),
        }),
      },
      cleanId
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("pullAgentIntoChatRoom error:", err);
    return null;
  }
}

export async function postChatRoomMessage(
  agentId: string,
  chatId: string,
  body: {
    author_id: string;
    author_role?: string;
    kind?: string;
    text: string;
    target_agent_id?: string;
  }
): Promise<{ room: SessionCollaborationRoom; turn: SessionRoomTurn } | null> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/chats/${encodeURIComponent(chatId)}/room/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      },
      cleanId
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("postChatRoomMessage error:", err);
    return null;
  }
}

export async function updateChatRoomTriagePolicy(
  agentId: string,
  chatId: string,
  triagePolicy?: "auto" | "manual",
  hostExecutionPolicy?: "auto" | "co_execute" | "synthesize_only"
): Promise<SessionCollaborationRoom | null> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const payload: Record<string, string> = {};
    if (triagePolicy) payload.triage_policy = triagePolicy;
    if (hostExecutionPolicy) payload.host_execution_policy = hostExecutionPolicy;
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/chats/${encodeURIComponent(chatId)}/room/triage-policy`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      },
      cleanId
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.room || null;
  } catch (err) {
    console.warn("updateChatRoomTriagePolicy error:", err);
    return null;
  }
}


export async function updateChatTitle(
  agentId: string,
  chatId: string,
  title: string
): Promise<{ success: boolean; title: string } | null> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/chats/${encodeURIComponent(chatId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ title, name: title }),
      },
      cleanId
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("updateChatTitle error:", err);
    return null;
  }
}

export async function updateChatRoomTitle(
  agentId: string,
  chatId: string,
  title: string
): Promise<SessionCollaborationRoom | null> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/chats/${encodeURIComponent(chatId)}/room/title`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ title }),
      },
      cleanId
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.room || null;
  } catch {
    return null;
  }
}


export interface SubmitMessageReactionPayload {
  emoji: string;
  action?: "add" | "remove";
  session_id?: string;
  message_snippet?: string;
  target_agent_id?: string;
  trigger_agent_response?: boolean;
}

export interface ReactionClassification {
  sentiment: "positive" | "negative" | "neutral";
  category: "praise" | "approve" | "disapprove" | "sad_frustrated" | "surprised_curious" | "amused" | "feedback";
  labelVi: string;
}

export function classifyReactionEmoji(emoji: string): ReactionClassification {
  switch (emoji) {
    case "❤️":
    case "🔥":
    case "🚀":
    case "🎉":
    case "💯":
    case "👏":
    case "🤩":
    case "😍":
    case "🙌":
    case "⚡":
    case "💪":
      return { sentiment: "positive", category: "praise", labelVi: "Khen ngợi / Rất tốt" };
    case "👍":
    case "🤝":
    case "🫡":
    case "🎯":
    case "💡":
    case "🙏":
    case "☕":
    case "🤖":
      return { sentiment: "positive", category: "approve", labelVi: "Đồng ý / Đúng ý" };
    case "👎":
      return { sentiment: "negative", category: "disapprove", labelVi: "Chưa hài lòng / Không đúng" };
    case "😢":
      return { sentiment: "negative", category: "sad_frustrated", labelVi: "Hụt hẫng / Cần khắc phục" };
    case "😮":
    case "👀":
      return { sentiment: "neutral", category: "surprised_curious", labelVi: "Ngạc nhiên / Cần làm rõ" };
    case "😆":
      return { sentiment: "positive", category: "amused", labelVi: "Thú vị / Vui vẻ" };
    default:
      return { sentiment: "neutral", category: "feedback", labelVi: "Đánh giá" };
  }
}

export async function submitMessageReaction(
  agentId: string,
  chatId: string,
  messageId: string,
  payload: SubmitMessageReactionPayload
): Promise<Response> {
  const cleanId = agentId.replace(/^bot:agent360:/, "");
  const authHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream, application/json",
    "X-Agent-Id": cleanId,
  };
  Object.assign(authHeaders, getAuthHeaders(cleanId));

  const url = `/api/agents/${encodeURIComponent(cleanId)}/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/reactions`;
  return await fetch(url, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(payload),
  });
}


export interface MessageReactionSummaryDto {
  agent_id: string;
  total_reactions: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  top_emojis: Record<string, number>;
}

export async function fetchAgentReactionSummary(
  agentId: string
): Promise<MessageReactionSummaryDto | null> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/reactions/summary`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
      cleanId
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


// ==========================================
// Agent Webhooks & QwenPaw Bridge APIs
// ==========================================

export interface OutboundWebhookTarget {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  events?: string[];
  secret?: string;
  headers?: Record<string, string>;
}

export interface AgentWebhookConfig {
  agent_id: string;
  enabled: boolean;
  require_hmac: boolean;
  signing_secret_masked: string;
  signing_secret_preview: string;
  inbound_webhook_url: string;
  agentteams_webhook_url: string;
  allowed_events: string[];
  default_channel: string;
  default_session_prefix: string;
  auto_trigger_agent_turn: boolean;
  forward_to_matrix_room: boolean;
  rate_limit_per_minute: number;
  deduplication_window_seconds: number;
  prompt_template: string;
  outbound_webhooks: OutboundWebhookTarget[];
  matrix_channel_enabled: boolean;
  matrix_homeserver?: string;
  matrix_user_id?: string;
  qwenpaw_runtime_status: string;
  qwenpaw_node: string;
  updated_at: string;
}

export interface AgentWebhookDeliveryRecord {
  id: string;
  agent_id: string;
  direction: "inbound" | "outbound" | "qwenpaw_bridge";
  event_type: string;
  source: string;
  session_id?: string | null;
  status: "delivered" | "triggered" | "rejected" | "duplicate" | "failed" | string;
  http_status: number;
  latency_ms: number;
  payload_preview: string;
  response_preview?: string | null;
  signature_verified: boolean;
  timestamp: string;
  retry_count?: number;
  target_url?: string | null;
  raw_payload?: string | null;
}


export interface WebhookDeadLetterRecord {
  id: string;
  delivery_id: string;
  agent_id: string;
  target_name: string;
  target_url: string;
  event_type: string;
  session_id?: string | null;
  total_attempts: number;
  last_http_status: number;
  last_error: string;
  raw_payload?: string | null;
  created_at: string;
  resolved: boolean;
}

export interface QwenPawBridgeProbeResult {
  agent_id: string;
  node: string;
  instance_name: string;
  is_qwenpaw_runtime: boolean;
  runtime_reachable: boolean;
  runtime_status: string;
  latency_ms: number;
  active_channels: string[];
  matrix_configured: boolean;
  heartbeat_enabled: boolean;
  running_task_count: number;
  checked_at: string;
  message: string;
}

export async function fetchAgentWebhookConfig(agentId: string): Promise<AgentWebhookConfig | null> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/webhooks/config`,
      { headers: { Accept: "application/json" } },
      cleanId
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("fetchAgentWebhookConfig error:", err);
    return null;
  }
}

export async function updateAgentWebhookConfig(
  agentId: string,
  payload: Partial<{
    enabled: boolean;
    require_hmac: boolean;
    allowed_events: string[];
    default_channel: string;
    default_session_prefix: string;
    auto_trigger_agent_turn: boolean;
    forward_to_matrix_room: boolean;
    rate_limit_per_minute: number;
    deduplication_window_seconds: number;
    prompt_template: string;
    outbound_webhooks: OutboundWebhookTarget[];
    matrix_channel_enabled: boolean;
    matrix_homeserver: string;
    matrix_user_id: string;
  }>
): Promise<AgentWebhookConfig | null> {
  const cleanId = agentId.replace(/^bot:agent360:/, "");
  const res = await authorizedFetch(
    `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/webhooks/config`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    },
    cleanId
  );
  if (!res.ok) {
    throw new Error(`Failed to update webhook config (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function rotateAgentWebhookSecret(agentId: string): Promise<{
  success: boolean;
  agent_id: string;
  new_secret: string;
  config: AgentWebhookConfig;
  message: string;
}> {
  const cleanId = agentId.replace(/^bot:agent360:/, "");
  const res = await authorizedFetch(
    `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/webhooks/rotate-secret`,
    { method: "POST", headers: { Accept: "application/json" } },
    cleanId
  );
  if (!res.ok) {
    throw new Error(`Failed to rotate webhook secret (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function fetchAgentWebhookDeliveries(
  agentId: string,
  limit: number = 40
): Promise<AgentWebhookDeliveryRecord[]> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await authorizedFetch(
      `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/webhooks/deliveries?limit=${limit}`,
      { headers: { Accept: "application/json" } },
      cleanId
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function probeAgentQwenPawBridge(agentId: string): Promise<QwenPawBridgeProbeResult> {
  const cleanId = agentId.replace(/^bot:agent360:/, "");
  const res = await authorizedFetch(
    `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/webhooks/probe-qwenpaw`,
    { method: "POST", headers: { Accept: "application/json" } },
    cleanId
  );
  if (!res.ok) {
    throw new Error(`Probe QwenPaw failed (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function testAgentWebhookDispatch(
  agentId: string,
  payload?: {
    event_type?: string;
    source?: string;
    session_id?: string;
    channel?: string;
    message?: string;
    trigger_turn?: boolean;
    wait_for_completion?: boolean;
  }
): Promise<{
  success: boolean;
  status: string;
  event_id: string;
  agent_id: string;
  session_id: string;
  latency_ms: number;
  assistant_reply?: string | null;
  delivery: AgentWebhookDeliveryRecord;
}> {
  const cleanId = agentId.replace(/^bot:agent360:/, "");
  const res = await authorizedFetch(
    `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/webhooks/test`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload || {}),
    },
    cleanId
  );
  if (!res.ok) {
    throw new Error(`Test webhook dispatch failed (HTTP ${res.status})`);
  }
  return await res.json();
}


export async function replayAgentWebhookDelivery(
  agentId: string,
  deliveryId: string
): Promise<{
  success: boolean;
  message: string;
  delivery: AgentWebhookDeliveryRecord;
}> {
  const cleanId = agentId.replace(/^bot:agent360:/, "");
  const res = await authorizedFetch(
    `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/webhooks/deliveries/${encodeURIComponent(deliveryId)}/replay`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
    },
    cleanId
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Lỗi phát lại Webhook delivery (HTTP ${res.status})`);
  }
  return res.json();
}

export async function fetchAgentWebhookDeadLetters(
  agentId: string,
  unresolvedOnly?: boolean,
  limit: number = 50
): Promise<WebhookDeadLetterRecord[]> {
  const cleanId = agentId.replace(/^bot:agent360:/, "");
  const qs = new URLSearchParams();
  if (unresolvedOnly) qs.set("unresolvedOnly", "true");
  if (limit) qs.set("limit", String(limit));
  const res = await authorizedFetch(
    `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/webhooks/dlq?${qs.toString()}`,
    { headers: { Accept: "application/json" } },
    cleanId
  );
  if (!res.ok) return [];
  return res.json();
}

export async function resolveAgentWebhookDeadLetter(
  agentId: string,
  dlqId: string
): Promise<{ success: boolean; message: string }> {
  const cleanId = agentId.replace(/^bot:agent360:/, "");
  const res = await authorizedFetch(
    `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/webhooks/dlq/${encodeURIComponent(dlqId)}/resolve`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
    },
    cleanId
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Lỗi đánh dấu xử lý sự cố DLQ (HTTP ${res.status})`);
  }
  return res.json();
}
