export type AvatarType = "blob" | "role" | "icon" | "emoji" | "image";

export interface BlobAvatarOptions {
  shape?: string;
  expression?: string;
  color?: string;
  animation?: string;
  seed?: number | string;
}

export interface CustomAvatarConfig {
  type: AvatarType;
  blob?: BlobAvatarOptions;
  iconName?: string;
  colorPreset?: string;
  emoji?: string;
  imageUrl?: string;
  updatedAt?: number;
}

const STORAGE_KEY = "agent360_agent_avatars";

export function normalizeAgentIdKey(agentId?: string): string {
  if (!agentId) return "";
  return agentId.replace(/^bot:agent360:/i, "").trim().toLowerCase();
}

export function getAllAgentAvatarConfigs(): Record<string, CustomAvatarConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getAgentAvatarConfig(agentId?: string): CustomAvatarConfig | null {
  if (!agentId) return null;
  const all = getAllAgentAvatarConfigs();
  const clean = normalizeAgentIdKey(agentId);
  return all[clean] || all[agentId] || all[`bot:agent360:${clean}`] || null;
}

export function saveAgentAvatarConfig(agentId: string, config: CustomAvatarConfig): void {
  if (!agentId) return;
  try {
    const all = getAllAgentAvatarConfigs();
    const clean = normalizeAgentIdKey(agentId);
    const full = `bot:agent360:${clean}`;
    const updated = {
      ...config,
      updatedAt: Date.now(),
    };
    all[clean] = updated;
    all[full] = updated;
    all[agentId] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    // Dispatch custom event to notify components across the workspace
    const detail = { agentId, config: updated, cleanId: clean, fullId: full };
    window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail }));
    pushAgentProfileToBackend(agentId, updated, getCustomAgentName(agentId) || undefined).catch?.(() => {});
    if (clean !== agentId) {
      window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { ...detail, agentId: clean } }));
    }
    if (full !== agentId) {
      window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { ...detail, agentId: full } }));
    }
  } catch (err) {
    console.error("[AvatarService] Failed to save avatar config:", err);
  }
}

export function resetAgentAvatarConfig(agentId: string): void {
  if (!agentId) return;
  try {
    const all = getAllAgentAvatarConfigs();
    const clean = normalizeAgentIdKey(agentId);
    const full = `bot:agent360:${clean}`;
    let changed = false;
    if (all[clean]) {
      delete all[clean];
      changed = true;
    }
    if (all[agentId]) {
      delete all[agentId];
      changed = true;
    }
    if (all[full]) {
      delete all[full];
      changed = true;
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      const detail = { agentId, config: null, cleanId: clean, fullId: full };
      window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail }));
      pushAgentProfileToBackend(agentId, null, getCustomAgentName(agentId) || undefined).catch?.(() => {});
      if (clean !== agentId) {
        window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { ...detail, agentId: clean } }));
      }
      if (full !== agentId) {
        window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { ...detail, agentId: full } }));
      }
    }
  } catch (err) {
    console.error("[AvatarService] Failed to reset avatar config:", err);
  }
}

const AGENT_NAMES_KEY = "agent360_custom_agent_names";

export function getAllCustomAgentNames(): Record<string, string> {
  try {
    const raw = localStorage.getItem(AGENT_NAMES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getCustomAgentName(agentId?: string): string | null {
  if (!agentId) return null;
  const all = getAllCustomAgentNames();
  const clean = normalizeAgentIdKey(agentId);
  return all[clean] || all[agentId] || all[`bot:agent360:${clean}`] || null;
}

export function saveCustomAgentName(agentId: string, name: string): void {
  if (!agentId) return;
  try {
    const all = getAllCustomAgentNames();
    const clean = normalizeAgentIdKey(agentId);
    const full = `bot:agent360:${clean}`;
    const trimmed = name.trim();
    if (trimmed) {
      all[clean] = trimmed;
      all[full] = trimmed;
      all[agentId] = trimmed;
    } else {
      delete all[clean];
      delete all[full];
      delete all[agentId];
    }
    localStorage.setItem(AGENT_NAMES_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("agent-name-updated", { detail: { agentId, name: trimmed, cleanId: clean } }));
    pushAgentProfileToBackend(agentId, getAgentAvatarConfig(agentId), trimmed).catch?.(() => {});
  } catch (err) {
    console.error("[AvatarService] Failed to save custom agent name:", err);
  }
}

// Sync with Skyer Backend API (/api/v1/agents/profiles-catalog and /api/v1/agents/{agentId}/profile-config)
let isCatalogSynced = false;

export async function syncAgentProfilesCatalogFromBackend(): Promise<void> {
  if (isCatalogSynced) return;
  try {
    const res = await fetch("/api/v1/agents/profiles-catalog", {
      headers: { Accept: "application/json" }
    });
    if (res.ok) {
      const catalog = await res.json();
      if (catalog && typeof catalog === "object") {
        const localAvatars = getAllAgentAvatarConfigs();
        const localNames = getAllCustomAgentNames();
        let avatarsChanged = false;
        let namesChanged = false;

        for (const [key, item] of Object.entries(catalog as Record<string, any>)) {
          if (!item) continue;
          const clean = normalizeAgentIdKey(key);
          const full = "bot:agent360:" + clean;

          if (item.avatar) {
            localAvatars[clean] = item.avatar;
            localAvatars[full] = item.avatar;
            localAvatars[key] = item.avatar;
            avatarsChanged = true;
          }
          if (item.name) {
            localNames[clean] = item.name;
            localNames[full] = item.name;
            localNames[key] = item.name;
            namesChanged = true;
          }
        }

        if (avatarsChanged) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(localAvatars));
          window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { sync: true } }));
        }
        if (namesChanged) {
          localStorage.setItem(AGENT_NAMES_KEY, JSON.stringify(localNames));
          window.dispatchEvent(new CustomEvent("agent-name-updated", { detail: { sync: true } }));
        }
        isCatalogSynced = true;
      }
    }
  } catch (err) {
    console.warn("[AvatarService] Could not sync catalog from backend:", err);
  }
}

