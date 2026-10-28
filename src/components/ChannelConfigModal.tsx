import { useTranslation } from "../i18n/LanguageContext";
import { useState, useEffect } from "react";
import { Save, Radio, Check, Key } from "lucide-react";
import { AgentChannelConfig, updateAgentChannelConfig } from "../services/agentApi";
import { Modal } from "./ui/Modal";
import { ToggleSwitch } from "./ui/ToggleSwitch";

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
  const { t } = useTranslation();
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

  if (!channel) return null;

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
      alert("Failed to save channel config to Skyer backend.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure ${channel.name} Channel`}
      icon={<Radio size={15} className="text-[var(--agent-light)] dark:text-[var(--agent-dark)]" />}
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="p-4 space-y-4">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432]">
          <ToggleSwitch
            checked={enabled}
            onChange={setEnabled}
            label={t("channelConfig.status")}
            description={`Route queries from ${channel.name} to ${agentName}`}
          />
        </div>

        {channel.type !== "console" && (
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-neutral-300 font-medium flex items-center gap-1.5">
              <Key size={13} className="text-[var(--agent-light)] dark:text-[var(--agent-dark)]" />
              <span>{t("channelConfig.token")}</span>
            </label>
            <input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Enter bot token (Telegram BotFather, Discord Bot Token, etc.)"
              className="w-full bg-[#181824] border border-[#2a2a3c] rounded-xl px-3 py-2 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)]/70"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-neutral-300 font-medium">{t("channelConfig.prefix")}</label>
          <input
            type="text"
            value={botPrefix}
            onChange={(e) => setBotPrefix(e.target.value)}
            placeholder="e.g. /ask, !bot, or empty"
            className="w-full bg-[#181824] border border-[#2a2a3c] rounded-xl px-3 py-2 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)]/70"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#222230]">
            <ToggleSwitch
              size="sm"
              checked={requireMention}
              onChange={setRequireMention}
              label={t("channelConfig.requireMention")}
            />
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#222230]">
            <ToggleSwitch
              size="sm"
              checked={showThinking}
              onChange={setShowThinking}
              label={t("channelConfig.showThinking")}
            />
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
          <span className="text-[10px] font-mono text-neutral-500">
            Live applied to Skyer Core
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
              className="flex items-center gap-1.5 bg-[var(--agent-primary)] hover:opacity-90 text-black font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check size={13} className="stroke-[3]" />
                  <span>{t("channelConfig.saved")}</span>
                </>
              ) : saving ? (
                <span>{t("channelConfig.saving")}</span>
              ) : (
                <>
                  <Save size={13} />
                  <span>{t("channelConfig.save")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
