export interface PendingApproval {
  request_id: string;
  session_id: string;
  root_session_id?: string;
  agent_id?: string;
  tool_name: string;
  severity?: string;
  created_at?: string;
  reasoning?: string;
}

export async function fetchPendingApprovals(sessionId?: string): Promise<PendingApproval[]> {
  try {
    const url = sessionId
      ? `/api/v1/approvals?sessionId=${encodeURIComponent(sessionId)}`
      : `/api/v1/approvals`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch approvals: ${res.statusText}`);
    }
    const data = await res.json();
    return data?.pending_approvals || [];
  } catch (err) {
    console.warn("Approvals endpoint fallback", err);
    return [];
  }
}

export async function approveToolExecution(
  requestId: string,
  sessionId: string,
  scope: "exact" | "similar" = "exact"
): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/v1/approvals/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      request_id: requestId,
      session_id: sessionId,
      scope: scope
    })
  });
  if (!res.ok) {
    throw new Error(`Approve failed: ${res.statusText}`);
  }
  return await res.json();
}

export async function denyToolExecution(
  requestId: string,
  sessionId: string,
  reason: string = "User denied via Agent360 Console"
): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/v1/approvals/deny", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      request_id: requestId,
      session_id: sessionId,
      reason: reason
    })
  });
  if (!res.ok) {
    throw new Error(`Deny failed: ${res.statusText}`);
  }
  return await res.json();
}