export async function fetchRemoteAgentProfile(agentId: string): Promise<void> {
  if (!agentId) return;
  const clean = normalizeAgentIdKey(agentId);
  try {
    const res = await fetch("/api/v1/agents/" + encodeURIComponent(clean) + "/profile-config", {
      headers: { Accept: "application/json" }
    });
    if (res.ok) {
      const data = await res.json();
      if (data) {
        const full = "bot:agent360:" + clean;
        if (data.avatar) {
          const all = getAllAgentAvatarConfigs();
          all[clean] = data.avatar;
          all[full] = data.avatar;
          all[agentId] = data.avatar;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
          const detail = { agentId, config: data.avatar, cleanId: clean, fullId: full };
          window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail }));
        }
        if (data.name) {
          const allNames = getAllCustomAgentNames();
          allNames[clean] = data.name;
          allNames[full] = data.name;
          allNames[agentId] = data.name;
          localStorage.setItem(AGENT_NAMES_KEY, JSON.stringify(allNames));
          window.dispatchEvent(new CustomEvent("agent-name-updated", { detail: { agentId, name: data.name, cleanId: clean } }));
        }
      }
    }
  } catch {}
}

export async function pushAgentProfileToBackend(agentId: string, avatarConfig: CustomAvatarConfig | null, name?: string): Promise<void> {
  if (!agentId) return;
  const clean = normalizeAgentIdKey(agentId);
  try {
    const payload: Record<string, any> = {};
    if (avatarConfig !== undefined) payload.avatar = avatarConfig;
    if (name !== undefined) payload.name = name;

    await fetch("/api/v1/agents/" + encodeURIComponent(clean) + "/profile-config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("[AvatarService] Failed to push profile to backend:", err);
  }
}

export function hydrateAgentCustomProfileFromDto(agentId: string, slug: string | undefined, avatarConfig: CustomAvatarConfig | null | undefined, customName?: string): void {
  const key = slug || agentId;
  if (!key) return;
  const clean = normalizeAgentIdKey(key);
  const full = "bot:agent360:" + clean;

  if (avatarConfig) {
    try {
      const all = getAllAgentAvatarConfigs();
      all[clean] = avatarConfig;
      all[full] = avatarConfig;
      if (agentId) all[agentId] = avatarConfig;
      if (slug) all[slug] = avatarConfig;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { agentId: clean, cleanId: clean, fullId: full, config: avatarConfig } }));
    } catch {}
  }
}

export function slugifyAgentUrlAlias(name?: string | null): string {
  if (!name) return "";
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAgentRouteSegment(agent?: { id?: string; slug?: string; name?: string } | null, fallbackId?: string): string {
  const baseSlug = (agent?.slug || agent?.id || fallbackId || "").replace(/^bot:agent360:/i, "");
  const customName = getCustomAgentName(agent?.id) || getCustomAgentName(agent?.slug) || (fallbackId ? getCustomAgentName(fallbackId) : null);
  const alias = slugifyAgentUrlAlias(customName);
  return alias || baseSlug;
}

export function resolveCanonicalAgentSlugFromAlias(param?: string | null): string | null {
  if (!param) return null;
  const targetAlias = slugifyAgentUrlAlias(param);
  if (!targetAlias) return null;
  const allNames = getAllCustomAgentNames();
  for (const [key, customName] of Object.entries(allNames)) {
    if (slugifyAgentUrlAlias(customName) === targetAlias) {
      return normalizeAgentIdKey(key);
    }
  }
  return null;
}
