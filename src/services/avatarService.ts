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
  return all[agentId] || null;
}

export function saveAgentAvatarConfig(agentId: string, config: CustomAvatarConfig): void {
  if (!agentId) return;
  try {
    const all = getAllAgentAvatarConfigs();
    all[agentId] = {
      ...config,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    // Dispatch custom event to notify components across the workspace
    window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { agentId, config } }));
  } catch (err) {
    console.error("[AvatarService] Failed to save avatar config:", err);
  }
}

export function resetAgentAvatarConfig(agentId: string): void {
  if (!agentId) return;
  try {
    const all = getAllAgentAvatarConfigs();
    if (all[agentId]) {
      delete all[agentId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent("agent-avatar-updated", { detail: { agentId, config: null } }));
    }
  } catch (err) {
    console.error("[AvatarService] Failed to reset avatar config:", err);
  }
}
