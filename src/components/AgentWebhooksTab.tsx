import React, { useState, useEffect } from "react";
import {
  Webhook,
  Copy,
  Check,
  RefreshCw,
  Send,
  Loader2,
  Terminal,
  History,
  KeyRound,
  Trash2,
  ChevronDown,
  ChevronRight,
  Code,
  FileCode,
} from "lucide-react";
import {
  AgentWebhookConfig,
  AgentWebhookDeliveryRecord,
  fetchAgentWebhookConfig,
  updateAgentWebhookConfig,
  rotateAgentWebhookSecret,
  fetchAgentWebhookDeliveries,
  testAgentWebhookDispatch,
  clearAgentWebhookDeliveries,
} from "../services/agentApi";

interface AgentWebhooksTabProps {
  agentId: string;
  agentName: string;
  agentSlug?: string;
}

// Client-side helper to compute HMAC-SHA256 signature using browser standard crypto.subtle
async function generateHmacSha256Hex(secret: string, message: string): Promise<string> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "0000000000000000000000000000000000000000000000000000000000000000";
  }
}

export function AgentWebhooksTab({
  agentId,
  agentName,
  agentSlug,
}: AgentWebhooksTabProps) {
  const [config, setConfig] = useState<AgentWebhookConfig | null>(null);
  const [deliveries, setDeliveries] = useState<AgentWebhookDeliveryRecord[]>([]);
  const [expandedDeliveryId, setExpandedDeliveryId] = useState<string | null>(null);
  const [showCurlSnippet, setShowCurlSnippet] = useState<boolean>(false);
  const [curlSnippet, setCurlSnippet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [rotating, setRotating] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);
  const [clearing, setClearing] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "delivered" | "failed">("all");
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedSecret, setCopiedSecret] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  const [copiedPayloadId, setCopiedPayloadId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form states
  const [enabled, setEnabled] = useState<boolean>(true);
  const [testMessage, setTestMessage] = useState<string>("");
  const [testReply, setTestReply] = useState<{ status: string; latency_ms: number; reply?: string | null } | null>(null);

  const cleanSlug = (agentSlug || agentId).replace(/^bot:agent360:/i, "").trim().toLowerCase();

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cfg, dlvs] = await Promise.all([
        fetchAgentWebhookConfig(agentId),
        fetchAgentWebhookDeliveries(agentId, 30),
      ]);

      if (cfg) {
        setConfig(cfg);
        setEnabled(cfg.enabled ?? true);
      }
      setDeliveries(dlvs || []);
    } catch (err) {
      console.warn("[AgentWebhooksTab] load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    setTestMessage(`Xin chào ${agentName}, kiểm thử kết nối webhook.`);
  }, [agentId, agentName]);

  const webhookUrl = config?.inbound_webhook_url || `https://api.skyer.vn/api/v1/webhooks/agents/${cleanSlug}`;

  // Generate real executable cURL command with genuine HMAC signature & unix timestamp
  useEffect(() => {
    const updateSnippet = async () => {
      const secret = config?.secret || config?.signing_secret_preview || "YOUR_SECRET_KEY";
      const ts = Math.floor(Date.now() / 1000);
      const rawBody = JSON.stringify({
        message: "Hello Agent from terminal",
        source: "cli-curl",
      });
      const canonical = `${ts}.${rawBody}`;
      const sig = await generateHmacSha256Hex(secret, canonical);

      const snippet = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -H "X-Agent360-Timestamp: ${ts}" \\
  -H "X-Agent360-Signature: sha256=${sig}" \\
  -d '${rawBody}'`;

      setCurlSnippet(snippet);
    };

    updateSnippet();
  }, [webhookUrl, config?.secret, config?.signing_secret_preview]);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const updated = await updateAgentWebhookConfig(agentId, {
        enabled,
        default_channel: config?.default_channel || "console",
        default_session_prefix: config?.default_session_prefix || `wh-${cleanSlug}`,
        prompt_template: config?.prompt_template,
        allowed_events: config?.allowed_events || ["*"],
        auto_trigger_agent_turn: true,
        outbound_webhooks: config?.outbound_webhooks || [],
      });

      if (updated) {
        setConfig(updated);
        showToast("✓ Đã lưu cài đặt Webhook thành công!");
      }
    } catch (err: any) {
      showToast(err?.message || "Không thể lưu cấu hình Webhook", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRotateSecret = async () => {
    if (!confirm("Tạo mới Secret sẽ vô hiệu hóa khóa ký hiện tại. Bạn có chắc chắn muốn tạo mới không?")) {
      return;
    }
    setRotating(true);
    try {
      const res = await rotateAgentWebhookSecret(agentId);
      if (res && res.new_secret) {
        setConfig(res.config);
        showToast("✓ Đã tạo mới Secret thành công!");
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi khi tạo mới Secret", "error");
    } finally {
      setRotating(false);
    }
  };

  const handleClearDeliveries = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử nhận webhook của Agent này không?")) {
      return;
    }
    setClearing(true);
    try {
      const ok = await clearAgentWebhookDeliveries(agentId);
      if (ok) {
        setDeliveries([]);
        setExpandedDeliveryId(null);
        showToast("✓ Đã xóa sạch lịch sử nhận webhook!");
      } else {
        showToast("Không thể xóa lịch sử nhận webhook", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi khi xóa lịch sử webhook", "error");
    } finally {
      setClearing(false);
    }
  };

  const handleTestWebhook = async () => {
    setTesting(true);
    setTestReply(null);
    try {
      const res = await testAgentWebhookDispatch(agentId, {
        event_type: "task.trigger",
        source: "agent360-webhook-tester",
        wait_for_completion: true,
        message: testMessage || `Kiểm thử kết nối Webhook cho ${agentName}`,
      });

      setTestReply({
        status: res.status,
        latency_ms: res.latency_ms,
        reply: res.assistant_reply || (res.delivery?.response_preview ? String(res.delivery.response_preview) : null),
      });

      showToast(`✓ Đã gửi thử thành công (${res.latency_ms}ms)!`);
      const fresh = await fetchAgentWebhookDeliveries(agentId, 30);
      setDeliveries(fresh || []);
    } catch (err: any) {
      showToast(err?.message || "Lỗi gửi thử Webhook", "error");
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500 font-mono text-xs">
        <Loader2 size={24} className="animate-spin text-[var(--agent-light,#38bdf8)]" />
        <span>Đang nạp cấu hình Webhook...</span>
      </div>
    );
  }

  const filteredDeliveries = deliveries.filter((d) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "delivered") return d.status === "delivered" || d.status === "success" || d.status === "triggered";
    if (statusFilter === "failed") return d.status === "failed" || d.status === "error";
    return true;
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto py-1">
      {/* Toast Notification */}
      {toast && (
        <div
          data-testid="webhook-toast-banner"
          className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
            toast.type === "error"
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
          }`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header & Primary Inbound Webhook Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Webhook size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Webhook kết nối Agent</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  Đang hoạt động
                </span>
              </h3>
              <p className="text-[12px] text-slate-500 dark:text-neutral-400">
                Gửi HTTP POST để kích hoạt hoặc truyền dữ liệu trực tiếp vào Agent {agentName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-neutral-300 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="rounded border-slate-300 dark:border-neutral-600 text-[var(--agent-primary,#3b82f6)] focus:ring-0"
              />
              <span>Bật Webhook</span>
            </label>

            <button
              type="button"
              data-testid="btn-save-webhook-config"
              disabled={saving}
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              <span>Lưu</span>
            </button>
          </div>
        </div>

        {/* Webhook Endpoint URL */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-600 dark:text-neutral-400">
            <span>ENDPOINT URL (HTTP POST)</span>
            <button
              type="button"
              data-testid="btn-toggle-curl-snippet"
              onClick={() => setShowCurlSnippet((prev) => !prev)}
              className="text-[11px] text-[var(--agent-primary,#3b82f6)] hover:underline flex items-center gap-1 cursor-pointer font-sans"
            >
              <FileCode size={12} />
              <span>{showCurlSnippet ? "Ẩn lệnh cURL" : "Xem mẫu lệnh cURL test"}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div
              data-testid="agent-inbound-webhook-url"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] font-mono text-xs text-slate-800 dark:text-neutral-200 truncate select-all"
            >
              {webhookUrl}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                setCopiedUrl(true);
                setTimeout(() => setCopiedUrl(false), 2000);
              }}
              className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#121218] hover:bg-slate-100 dark:hover:bg-[#1c1c28] border border-slate-200 dark:border-[#242432] text-xs font-medium text-slate-700 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Sao chép Webhook URL"
            >
              {copiedUrl ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copiedUrl ? "Đã chép" : "Sao chép"}</span>
            </button>
          </div>

          {/* Interactive cURL Snippet Panel */}
          {showCurlSnippet && (
            <div
              data-testid="curl-command-snippet-panel"
              className="mt-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono text-slate-300 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <Terminal size={12} className="text-emerald-400" />
                  <span>cURL Command (Tự động tính sẵn HMAC Signature & Timestamp):</span>
                </span>
                <button
                  type="button"
                  data-testid="btn-copy-curl-command"
                  onClick={() => {
                    navigator.clipboard.writeText(curlSnippet);
                    setCopiedCurl(true);
                    setTimeout(() => setCopiedCurl(false), 2000);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedCurl ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copiedCurl ? "Đã chép cURL" : "Sao chép cURL"}</span>
                </button>
              </div>
              <pre className="p-2.5 rounded-lg bg-black/60 border border-white/5 overflow-x-auto whitespace-pre-wrap select-all text-[11.5px] leading-relaxed text-emerald-400">
                {curlSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Secret Key for HMAC SHA256 */}
        <div className="space-y-1.5 pt-1 border-t border-slate-200/60 dark:border-white/5">
          <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-neutral-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound size={12} className="text-amber-500" />
              <span>SIGNING SECRET (HMAC-SHA256)</span>
            </span>
            <span className="text-[10px] font-normal text-slate-400">Header: X-Agent360-Signature</span>
          </label>
          <div className="flex items-center gap-2">
            <div
              data-testid="webhook-secret-display"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] font-mono text-xs text-slate-700 dark:text-neutral-300 truncate"
            >
              {config?.signing_secret_preview || config?.secret || "••••••••••••••••••••••••••••••••"}
            </div>
            <button
              type="button"
              onClick={() => {
                const val = config?.signing_secret_preview || config?.secret;
                if (val) {
                  navigator.clipboard.writeText(val);
                  setCopiedSecret(true);
                  setTimeout(() => setCopiedSecret(false), 2000);
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#121218] hover:bg-slate-100 dark:hover:bg-[#1c1c28] border border-slate-200 dark:border-[#242432] text-xs font-medium text-slate-700 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Sao chép Secret"
            >
              {copiedSecret ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copiedSecret ? "Đã chép" : "Sao chép"}</span>
            </button>
            <button
              type="button"
              data-testid="btn-rotate-webhook-secret"
              disabled={rotating}
              onClick={handleRotateSecret}
              className="p-2.5 rounded-xl bg-white dark:bg-[#121218] hover:bg-slate-100 dark:hover:bg-[#1c1c28] border border-slate-200 dark:border-[#242432] text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              title="Đổi khóa Secret mới"
            >
              {rotating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Fast Test Dispatcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
        <div className="flex items-center gap-2">
          <Terminal size={15} className="text-emerald-500" />
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
            Gửi thử dữ liệu Webhook
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            data-testid="input-test-webhook-message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Nhập nội dung gửi thử..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--agent-primary,#3b82f6)]"
          />
          <button
            type="button"
            data-testid="btn-dispatch-test-webhook"
            disabled={testing}
            onClick={handleTestWebhook}
            className="px-4 py-2.5 rounded-xl bg-[var(--agent-primary,#3b82f6)] text-white font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0 disabled:opacity-50"
          >
            {testing ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            <span>{testing ? "Đang gửi..." : "Gửi thử"}</span>
          </button>
        </div>

        {testReply && (
          <div
            data-testid="webhook-test-reply-box"
            className="p-3 rounded-xl bg-white dark:bg-[#111118] border border-slate-200 dark:border-[#242432] space-y-1 font-mono text-[11px]"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span>Trạng thái: <strong className="text-emerald-500 uppercase">{testReply.status}</strong></span>
              <span>Độ trễ: {testReply.latency_ms}ms</span>
            </div>
            {testReply.reply && (
              <p className="text-slate-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed pt-1 border-t border-slate-100 dark:border-white/5">
                {testReply.reply}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 3. Delivery Log History (Filtered & Expandable Details) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <History size={14} className="text-slate-400" />
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
              Lịch sử nhận Webhook gần đây ({filteredDeliveries.length}/{deliveries.length})
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Pills */}
            <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px]">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-white dark:bg-[#1c1c28] text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("delivered")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  statusFilter === "delivered"
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-emerald-600"
                }`}
              >
                Thành công
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("failed")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  statusFilter === "failed"
                    ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-rose-600"
                }`}
              >
                Thất bại
              </button>
            </div>

            {/* Clear All Deliveries Button */}
            {deliveries.length > 0 && (
              <button
                type="button"
                data-testid="btn-clear-webhook-deliveries"
                disabled={clearing}
                onClick={handleClearDeliveries}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:text-rose-600 hover:border-rose-500/30 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Xóa toàn bộ lịch sử nhận webhook"
              >
                {clearing ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                <span>Xóa sạch</span>
              </button>
            )}

            <button
              type="button"
              onClick={loadAll}
              className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer ml-1"
            >
              <RefreshCw size={11} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {filteredDeliveries.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 font-mono">
            {deliveries.length === 0
              ? "Chưa có lượt gửi Webhook nào được ghi nhận. Hãy bấm 'Gửi thử' ở trên."
              : "Không có bản ghi webhook nào khớp với bộ lọc đã chọn."}
          </div>
        ) : (
          <div
            data-testid="webhook-deliveries-list"
            className="divide-y divide-slate-200/70 dark:divide-white/5 border border-slate-200 dark:border-[#242432] rounded-xl overflow-hidden bg-white dark:bg-[#121218]"
          >
            {filteredDeliveries.map((d) => {
              const isExpanded = expandedDeliveryId === d.id;
              const hasPayload = Boolean(d.raw_payload || d.payload_preview);
              const hasResponse = Boolean(d.response_preview);

              return (
                <div key={d.id} className="transition-colors">
                  <div
                    onClick={() => setExpandedDeliveryId(isExpanded ? null : d.id)}
                    className="p-3 flex items-center justify-between gap-3 text-xs font-mono cursor-pointer hover:bg-slate-50/70 dark:hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-slate-400 shrink-0">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          d.status === "delivered" || d.status === "success" || d.status === "triggered"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 dark:text-neutral-200 truncate block">
                          {d.event_type || "task.trigger"}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {d.source || "external"} • {d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : "vừa xong"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400">
                        {d.latency_ms ? `${d.latency_ms}ms` : "OK"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.status === "delivered" || d.status === "success" || d.status === "triggered"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                  </div>

                  {/* Expandable JSON Detail Inspector */}
                  {isExpanded && (
                    <div
                      data-testid={`webhook-delivery-detail-${d.id}`}
                      className="px-4 pb-3 pt-1 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0f0f15] space-y-2.5 text-xs font-mono"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-500">
                        <div>ID: <strong className="text-slate-800 dark:text-neutral-200">{d.id}</strong></div>
                        <div>HTTP: <strong className="text-slate-800 dark:text-neutral-200">{d.http_status || 200}</strong></div>
                        <div>Chữ ký HMAC: <strong className={d.signature_verified ? "text-emerald-500" : "text-amber-500"}>{d.signature_verified ? "Hợp lệ" : "Bỏ qua / Tự do"}</strong></div>
                        <div>Hướng: <strong className="text-slate-800 dark:text-neutral-200 uppercase">{d.direction || "inbound"}</strong></div>
                      </div>

                      {/* Request Payload JSON */}
                      {hasPayload && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-semibold flex items-center gap-1">
                              <Code size={11} />
                              <span>Request Payload JSON:</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const payloadStr = d.raw_payload || d.payload_preview;
                                navigator.clipboard.writeText(payloadStr);
                                setCopiedPayloadId(d.id);
                                setTimeout(() => setCopiedPayloadId(null), 2000);
                              }}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedPayloadId === d.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                              <span>{copiedPayloadId === d.id ? "Đã chép" : "Sao chép JSON"}</span>
                            </button>
                          </div>
                          <pre className="p-2.5 rounded-lg bg-white dark:bg-[#151520] border border-slate-200/80 dark:border-white/10 text-[11px] text-slate-800 dark:text-neutral-200 overflow-x-auto whitespace-pre-wrap select-all">
                            {(() => {
                              try {
                                const parsed = JSON.parse(d.raw_payload || d.payload_preview);
                                return JSON.stringify(parsed, null, 2);
                              } catch {
                                return d.raw_payload || d.payload_preview;
                              }
                            })()}
                          </pre>
                        </div>
                      )}

                      {/* Response Body / Headers Preview */}
                      {hasResponse && (
                        <div className="space-y-1">
                          <span className="font-semibold text-[11px] text-slate-500 block">
                            Response Content:
                          </span>
                          <pre className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                            {d.response_preview}
                          </pre>
                        </div>
                      )}
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
