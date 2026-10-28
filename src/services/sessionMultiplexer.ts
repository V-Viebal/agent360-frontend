import { API_BASE_URL } from "./agentApi";

export interface SessionTurnUpdate {
  type: "session_turn_update";
  session_id: string;
  is_running: boolean;
  status: string;
  agent_id?: string;
  channel?: string;
  id?: string;
  content_snippet?: string;
  timestamp?: string;
}

export interface SessionUnreadUpdate {
  type: "session_unread_update";
  session_id: string;
  is_unread: boolean;
  timestamp?: string;
}

export interface ActiveSessionsSnapshot {
  type: "active_sessions_snapshot";
  active_session_ids: string[];
  active_agent_sessions?: Record<string, string[]>;
  unread_session_ids: string[];
  timestamp?: string;
}

export interface ComposioConnectionEvent {
  type: "composio_connection_activated";
  app_slug: string;
  agent_id: string;
  status: string;
  event_id?: string;
  message?: string;
  timestamp?: string;
}

export interface AgentWebhookDeliveryWsEvent {
  type: "agent_webhook_delivery";
  agent_id: string;
  delivery: any;
}

export interface AgentWebhookDlqAlertWsEvent {
  type: "agent_webhook_dlq_alert";
  agent_id: string;
  dlq_item: any;
  message: string;
}

export type MultiplexerEvent = SessionTurnUpdate | SessionUnreadUpdate | ActiveSessionsSnapshot | ComposioConnectionEvent | AgentWebhookDeliveryWsEvent | AgentWebhookDlqAlertWsEvent;

export interface MultiplexerHandlers {
  onSnapshot?: (snapshot: ActiveSessionsSnapshot) => void;
  onTurnUpdate?: (update: SessionTurnUpdate) => void;
  onUnreadUpdate?: (update: SessionUnreadUpdate) => void;
  onComposioConnection?: (ev: ComposioConnectionEvent) => void;
}

/**
 * Connects to the backend real-time session multiplexer via WebSocket with automatic SSE fallback.
 * Emits live updates across all session turns and channels without polling.
 */
export function connectSessionMultiplexer(handlers: MultiplexerHandlers): () => void {
  let ws: WebSocket | null = null;
  let sse: EventSource | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let disposed = false;
  let reconnectAttempts = 0;

  function connectWs() {
    if (disposed) return;

    try {
      const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
      const wsProto = isHttps ? "wss:" : "ws:";
      const host = typeof window !== "undefined" ? window.location.host : "localhost";
      const wsUrl = `${wsProto}//${host}/api/v1/agents/ws/sessions`;

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        reconnectAttempts = 0;
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(() => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify({ action: "ping" }));
            } catch {}
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        try {
          const data: MultiplexerEvent = JSON.parse(event.data);
          if (data.type === "active_sessions_snapshot" && handlers.onSnapshot) {
            handlers.onSnapshot(data);
          } else if (data.type === "session_turn_update" && handlers.onTurnUpdate) {
            handlers.onTurnUpdate(data);
          } else if (data.type === "session_unread_update" && handlers.onUnreadUpdate) {
            handlers.onUnreadUpdate(data);
          } else if (data.type === "composio_connection_activated") {
            if (handlers.onComposioConnection) handlers.onComposioConnection(data);
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("composio:connection_activated", { detail: data }));
            }
          } else if (data.type === "agent_webhook_delivery") {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("agent:webhook_delivery", { detail: data }));
            }
          } else if (data.type === "agent_webhook_dlq_alert") {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("agent:webhook_dlq_alert", { detail: data }));
            }
          }
        } catch {}
      };

      ws.onclose = () => {
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        if (disposed) return;
        reconnectAttempts++;
        if (reconnectAttempts > 3) {
          // Fall back to SSE multiplexer if WebSocket cannot connect
          connectSse();
        } else {
          const delay = Math.min(reconnectAttempts * 1500, 10000);
          reconnectTimer = setTimeout(connectWs, delay);
        }
      };

      ws.onerror = () => {
        try { ws?.close(); } catch {}
      };
    } catch {
      connectSse();
    }
  }

  function connectSse() {
    if (disposed) return;

    try {
      const sseUrl = `${API_BASE_URL}/chats/stream`;
      sse = new EventSource(sseUrl);

      sse.addEventListener("snapshot", (e) => {
        try {
          const snapshot = JSON.parse(e.data);
          if (handlers.onSnapshot) handlers.onSnapshot(snapshot);
        } catch {}
      });

      sse.addEventListener("session_event", (e) => {
        try {
          const update = JSON.parse(e.data);
          if (update.type === "session_turn_update" && handlers.onTurnUpdate) {
            handlers.onTurnUpdate(update);
          } else if (update.type === "session_unread_update" && handlers.onUnreadUpdate) {
            handlers.onUnreadUpdate(update);
          } else if (update.type === "composio_connection_activated") {
            if (handlers.onComposioConnection) handlers.onComposioConnection(update);
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("composio:connection_activated", { detail: update }));
            }
          } else if (update.type === "agent_webhook_delivery") {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("agent:webhook_delivery", { detail: update }));
            }
          } else if (update.type === "agent_webhook_dlq_alert") {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("agent:webhook_dlq_alert", { detail: update }));
            }
          }
        } catch {}
      });

      sse.onerror = () => {
        if (disposed) return;
        sse?.close();
        // Try recovering WebSocket connection after backoff
        reconnectTimer = setTimeout(() => {
          reconnectAttempts = 0;
          connectWs();
        }, 8000);
      };
    } catch {
      // Ignore
    }
  }

  connectWs();

  return () => {
    disposed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    if (ws) {
      try { ws.close(); } catch {}
      ws = null;
    }
    if (sse) {
      try { sse.close(); } catch {}
      sse = null;
    }
  };
}
