import { useTranslation } from "../i18n/LanguageContext";
import { useState, useEffect } from "react";
import { CustomSelect } from "./ui/CustomSelect";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#262634] shadow-2xl overflow-hidden font-sans text-xs text-slate-800 dark:text-neutral-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#181822] border-b border-slate-200 dark:border-[#242432] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] flex items-center justify-center shrink-0">
              <Clock size={15} />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white tracking-wide text-xs">
                {job ? "Chỉnh sửa Lịch Routine" : "Thêm Lịch Routine mới"}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">
                {agentName} • Tác vụ chạy định kỳ theo Cron
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200/70 dark:hover:bg-[#232330] transition-colors cursor-pointer"
            aria-label="Đóng modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-neutral-300 font-medium text-xs">
              {t("scheduleJob.name") || "Tên công việc (Routine Title)"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nhắc uống nước buổi sáng, Báo cáo tiến độ hằng ngày"
              className="w-full bg-slate-50 dark:bg-[#181824] border border-slate-200 dark:border-[#2a2a3c] rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-sans placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#f8a87c] focus:bg-white dark:focus:bg-[#1a1a28] hover:border-slate-300 dark:hover:border-[#3a3a50] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-neutral-300 font-medium font-mono text-xs">
                {t("scheduleJob.cron") || "Biểu thức Cron (Cron Expression)"}
              </label>
              <input
                type="text"
                required
                value={cronExpr}
                onChange={(e) => setCronExpr(e.target.value)}
                placeholder="0 7 * * *"
                className="w-full bg-slate-50 dark:bg-[#181824] border border-slate-200 dark:border-[#2a2a3c] rounded-xl px-3.5 py-2 text-[#e0682b] dark:text-[#f8a87c] font-mono placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#f8a87c] focus:bg-white dark:focus:bg-[#1a1a28] hover:border-slate-300 dark:hover:border-[#3a3a50] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-neutral-300 font-medium text-xs">
                {t("scheduleJob.targetChannel") || "Kênh phát (Dispatch Channel)"}
              </label>
              <CustomSelect
                value={targetChannel}
                onChange={(val) => setTargetChannel(val)}
                options={[
                  { value: "telegram", label: "Telegram Channel" },
                  { value: "discord", label: "Discord Channel" },
                  { value: "console", label: "Internal Console" },
                  { value: "matrix", label: "Matrix Room" },
                  { value: "slack", label: "Slack Workspace" },
                ]}
                className="w-full"
                triggerClassName="w-full bg-slate-50 dark:bg-[#181824] border border-slate-200 dark:border-[#2a2a3c] hover:border-slate-300 dark:hover:border-[#3a3a50] focus:border-[#f8a87c] rounded-xl px-3 py-2 text-slate-800 dark:text-white font-mono text-xs"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono uppercase tracking-wider">
              Chọn nhanh tần suất:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRESETS.map((p) => {
                const isSelected = cronExpr === p.cron;
                return (
                  <button
                    key={p.cron}
                    type="button"
                    onClick={() => setCronExpr(p.cron)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#f8a87c]/20 border-[#f8a87c] text-[#e0682b] dark:text-[#f8a87c] font-semibold"
                        : "bg-slate-100 hover:bg-slate-200/80 dark:bg-[#181824] dark:hover:bg-[#202030] border-slate-200 dark:border-[#262638] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-neutral-300 font-medium text-xs">
              Câu lệnh thực thi (Instruction Prompt)
            </label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Nội dung lệnh hoặc yêu cầu mà Agent sẽ tự động chạy (VD: Nhắc nhở uống nước vào 7:00 sáng, kiểm tra nhật ký...)"
              className="w-full bg-slate-50 dark:bg-[#181824] border border-slate-200 dark:border-[#2a2a3c] rounded-xl p-3 text-slate-900 dark:text-white font-sans placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#f8a87c] focus:bg-white dark:focus:bg-[#1a1a28] hover:border-slate-300 dark:hover:border-[#3a3a50] resize-none leading-relaxed text-xs transition-colors"
            />
          </div>

          {/* Active Status Card with Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432]">
            <div className="flex flex-col min-w-0 pr-3">
              <span className="font-semibold text-slate-900 dark:text-white text-xs">
                Trạng thái kích hoạt (Active Status)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-sans mt-0.5">
                {enabled ? "Lịch đang hoạt động và sẽ tự động bắn lệnh theo chu kỳ" : "Lịch đang tạm dừng (paused)"}
              </span>
            </div>

            {/* Clean Toggle Switch matching reference */}
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled
                  ? "bg-[#1d6eed] dark:bg-[#1d7bf2]"
                  : "bg-slate-300 dark:bg-[#2c2c3a]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
            {job ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors px-2.5 py-1.5 rounded-xl cursor-pointer font-medium text-xs"
              >
                <Trash2 size={13} />
                <span>Xoá lịch</span>
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-[#2a2a3a] dark:hover:border-[#3e3e52] bg-white hover:bg-slate-100 dark:bg-[#181822] dark:hover:bg-[#222230] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer text-xs font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 bg-[#f8a87c] hover:bg-[#f5935f] text-neutral-950 font-semibold px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 text-xs"
              >
                <Save size={13} />
                <span>{job ? "Lưu thay đổi" : "Tạo Lịch mới"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
