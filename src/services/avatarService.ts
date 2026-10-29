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
    window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { agentId, config: updated } }));
    if (clean !== agentId) {
      window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { agentId: clean, config: updated } }));
    }
    if (full !== agentId) {
      window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { agentId: full, config: updated } }));
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
    let changed = false;
    if (all[clean]) {
      delete all[clean];
      changed = true;
    }
    if (all[agentId]) {
      delete all[agentId];
      changed = true;
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { agentId, config: null } }));
      if (clean !== agentId) {
        window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { agentId: clean, config: null } }));
      }
    }
  } catch (err) {
    console.error("[AvatarService] Failed to reset avatar config:", err);
  }
}
