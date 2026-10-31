import { useTranslation } from "../i18n/LanguageContext";
import { useState, useEffect } from "react";
import { Save, Radio, Check, Key, Users, Shield, Plus, X } from "lucide-react";
import {
  AgentChannelConfig,
  DEFAULT_TELEGRAM_API_BASE_URL,
  updateAgentChannelConfig,
} from "../services/agentApi";
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
  const [baseUrl, setBaseUrl] = useState(DEFAULT_TELEGRAM_API_BASE_URL);
  const [botPrefix, setBotPrefix] = useState("");
  const [showTyping, setShowTyping] = useState(true);
  const [dmAccessControl, setDmAccessControl] = useState(false);
  const [groupAccessControl, setGroupAccessControl] = useState(false);
  const [whitelistUsers, setWhitelistUsers] = useState<string[]>([]);
  const [newUserIdInput, setNewUserIdInput] = useState("");
  const [requireMention, setRequireMention] = useState(true);
  const [noTextDebounce, setNoTextDebounce] = useState(true);
  const [showThinking, setShowThinking] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (channel) {
      setEnabled(channel.enabled);
      setSaveError(null);
      const d = channel.details || {};
      const isTelegram = channel.type === "telegram";
      const rawToken = d.bot_token || d.client_secret || d.access_token || "";
      setBotToken(rawToken === "********" ? "" : rawToken);
      setBaseUrl(
        isTelegram
          ? (typeof d.base_url === "string" && d.base_url.trim()
              ? d.base_url.trim()
              : DEFAULT_TELEGRAM_API_BASE_URL)
          : (typeof d.base_url === "string" ? d.base_url.trim() : "")
      );
      setBotPrefix(d.bot_prefix || "");
      setShowTyping(d.show_typing !== undefined && d.show_typing !== null ? Boolean(d.show_typing) : true);
      setDmAccessControl(
        Boolean(d.access_control_dm || d.dm_policy === "allowlist")
      );
      setGroupAccessControl(
        Boolean(d.access_control_group || d.group_policy === "allowlist")
      );
      const rawAllowFrom = Array.isArray(d.allow_from)
        ? d.allow_from
        : (d.whitelist && typeof d.whitelist === "object" ? Object.keys(d.whitelist) : []);
      setWhitelistUsers(rawAllowFrom.map((u: any) => String(u).trim()).filter(Boolean));
      setNewUserIdInput("");
      setRequireMention(
        d.require_mention !== undefined && d.require_mention !== null
          ? Boolean(d.require_mention)
          : isTelegram
          ? true
          : false
      );
      setNoTextDebounce(
        d.no_text_debounce !== undefined && d.no_text_debounce !== null
          ? Boolean(d.no_text_debounce)
          : true
      );
      setShowThinking(d.show_thinking !== false);
      setShowTools(d.show_tool_calls !== false);
    }
  }, [channel]);

  if (!channel) return null;

  const isTelegram = channel.type === "telegram";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const updatedProps: Record<string, any> = {
      enabled: enabled,
      bot_prefix: botPrefix,
      require_mention: requireMention,
      no_text_debounce: noTextDebounce,
      access_control_dm: dmAccessControl,
      access_control_group: groupAccessControl,
      dm_policy: dmAccessControl ? "allowlist" : "open",
      group_policy: groupAccessControl ? "allowlist" : "open",
      allow_from: (dmAccessControl || groupAccessControl) ? whitelistUsers : [],
      show_thinking: showThinking,
      show_tool_calls: showTools,
    };

    if (isTelegram) {
      updatedProps.base_url = baseUrl.trim() || DEFAULT_TELEGRAM_API_BASE_URL;
      updatedProps.show_typing = showTyping;
    }

    const trimmedToken = botToken.trim();
    if (trimmedToken && trimmedToken !== "********") {
      if (channel.type === "telegram" || channel.type === "discord" || channel.type === "slack") {
        updatedProps.bot_token = trimmedToken;
      } else if (channel.type === "dingtalk") {
        updatedProps.client_secret = trimmedToken;
      } else if (channel.type === "matrix" || channel.type === "onebot") {
        updatedProps.access_token = trimmedToken;
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
      setSaveError("Failed to save channel config to Skyer backend.");
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
      <form onSubmit={handleSave} className="p-4 space-y-3.5 max-h-[80vh] overflow-y-auto">
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
              placeholder={
                channel.details?.bot_token === "********"
                  ? "•••••••• (Configured — leave blank to keep current token)"
                  : "Enter bot token (Telegram BotFather, Discord Bot Token, etc.)"
              }
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

        {isTelegram ? (
          <div className="space-y-2 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#222230]">
              <ToggleSwitch
                size="sm"
                checked={showTyping}
                onChange={setShowTyping}
                label={t("channelConfig.showTyping") || "Show Typing"}
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#222230]">
              <ToggleSwitch
                size="sm"
                checked={dmAccessControl}
                onChange={setDmAccessControl}
                label={t("channelConfig.dmAccessControl") || "DM Access Control"}
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#222230]">
              <ToggleSwitch
                size="sm"
                checked={groupAccessControl}
                onChange={setGroupAccessControl}
                label={t("channelConfig.groupAccessControl") || "Group Access Control"}
              />
            </div>

            {(dmAccessControl || groupAccessControl) && (
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-[#13131c] border border-amber-500/20 dark:border-amber-500/30 space-y-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <Shield size={13} className="text-amber-500" />
                    <span>{t("channelConfig.whitelistUsers") || "Whitelisted Users (IDs)"}</span>
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {whitelistUsers.length} {t("channelConfig.usersCount") || "user(s)"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-tight">
                  {t("channelConfig.whitelistHint") || "Only specified Telegram User IDs can interact when DM or Group access control is active."}
                </p>

                {/* Input & Add Button */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Users size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={newUserIdInput}
                      onChange={(e) => setNewUserIdInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = newUserIdInput.trim();
                          if (val && !whitelistUsers.includes(val)) {
                            setWhitelistUsers([...whitelistUsers, val]);
                            setNewUserIdInput("");
                          }
                        }
                      }}
                      placeholder="e.g. 123456789"
                      className="w-full bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#2a2a3c] rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-slate-800 dark:text-white font-mono placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const val = newUserIdInput.trim();
                      if (val && !whitelistUsers.includes(val)) {
                        setWhitelistUsers([...whitelistUsers, val]);
                        setNewUserIdInput("");
                      }
                    }}
                    className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 dark:text-amber-400 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>{t("channelConfig.add") || "Add"}</span>
                  </button>
                </div>

                {/* Chips */}
                {whitelistUsers.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                    {whitelistUsers.map((uid) => (
                      <span
                        key={uid}
                        className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-mono"
                      >
                        <span>{uid}</span>
                        <button
                          type="button"
                          onClick={() => setWhitelistUsers(whitelistUsers.filter((u) => u !== uid))}
                          className="hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-neutral-500 italic py-0.5">
                    {t("channelConfig.noWhitelistedUsers") || "No user IDs configured yet. All non-whitelisted users will be blocked."}
                  </div>
                )}
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#222230]">
              <ToggleSwitch
                size="sm"
                checked={requireMention}
                onChange={setRequireMention}
                label={t("channelConfig.requireMention") || "Require @Mention"}
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#222230]">
              <ToggleSwitch
                size="sm"
                checked={noTextDebounce}
                onChange={setNoTextDebounce}
                label={t("channelConfig.noTextDebounce") || "No-text Debounce"}
              />
            </div>
          </div>
        ) : (
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
        )}

        {saveError && (
          <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {saveError}
          </div>
        )}

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
