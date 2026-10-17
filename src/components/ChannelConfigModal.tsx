import { useState, useEffect } from "react";
import { X, Save, Shield, Bot, Send, Radio, Check, Key } from "lucide-react";
import { AgentChannelConfig, updateAgentChannelConfig } from "../services/agentApi";

interface ChannelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: AgentChannelConfig | null;
  agentId: string;
  agentName: string;
  onSaved: () => void;
}

export function ChannelConfigModal({
  isOpen,
  onClose,
  channel,
  agentId,
  agentName,
  onSaved,
}: ChannelConfigModalProps) {
  const [enabled, setEnabled] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [botPrefix, setBotPrefix] = useState("");
  const [requireMention, setRequireMention] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (channel) {
      setEnabled(channel.enabled);
      const d = channel.details || {};
      setBotToken(d.bot_token || d.client_secret || d.access_token || "");
      setBotPrefix(d.bot_prefix || "");
      setRequireMention(Boolean(d.require_mention));
      setShowThinking(d.show_thinking !== false);
      setShowTools(d.show_tool_calls !== false);
    }
  }, [channel]);

  if (!isOpen || !channel) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const updatedProps: Record<string, any> = {
      enabled: enabled,
      bot_prefix: botPrefix,
      require_mention: requireMention,
      show_thinking: showThinking,
      show_tool_calls: showTools,
    };

    if (botToken) {
      if (channel.type === "telegram" || channel.type === "discord" || channel.type === "slack") {
        updatedProps.bot_token = botToken;
      } else if (channel.type === "dingtalk") {
        updatedProps.client_secret = botToken;
      } else if (channel.type === "matrix" || channel.type === "onebot") {
        updatedProps.access_token = botToken;
      }
    }

    const success = await updateAgentChannelConfig(agentId, channel.type, updatedProps);
    setSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 700);
    } else {
      alert("Failed to save channel config to QwenPaw backend.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#262634] shadow-2xl overflow-hidden font-sans text-xs">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-100 dark:bg-[#181822] border-b border-[#242432] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={15} className="text-[#ff7a00]" />
            <span className="font-semibold text-white tracking-wide uppercase font-mono">
              Configure {channel.name} Channel
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 dark:text-neutral-400 hover:text-white rounded-lg hover:bg-[#232330] transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 space-y-4">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#242432]">
            <div className="flex flex-col">
              <span className="font-medium text-white">Channel Status</span>
              <span className="text-[10px] text-slate-500 dark:text-neutral-400">
                Route queries from {channel.name} to {agentName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`px-3 py-1 rounded-full font-mono font-medium transition-all cursor-pointer border ${
                enabled
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-white/5 text-slate-500 dark:text-neutral-400 border-white/10"
              }`}
            >
              {enabled ? "ACTIVE" : "INACTIVE"}
            </button>
          </div>

          {channel.type !== "console" && (
            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-neutral-300 font-medium flex items-center gap-1.5">
                <Key size={13} className="text-[#ff7a00]" />
                <span>Bot Token / API Secret</span>
              </label>
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="Enter bot token (Telegram BotFather, Discord Bot Token, etc.)"
                className="w-full bg-[#181824] border border-[#2a2a3c] rounded-xl px-3 py-2 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-[#ff7a00]/70"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-neutral-300 font-medium">Trigger Prefix (Optional)</label>
            <input
              type="text"
              value={botPrefix}
              onChange={(e) => setBotPrefix(e.target.value)}
              placeholder="e.g. /ask, !bot, or empty"
              className="w-full bg-[#181824] border border-[#2a2a3c] rounded-xl px-3 py-2 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-[#ff7a00]/70"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#161620] border border-[#222230] text-slate-700 dark:text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={requireMention}
                onChange={(e) => setRequireMention(e.target.checked)}
                className="rounded accent-[#ff7a00]"
              />
              <span className="text-[11px]">Require Mention</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#161620] border border-[#222230] text-slate-700 dark:text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showThinking}
                onChange={(e) => setShowThinking(e.target.checked)}
                className="rounded accent-[#ff7a00]"
              />
              <span className="text-[11px]">Show Thinking</span>
            </label>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono text-neutral-500">
              Live applied to QwenPaw Core
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a3a] text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {saveSuccess ? (
                  <>
                    <Check size={13} className="stroke-[3]" />
                    <span>Saved!</span>
                  </>
                ) : saving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save Config</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
