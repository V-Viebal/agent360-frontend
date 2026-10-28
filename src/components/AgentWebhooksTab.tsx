import React, { useState, useEffect } from "react";
import {
  Activity,
  Shield,
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Terminal,
  ArrowUpRight,
  ArrowDownLeft,
  Radio,
  Sparkles,
  Server,
  RotateCcw,
} from "lucide-react";
import { getAgentColorTheme } from "./AgentAvatar";
import {
  AgentWebhookConfig,
  AgentWebhookDeliveryRecord,
  OutboundWebhookTarget,
  QwenPawBridgeProbeResult,
  fetchAgentWebhookConfig,
  updateAgentWebhookConfig,
  rotateAgentWebhookSecret,
  fetchAgentWebhookDeliveries,
  probeAgentQwenPawBridge,
  testAgentWebhookDispatch,
  replayAgentWebhookDelivery,
  fetchAgentWebhookDeadLetters,
  resolveAgentWebhookDeadLetter,
  WebhookDeadLetterRecord,
} from "../services/agentApi";

interface AgentWebhooksTabProps {
  agentId: string;
  agentName: string;
  agentSlug?: string;
}

const AVAILABLE_WEBHOOK_EVENTS = [
  { id: "task.trigger", label: "task.trigger (Kích hoạt tác vụ)" },
  { id: "message.inbound", label: "message.inbound (Tin nhắn đến)" },
  { id: "alert.incident", label: "alert.incident (Cảnh báo sự cố)" },
  { id: "matrix.room.message", label: "matrix.room.message (Sự kiện phòng Matrix)" },
  { id: "cron.wake", label: "cron.wake (Đánh thức định kỳ)" },
  { id: "custom.webhook", label: "custom.webhook (Tùy chỉnh)" },
];

