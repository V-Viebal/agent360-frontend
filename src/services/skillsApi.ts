export interface SkillItem {
  name: string;
  description?: string;
  source?: string;
  enabled: boolean;
  channels?: string[];
  tags?: string[];
  last_updated?: string;
}

export async function fetchLiveSkills(): Promise<SkillItem[]> {
  try {
    const res = await fetch("/api/v1/agents/skills", {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch skills: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Skills API fallback", err);
    return [];
  }
}
