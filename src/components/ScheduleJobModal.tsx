import { useTranslation } from "../i18n/LanguageContext";
import { useState, useEffect } from "react";
import { X, Clock, Calendar, Save, Trash2, Check, Radio } from "lucide-react";
import { AgentScheduleJob, createOrUpdateSchedule, deleteSchedule } from "../services/agentApi";

interface ScheduleJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: AgentScheduleJob | null;
  agentId: string;
  agentName: string;
  onSaved: () => void;
}

const COMMON_PRESETS = [
  { label: "Every Hour", cron: "0 * * * *" },
  { label: "Every Day at 09:00", cron: "0 9 * * *" },
  { label: "Every Night at 21:00", cron: "0 21 * * *" },
  { label: "Every Monday 08:00", cron: "0 8 * * 1" },
  { label: "Every 15 Minutes", cron: "*/15 * * * *" },
];

export function ScheduleJobModal({
  isOpen,
  onClose,
  job,
  agentId,
  agentName,
  onSaved,
}: ScheduleJobModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [cronExpr, setCronExpr] = useState("0 9 * * *");
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");
  const [targetChannel, setTargetChannel] = useState("telegram");
  const [prompt, setPrompt] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (job) {
      setName(job.name);
      setCronExpr(job.cronExpr);
      setTimezone(job.timezone || "Asia/Ho_Chi_Minh");
      setTargetChannel(job.targetChannel || "telegram");
      setPrompt(job.promptSnippet || "");
      setEnabled(job.enabled !== false);
    } else {
      setName(`Daily Intelligence Brief for ${agentName}`);
      setCronExpr("0 9 * * *");
      setTimezone("Asia/Ho_Chi_Minh");
      setTargetChannel("telegram");
      setPrompt("Summarize all pending approvals, system health, and unread customer messages.");
      setEnabled(true);
    }
  }, [job, agentName]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cronExpr.trim()) return;

    setSaving(true);
    const success = await createOrUpdateSchedule({
      agentId,
      id: job?.id,
      name: name.trim(),
      cronExpr: cronExpr.trim(),
      timezone,
      targetChannel,
      promptSnippet: prompt.trim(),
      enabled,
    });
    setSaving(false);
    if (success) {
      onSaved();
      onClose();
    } else {
      alert("Failed to save schedule to Cron backend.");
    }
  };

  const handleDelete = async () => {
    if (!job || !window.confirm(`Delete automation schedule "${job.name}"?`)) return;
    setDeleting(true);
    const success = await deleteSchedule(job.id, agentId);
    setDeleting(false);
    if (success) {
      onSaved();
      onClose();
    } else {
      alert("Failed to delete schedule.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#262634] shadow-2xl overflow-hidden font-sans text-xs">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-100 dark:bg-[#181822] border-b border-[#242432] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-[#ff7a00]" />
            <span className="font-semibold text-white tracking-wide uppercase font-mono">
              {job ? "Edit Automation Schedule" : "New Automation Schedule"}
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
        <form onSubmit={handleSave} className="p-4 space-y-3.5">
          <div className="space-y-1">
            <label className="text-slate-700 dark:text-neutral-300 font-medium">{t("scheduleJob.name")}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Daily Order Check, SRE Health Audit"
              className="w-full bg-[#181824] border border-[#2a2a3c] rounded-xl px-3 py-2 text-white font-sans placeholder:text-neutral-600 focus:outline-none focus:border-[#ff7a00]/70"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-700 dark:text-neutral-300 font-medium font-mono">{t("scheduleJob.cron")}</label>
              <input
                type="text"
                required
                value={cronExpr}
                onChange={(e) => setCronExpr(e.target.value)}
                placeholder="0 9 * * *"
                className="w-full bg-[#181824] border border-[#2a2a3c] rounded-xl px-3 py-2 text-[#ff7a00] font-mono placeholder:text-neutral-600 focus:outline-none focus:border-[#ff7a00]/70"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 dark:text-neutral-300 font-medium">{t("scheduleJob.targetChannel")}</label>
              <select
                value={targetChannel}
                onChange={(e) => setTargetChannel(e.target.value)}
                className="w-full bg-[#181824] border border-[#2a2a3c] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#ff7a00]/70 cursor-pointer"
              >
                <option value="telegram">Telegram Channel</option>
                <option value="discord">Discord Channel</option>
                <option value="console">Internal Console</option>
                <option value="matrix">Matrix Room</option>
                <option value="slack">Slack Workspace</option>
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {COMMON_PRESETS.map((p) => (
              <button
                key={p.cron}
                type="button"
                onClick={() => setCronExpr(p.cron)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                  cronExpr === p.cron
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-[#ff7a00]"
                    : "bg-[#181824] border-[#262638] text-slate-500 dark:text-neutral-400 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 dark:text-neutral-300 font-medium">Instruction Prompt to Execute</label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What instructions should the bot run at the scheduled time? (e.g. Check system logs, query unread orders...)"
              className="w-full bg-[#181824] border border-[#2a2a3c] rounded-xl p-2.5 text-white font-sans placeholder:text-neutral-600 focus:outline-none focus:border-[#ff7a00]/70 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#242432]">
            <div className="flex flex-col">
              <span className="font-medium text-white">Active Status</span>
              <span className="text-[10px] text-slate-500 dark:text-neutral-400">
                Automated scheduler fires according to cron expression
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
              {enabled ? "ACTIVE" : "PAUSED"}
            </button>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            {job ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors p-1 cursor-pointer font-medium"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            ) : <span />}

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
                <Save size={13} />
                <span>{job ? "Update Schedule" : "Create Schedule"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
