export interface TokenUsageModelDetail {
  prompt_tokens: number;
  completion_tokens: number;
  cache_read_tokens: number;
  call_count: number;
  provider_id?: string;
  model?: string;
}

export interface TokenUsageReport {
  total_prompt_tokens: number;
  total_completion_tokens: number;
  total_cache_read_tokens: number;
  cache_hit_rate: number;
  total_calls: number;
  by_model?: Record<string, TokenUsageModelDetail>;
}

export async function fetchTokenUsageReport(): Promise<TokenUsageReport | null> {
  try {
    const res = await fetch("/api/v1/agents/analytics/token-usage", {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch analytics: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Metrics API fallback", err);
    return null;
  }
}