export function AgentWebhooksTab({
  agentId,
  agentName,
  agentSlug,
}: AgentWebhooksTabProps) {
  const agentTheme = getAgentColorTheme(agentId, agentName);
  const [config, setConfig] = useState<AgentWebhookConfig | null>(null);
  const [deliveries, setDeliveries] = useState<AgentWebhookDeliveryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [probing, setProbing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [replayingId, setReplayingId] = useState<string | null>(null);
  const [dlqItems, setDlqItems] = useState<WebhookDeadLetterRecord[]>([]);
  const [resolvingDlqId, setResolvingDlqId] = useState<string | null>(null);

  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [probeResult, setProbeResult] = useState<QwenPawBridgeProbeResult | null>(null);
  const [testReply, setTestReply] = useState<{ status: string; reply?: string | null; latencyMs: number; sessionId: string } | null>(null);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Editable form states
  const [enabled, setEnabled] = useState(true);
  const [requireHmac, setRequireHmac] = useState(false);
  const [autoTriggerTurn, setAutoTriggerTurn] = useState(true);
  const [forwardToMatrix, setForwardToMatrix] = useState(false);
  const [defaultChannel, setDefaultChannel] = useState("console");
  const [defaultSessionPrefix, setDefaultSessionPrefix] = useState("");
  const [promptTemplate, setPromptTemplate] = useState("");
  const [allowedEvents, setAllowedEvents] = useState<string[]>([]);
  const [outboundList, setOutboundList] = useState<OutboundWebhookTarget[]>([]);
  const [matrixEnabled, setMatrixEnabled] = useState(false);
  const [matrixHomeserver, setMatrixHomeserver] = useState("");
  const [matrixUserId, setMatrixUserId] = useState("");

  // Test sandbox inputs
  const [testEventType, setTestEventType] = useState("task.trigger");
  const [testMessage, setTestMessage] = useState("");
  const [waitForTestCompletion, setWaitForTestCompletion] = useState(true);

  // New outbound target form
  const [newOutboundName, setNewOutboundName] = useState("");
  const [newOutboundUrl, setNewOutboundUrl] = useState("");
  const [newOutboundSecret, setNewOutboundSecret] = useState("");

  const cleanSlug = (agentSlug || agentId).replace(/^bot:agent360:/, "").toLowerCase();

  const loadData = async () => {
    if (!agentId) return;
    setLoading(true);
    try {
      const [cfg, logs, dlq] = await Promise.all([
        fetchAgentWebhookConfig(agentId),
        fetchAgentWebhookDeliveries(agentId, 40),
        fetchAgentWebhookDeadLetters(agentId, false, 50),
      ]);
      if (cfg) {
        setConfig(cfg);
        setEnabled(cfg.enabled);
        setRequireHmac(cfg.require_hmac);
        setAutoTriggerTurn(cfg.auto_trigger_agent_turn);
        setForwardToMatrix(cfg.forward_to_matrix_room);
        setDefaultChannel(cfg.default_channel || "console");
        setDefaultSessionPrefix(cfg.default_session_prefix || `wh-${cleanSlug}`);
        setPromptTemplate(cfg.prompt_template || "[WEBHOOK EVENT: {{event_type}} | Source: {{source}}]\n{{message}}");
        setAllowedEvents(cfg.allowed_events || []);
        setOutboundList(cfg.outbound_webhooks || []);
        setMatrixEnabled(cfg.matrix_channel_enabled);
        setMatrixHomeserver(cfg.matrix_homeserver || "https://matrix-core.hmz.one");
        setMatrixUserId(cfg.matrix_user_id || `@${cleanSlug}:matrix-core.hmz.one`);
      }
      setDeliveries(logs);
      setDlqItems(dlq);
    } catch (err: any) {
      console.error("[AgentWebhooksTab] load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRevealedSecret(null);
    setProbeResult(null);
    setTestReply(null);
    setTestMessage(`Kiểm thử kết nối Webhook -> QwenPaw API cho ${agentName}. Hãy xác nhận ngắn gọn 1 câu.`);
    loadData();
  }, [agentId]);

  // Realtime WebSocket delivery listener
  useEffect(() => {
    const handleWsDelivery = (ev: Event) => {
      const detail = (ev as CustomEvent).detail;
      if (detail?.agent_id && detail.agent_id.toLowerCase() === cleanSlug && detail.delivery) {
        setDeliveries((prev) => {
          if (prev.some((d) => d.id === detail.delivery.id)) return prev;
          return [detail.delivery, ...prev].slice(0, 50);
        });
      }
    };
    const handleWsDlq = (ev: Event) => {
      const detail = (ev as CustomEvent).detail;
      if (detail?.agent_id && detail.agent_id.toLowerCase() === cleanSlug && detail.dlq_item) {
        setDlqItems((prev) => [detail.dlq_item, ...prev.filter((x) => x.id !== detail.dlq_item.id)].slice(0, 50));
        showToast(detail.message || "Cảnh báo: Outbound webhook đã rơi vào hàng đợi Dead-Letter (DLQ)!", "error");
      }
    };
    window.addEventListener("agent:webhook_delivery", handleWsDelivery);
    window.addEventListener("agent:webhook_dlq_alert", handleWsDlq);
    return () => {
      window.removeEventListener("agent:webhook_delivery", handleWsDelivery);
      window.removeEventListener("agent:webhook_dlq_alert", handleWsDlq);
    };
  }, [cleanSlug]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const updated = await updateAgentWebhookConfig(agentId, {
        enabled,
        require_hmac: requireHmac,
        allowed_events: allowedEvents,
        default_channel: defaultChannel,
        default_session_prefix: defaultSessionPrefix,
        auto_trigger_agent_turn: autoTriggerTurn,
        forward_to_matrix_room: forwardToMatrix,
        prompt_template: promptTemplate,
        outbound_webhooks: outboundList,
        matrix_channel_enabled: matrixEnabled,
        matrix_homeserver: matrixHomeserver,
        matrix_user_id: matrixUserId,
      });
      if (updated) {
        setConfig(updated);
        showToast(`✓ Đã lưu cấu hình Webhook & đồng bộ kênh xuống QwenPaw runtime cho ${agentName}!`);
      }
    } catch (err: any) {
      showToast(err.message || "Không thể lưu cấu hình Webhook", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRotateSecret = async () => {
    setRotating(true);
    try {
      const res = await rotateAgentWebhookSecret(agentId);
      setRevealedSecret(res.new_secret);
      setConfig(res.config);
      showToast(res.message, "success");
    } catch (err: any) {
      showToast(err.message || "Lỗi xoay vòng khóa HMAC", "error");
    } finally {
      setRotating(false);
    }
  };

  const handleProbeQwenPaw = async () => {
    setProbing(true);
    try {
      const res = await probeAgentQwenPawBridge(agentId);
      setProbeResult(res);
      showToast(res.message, res.runtime_reachable ? "success" : "error");
      const freshLogs = await fetchAgentWebhookDeliveries(agentId, 40);
      setDeliveries(freshLogs);
    } catch (err: any) {
      showToast(err.message || "Không thể kiểm tra QwenPaw runtime", "error");
    } finally {
      setProbing(false);
    }
  };

  const handleTestWebhook = async () => {
    setTesting(true);
    setTestReply(null);
    try {
      const res = await testAgentWebhookDispatch(agentId, {
        event_type: testEventType,
        source: "agent360-webhook-workbench",
        session_id: `${defaultSessionPrefix || `wh-${cleanSlug}`}-live`,
        channel: defaultChannel || "console",
        message: testMessage || `Kiểm thử kết nối Webhook -> QwenPaw cho ${agentName}`,
        trigger_turn: true,
        wait_for_completion: waitForTestCompletion,
      });
      setTestReply({
        status: res.status,
        reply: res.assistant_reply,
        latencyMs: res.latency_ms,
        sessionId: res.session_id,
      });
      if (res.delivery) {
        setDeliveries((prev) => [res.delivery, ...prev.filter((d) => d.id !== res.delivery.id)].slice(0, 50));
      }
      showToast(`✓ Đã gửi sự kiện Webhook xuống QwenPaw (${res.latency_ms}ms) — Trạng thái: ${res.status.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message || "Lỗi gửi thử Webhook", "error");
    } finally {
      setTesting(false);
    }
  };

  
  const handleReplayDelivery = async (deliveryId: string) => {
    setReplayingId(deliveryId);
    try {
      const res = await replayAgentWebhookDelivery(agentId, deliveryId);
      if (res.delivery) {
        setDeliveries((prev) => [res.delivery, ...prev.filter((d) => d.id !== res.delivery.id)].slice(0, 50));
      }
      showToast(res.message, res.success ? "success" : "error");
    } catch (err: any) {
      showToast(err.message || "Lỗi phát lại Webhook", "error");
    } finally {
      setReplayingId(null);
    }
  };

  
  const handleResolveDlq = async (dlqId: string) => {
    setResolvingDlqId(dlqId);
    try {
      const res = await resolveAgentWebhookDeadLetter(agentId, dlqId);
      setDlqItems((prev) => prev.map((item) => (item.id === dlqId ? { ...item, resolved: true } : item)));
      showToast(res.message, "success");
    } catch (err: any) {
      showToast(err.message || "Lỗi xử lý sự cố DLQ", "error");
    } finally {
      setResolvingDlqId(null);
    }
  };

  const handleAddOutboundTarget = () => {
    if (!newOutboundName.trim() || !newOutboundUrl.trim()) return;
    const item: OutboundWebhookTarget = {
      id: `out_${Date.now().toString(36)}`,
      name: newOutboundName.trim(),
      url: newOutboundUrl.trim(),
      enabled: true,
      events: ["*"],
      secret: newOutboundSecret.trim() || undefined,
    };
    setOutboundList((prev) => [...prev, item]);
    setNewOutboundName("");
    setNewOutboundUrl("");
    setNewOutboundSecret("");
  };

  const handleRemoveOutboundTarget = (id: string) => {
    setOutboundList((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleAllowedEvent = (evId: string) => {
    setAllowedEvents((prev) =>
      prev.includes(evId) ? prev.filter((x) => x !== evId) : [...prev, evId]
    );
  };

  return (
    <div className="space-y-5 text-xs font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          data-testid="webhook-toast-banner"
          className={`p-3 rounded-xl border flex items-center justify-between animate-in fade-in ${
            toast.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
              : "bg-red-500/15 border-red-500/30 text-red-600 dark:text-red-300"
          }`}
        >
          <span className="font-medium">{toast.text}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Action Bar & Runtime Bridge Status */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] flex items-center justify-center text-[var(--agent-light)] dark:text-[var(--agent-dark)] shrink-0">
              <Server size={15} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Cầu nối QwenPaw Gateway
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                {config?.qwenpaw_node || "Fleet Active"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="btn-probe-qwenpaw-bridge"
              disabled={probing}
              onClick={handleProbeQwenPaw}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1d1d2a] hover:bg-slate-100 dark:hover:bg-[#252536] text-slate-800 dark:text-neutral-200 border border-slate-200 dark:border-[#2e2e42] text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {probing ? <Loader2 size={13} className="animate-spin" /> : <Activity size={13} className="text-emerald-400" />}
              <span>Kiểm tra QwenPaw API</span>
            </button>

            <button
              type="button"
              data-testid="btn-save-webhook-config"
              disabled={saving}
              onClick={handleSaveConfig}
              style={{ backgroundColor: "var(--agent-primary, #f8a87c)" }}
              className="px-3.5 py-1.5 rounded-xl hover:opacity-90 text-neutral-950 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-opacity cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              <span>Lưu cấu hình</span>
            </button>
          </div>
        </div>

        {/* Probe Result Card */}
        {probeResult && (
          <div
            data-testid="qwenpaw-probe-result-card"
            className="p-3 rounded-xl bg-white dark:bg-[#121218] border border-emerald-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[11px]"
          >
            <div>
              <span className="text-[10px] text-neutral-500 block">Trạng thái QwenPaw</span>
              <span className="text-emerald-500 font-bold uppercase">{probeResult.runtime_status}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">Độ trễ Nội mạng (RTT)</span>
              <span className="text-slate-900 dark:text-white font-semibold">{probeResult.latency_ms} ms</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">Kênh đang bật</span>
              <span className="text-cyan-500 dark:text-cyan-400 truncate block">
                {probeResult.active_channels.length > 0 ? probeResult.active_channels.join(", ") : "console"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">Matrix / Tác vụ chạy</span>
              <span className="text-slate-800 dark:text-neutral-200">
                {probeResult.matrix_configured ? "Matrix Ready" : "Standard"} • {probeResult.running_task_count} tasks
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Section 1: Endpoint URLs & HMAC Signing Key */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
            <Shield size={14} className="text-emerald-400" />
            <span>1. Địa chỉ Inbound Webhook & Xác thực Chữ ký HMAC-SHA256</span>
          </span>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded border-slate-300 dark:border-neutral-700"
            />
            <span className="text-[11px] font-medium text-slate-700 dark:text-neutral-300">
              Bật nhận Webhook
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Dedicated Agent Webhook URL */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230] space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>AGENT INBOUND WEBHOOK URL (POST)</span>
              <span className="text-emerald-500">Dedicated</span>
            </div>
            <div className="flex items-center gap-2">
              <code
                data-testid="agent-inbound-webhook-url"
                className="flex-1 text-[11px] font-mono text-slate-800 dark:text-neutral-200 bg-slate-100 dark:bg-[#181822] px-2.5 py-1.5 rounded-lg truncate border border-slate-200 dark:border-[#262636]"
              >
                {config?.inbound_webhook_url || `https://api.skyer.vn/api/v1/webhooks/agents/${cleanSlug}`}
              </code>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    "inbound_url",
                    config?.inbound_webhook_url || `https://api.skyer.vn/api/v1/webhooks/agents/${cleanSlug}`
                  )
                }
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1e1e2c] hover:bg-slate-200 dark:hover:bg-[#28283a] text-slate-600 dark:text-neutral-300 cursor-pointer"
                title="Sao chép Webhook URL"
              >
                {copiedField === "inbound_url" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          {/* AgentTeams Matrix Room Event Webhook URL */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230] space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>AGENTTEAMS MATRIX CALLBACK URL (POST)</span>
              <span className="text-cyan-400">Multi-Agent Room</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-[11px] font-mono text-slate-800 dark:text-neutral-200 bg-slate-100 dark:bg-[#181822] px-2.5 py-1.5 rounded-lg truncate border border-slate-200 dark:border-[#262636]">
                {config?.agentteams_webhook_url || "https://api.skyer.vn/api/v1/webhooks/agentteams/events"}
              </code>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    "matrix_url",
                    config?.agentteams_webhook_url || "https://api.skyer.vn/api/v1/webhooks/agentteams/events"
                  )
                }
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1e1e2c] hover:bg-slate-200 dark:hover:bg-[#28283a] text-slate-600 dark:text-neutral-300 cursor-pointer"
                title="Sao chép Matrix Webhook URL"
              >
                {copiedField === "matrix_url" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* HMAC Secret & Toggle */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230] flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <KeyRound size={13} className="text-amber-400 shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-white">
                Khóa Ký Bảo Mật (HMAC-SHA256 Signing Secret)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Header: <code>X-Agent360-Signature: sha256=...</code>
              </span>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <code
                data-testid="webhook-secret-display"
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-[#191924] text-amber-600 dark:text-amber-300 border border-slate-200 dark:border-[#282838]"
              >
                {revealedSecret || config?.signing_secret_preview || "whsec_••••••••••••"}
              </code>
              {revealedSecret && (
                <button
                  type="button"
                  onClick={() => handleCopy("secret", revealedSecret)}
                  className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === "secret" ? <Check size={11} /> : <Copy size={11} />}
                  <span>Copy khóa mới</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={requireHmac}
                onChange={(e) => setRequireHmac(e.target.checked)}
                className="rounded border-slate-300 dark:border-neutral-700"
              />
              <span className="text-[11px] text-slate-700 dark:text-neutral-300">
                Bắt buộc HMAC Signature
              </span>
            </label>

            <button
              type="button"
              data-testid="btn-rotate-webhook-secret"
              disabled={rotating}
              onClick={handleRotateSecret}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {rotating ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              <span>Rotate Secret</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: QwenPaw Dispatch Mapping & Matrix Bridge Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: QwenPaw Turn Routing */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={14} style={{ color: "var(--agent-primary, #f8a87c)" }} />
              <span>2. Điều phối Phiên & Prompt xuống QwenPaw</span>
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoTriggerTurn}
                onChange={(e) => setAutoTriggerTurn(e.target.checked)}
              />
              <span className="text-[11px] text-slate-700 dark:text-neutral-300">Tự động chạy lượt Agent</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-mono text-neutral-500 block mb-1">Kênh đích (Target Channel)</label>
              <select
                value={defaultChannel}
                onChange={(e) => setDefaultChannel(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-xs text-slate-800 dark:text-neutral-200"
              >
                <option value="console">console (Web / Skyer Chat)</option>
                <option value="telegram">telegram (Telegram Topic)</option>
                <option value="matrix">matrix (Matrix / Element)</option>
                <option value="discord">discord (Discord Bot)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-neutral-500 block mb-1">Tiền tố Phiên (Session Prefix)</label>
              <input
                type="text"
                value={defaultSessionPrefix}
                onChange={(e) => setDefaultSessionPrefix(e.target.value)}
                placeholder={`wh-${cleanSlug}`}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-xs font-mono text-slate-800 dark:text-neutral-200"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-neutral-500 block mb-1">
              Mẫu Prompt Chuyển Tiếp (hỗ trợ <code>{"{{event_type}}"}</code>, <code>{"{{source}}"}</code>, <code>{"{{message}}"}</code>)
            </label>
            <textarea
              rows={2}
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-[11px] font-mono text-slate-800 dark:text-neutral-200"
            />
          </div>

          <div>
            <span className="text-[10px] font-mono text-neutral-500 block mb-1.5">Loại sự kiện cho phép (Allowed Events)</span>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_WEBHOOK_EVENTS.map((ev) => {
                const active = allowedEvents.includes(ev.id);
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => toggleAllowedEvent(ev.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                      active
                        ? "bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] font-semibold"
                        : "bg-white dark:bg-[#121218] text-neutral-400 border-slate-200 dark:border-[#242432]"
                    }`}
                  >
                    {ev.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Matrix Channel Sync & Outbound Webhooks */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Radio size={14} className="text-cyan-400" />
              <span>3. Đồng bộ Kênh Matrix trên QwenPaw & Outbound Hooks</span>
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={matrixEnabled}
                onChange={(e) => setMatrixEnabled(e.target.checked)}
              />
              <span className="text-[11px] text-slate-700 dark:text-neutral-300">Bật kênh Matrix</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-mono text-neutral-500 block mb-1">Matrix Homeserver</label>
              <input
                type="text"
                value={matrixHomeserver}
                onChange={(e) => setMatrixHomeserver(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-[11px] font-mono text-slate-800 dark:text-neutral-200"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-neutral-500 block mb-1">Matrix Bot User ID</label>
              <input
                type="text"
                value={matrixUserId}
                onChange={(e) => setMatrixUserId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-[11px] font-mono text-slate-800 dark:text-neutral-200"
              />
            </div>
          </div>

          {/* Outbound Webhooks List */}
          <div className="pt-2 border-t border-slate-200/70 dark:border-white/5 space-y-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">
              Outbound Callback Webhooks ({outboundList.length})
            </span>

            {outboundList.length > 0 && (
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {outboundList.map((item) => (
                  <div
                    key={item.id}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#222230] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-slate-800 dark:text-white truncate">{item.name}</div>
                      <div className="text-[10px] font-mono text-neutral-400 truncate">{item.url}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveOutboundTarget(item.id)}
                      className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"
                      title="Xóa Outbound Webhook"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Tên dịch vụ (VD: Slack/ERP)"
                value={newOutboundName}
                onChange={(e) => setNewOutboundName(e.target.value)}
                className="sm:col-span-4 px-2 py-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-[11px]"
              />
              <input
                type="url"
                placeholder="https://example.com/webhook"
                value={newOutboundUrl}
                onChange={(e) => setNewOutboundUrl(e.target.value)}
                className="sm:col-span-6 px-2 py-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-[11px] font-mono"
              />
              <button
                type="button"
                onClick={handleAddOutboundTarget}
                className="sm:col-span-2 px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-[#222232] hover:bg-slate-300 dark:hover:bg-[#2c2c40] text-slate-800 dark:text-white text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>Thêm</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Live Webhook Simulator -> QwenPaw Runtime */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-emerald-400" />
            <span className="font-semibold text-xs text-slate-900 dark:text-white">
              4. Bàn Kiểm Thử Trực Tiếp (Live Webhook Dispatch to QwenPaw API)
            </span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={waitForTestCompletion}
              onChange={(e) => setWaitForTestCompletion(e.target.checked)}
            />
            <span className="text-[11px] text-slate-600 dark:text-neutral-300">
              Chờ phản hồi trực tiếp từ QwenPaw SSE Stream
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <select
            value={testEventType}
            onChange={(e) => setTestEventType(e.target.value)}
            className="sm:col-span-3 px-2.5 py-2 rounded-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-xs font-mono"
          >
            {AVAILABLE_WEBHOOK_EVENTS.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.id}
              </option>
            ))}
          </select>

          <input
            type="text"
            data-testid="input-test-webhook-message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Nhập nội dung sự kiện gửi xuống QwenPaw..."
            className="sm:col-span-6 px-3 py-2 rounded-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-xs"
          />

          <button
            type="button"
            data-testid="btn-dispatch-test-webhook"
            disabled={testing}
            onClick={handleTestWebhook}
            style={{ backgroundColor: agentTheme.primary }}
            className="sm:col-span-3 px-3 py-2 rounded-xl hover:opacity-90 text-neutral-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-opacity cursor-pointer disabled:opacity-50"
          >
            {testing ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            <span>{testing ? "Đang gọi QwenPaw..." : "Bắn thử Webhook"}</span>
          </button>
        </div>

        {testReply && (
          <div
            data-testid="webhook-test-reply-box"
            className="p-3 rounded-xl bg-white dark:bg-[#111117] border border-emerald-500/30 space-y-1.5 animate-in fade-in"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
              <span>✓ QWENPAW TURN RESPONSE (Session: {testReply.sessionId})</span>
              <span>{testReply.latencyMs} ms</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
              {testReply.reply || "(Đã kích hoạt lượt xử lý bất đồng bộ thành công trên QwenPaw)"}
            </p>
          </div>
        )}
      </div>

      {/* Section 3b: Dead-Letter Queue (DLQ) & Persistent Alerts */}
      {dlqItems.some((x) => !x.resolved) && (
        <div
          data-testid="webhook-dlq-alert-banner"
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-red-500 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>Hàng Đợi Dead-Letter Queue (DLQ) — Cảnh Báo Outbound Webhook Thất Bại ({dlqItems.filter((x) => !x.resolved).length})</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold uppercase">
              Action Required
            </span>
          </div>

          <div className="space-y-2">
            {dlqItems
              .filter((x) => !x.resolved)
              .map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white dark:bg-[#121218] border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.target_name}</span>
                      <span className="text-red-400 font-bold">HTTP {item.last_http_status}</span>
                      <span className="text-neutral-500">• Đã thử {item.total_attempts} lần</span>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 truncate">{item.target_url}</div>
                    <div className="text-[10px] font-mono text-red-400/90 truncate">Lỗi: {item.last_error}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      data-testid={`btn-replay-dlq-${item.id}`}
                      disabled={replayingId === item.delivery_id}
                      onClick={() => handleReplayDelivery(item.delivery_id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 text-[11px] font-mono flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      title="Thử phát lại (Replay) sự kiện này"
                    >
                      {replayingId === item.delivery_id ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />}
                      <span>Replay</span>
                    </button>

                    <button
                      type="button"
                      data-testid={`btn-resolve-dlq-${item.id}`}
                      disabled={resolvingDlqId === item.id}
                      onClick={() => handleResolveDlq(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#20202c] hover:bg-slate-200 dark:hover:bg-[#2c2c3c] text-slate-700 dark:text-neutral-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      title="Đánh dấu đã xử lý / bỏ qua cảnh báo này"
                    >
                      {resolvingDlqId === item.id ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                      <span>Bỏ qua / Xong</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Section 4: Recent Webhook Deliveries & Telemetry Ledger */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={14} className="text-amber-400" />
            <span>5. Nhật ký Vận chuyển Webhook Thời gian thực ({deliveries.length})</span>
          </span>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="p-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-neutral-400 hover:text-white cursor-pointer"
            title="Làm mới nhật ký"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {deliveries.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 font-mono text-xs border border-dashed border-slate-200 dark:border-[#242432] rounded-xl">
            Chưa có sự kiện Webhook nào được ghi nhận cho {agentName}. Hãy bấm "Kiểm tra QwenPaw API" hoặc "Bắn thử Webhook" ở trên.
          </div>
        ) : (
          <div
            data-testid="webhook-deliveries-list"
            className="space-y-2 max-h-64 overflow-y-auto pr-1"
          >
            {deliveries.map((d) => {
              const isOk = d.status === "delivered" || d.status === "triggered";
              return (
                <div
                  key={d.id}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230] flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {d.direction === "inbound" ? (
                        <ArrowDownLeft size={13} className="text-emerald-400 shrink-0" />
                      ) : d.direction === "outbound" ? (
                        <ArrowUpRight size={13} className="text-cyan-400 shrink-0" />
                      ) : (
                        <Activity size={13} className="text-amber-400 shrink-0" />
                      )}
                      <span className="font-mono font-semibold text-[11px] text-slate-900 dark:text-white truncate">
                        {d.event_type}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/5 text-neutral-400">
                        {d.source}
                      </span>
                      {d.signature_verified && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          HMAC Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                      <span
                        className={`px-1.5 py-0.2 rounded font-semibold ${
                          isOk
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        HTTP {d.http_status} • {d.status.toUpperCase()}
                      </span>
                      <span className="text-neutral-500">{d.latency_ms}ms</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-mono text-slate-600 dark:text-neutral-400 truncate flex-1">
                      <span className="text-neutral-500">Payload: </span>
                      {d.payload_preview}
                    </div>
                    {d.direction === "outbound" && (
                      <button
                        type="button"
                        data-testid={`btn-replay-webhook-${d.id}`}
                        disabled={replayingId === d.id}
                        onClick={() => handleReplayDelivery(d.id)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1a1a26] hover:bg-slate-200 dark:hover:bg-[#262638] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-[#2e2e42] text-[10px] font-mono flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
                        title="Phát lại (Replay) sự kiện Outbound Webhook này kèm cơ chế retry"
                      >
                        {replayingId === d.id ? <Loader2 size={10} className="animate-spin" /> : <RotateCcw size={10} />}
                        <span>Replay</span>
                      </button>
                    )}
                  </div>
                  {d.response_preview && (
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-300/90 truncate">
                      <span className="text-neutral-500">Response: </span>
                      {d.response_preview}
                    </div>
                  )}
                  {typeof d.retry_count === "number" && d.retry_count > 0 && (
                    <div className="text-[9px] font-mono text-amber-500/90">
                      Đã tự động thử lại {d.retry_count} lần (Exponential Backoff Queue)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
