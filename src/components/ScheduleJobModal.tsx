import { useTranslation } from "../i18n/LanguageContext";
import { useState, useEffect, useMemo } from "react";
import { CustomSelect } from "./ui/CustomSelect";
import { X, Clock, Calendar, Save, Trash2, Check, Radio, ChevronDown, Sparkles, Sliders } from "lucide-react";
import { AgentScheduleJob, createOrUpdateSchedule, deleteSchedule } from "../services/agentApi";

interface ScheduleJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: AgentScheduleJob | null;
  agentId: string;
  agentName: string;
  onSaved: () => void;
}

type FrequencyType = "daily" | "weekly" | "hourly" | "workdays" | "interval15" | "custom";

const DAYS_OF_WEEK = [
  { value: "1", label: "Thứ 2" },
  { value: "2", label: "Thứ 3" },
  { value: "3", label: "Thứ 4" },
  { value: "4", label: "Thứ 5" },
  { value: "5", label: "Thứ 6" },
  { value: "6", label: "Thứ 7" },
  { value: "0", label: "Chủ nhật" },
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

  // Friendly End-User Scheduler State
  const [frequency, setFrequency] = useState<FrequencyType>("daily");
  const [selectedTime, setSelectedTime] = useState("09:00"); // HH:mm
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("1"); // Monday
  const [showAdvancedCron, setShowAdvancedCron] = useState(false);

  // Parse existing cron into friendly frequency + time
  const parseCronToFriendly = (cron: string) => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length === 5) {
      const [minute, hour, dom, month, dow] = parts;
      if (dom === "*" && month === "*") {
        if (dow === "*" && minute === "0" && !isNaN(Number(hour))) {
          const hh = hour.padStart(2, "0");
          return { freq: "daily" as FrequencyType, time: `${hh}:00`, dow: "1" };
        }
        if (dow === "*" && !isNaN(Number(minute)) && !isNaN(Number(hour))) {
          const hh = hour.padStart(2, "0");
          const mm = minute.padStart(2, "0");
          return { freq: "daily" as FrequencyType, time: `${hh}:${mm}`, dow: "1" };
        }
        if (dow === "1-5" && !isNaN(Number(minute)) && !isNaN(Number(hour))) {
          const hh = hour.padStart(2, "0");
          const mm = minute.padStart(2, "0");
          return { freq: "workdays" as FrequencyType, time: `${hh}:${mm}`, dow: "1" };
        }
        if (dow !== "*" && !isNaN(Number(dow)) && !isNaN(Number(minute)) && !isNaN(Number(hour))) {
          const hh = hour.padStart(2, "0");
          const mm = minute.padStart(2, "0");
          return { freq: "weekly" as FrequencyType, time: `${hh}:${mm}`, dow };
        }
        if (minute === "0" && hour === "*" && dow === "*") {
          return { freq: "hourly" as FrequencyType, time: "09:00", dow: "1" };
        }
        if (minute === "*/15" && hour === "*" && dow === "*") {
          return { freq: "interval15" as FrequencyType, time: "09:00", dow: "1" };
        }
      }
    }
    return { freq: "custom" as FrequencyType, time: "09:00", dow: "1" };
  };

  useEffect(() => {
    if (job) {
      setName(job.name);
      setCronExpr(job.cronExpr);
      setTimezone(job.timezone || "Asia/Ho_Chi_Minh");
      setTargetChannel(job.targetChannel || "telegram");
      setPrompt(job.promptSnippet || "");
      setEnabled(job.enabled !== false);

      const parsed = parseCronToFriendly(job.cronExpr);
      setFrequency(parsed.freq);
      setSelectedTime(parsed.time);
      setSelectedDayOfWeek(parsed.dow);
      setShowAdvancedCron(parsed.freq === "custom");
    } else {
      setName(`Nhắc việc hằng ngày cho ${agentName}`);
      setCronExpr("0 7 * * *");
      setTimezone("Asia/Ho_Chi_Minh");
      setTargetChannel("telegram");
      setPrompt("Gửi tin nhắn chào buổi sáng và nhắc nhở các công việc quan trọng cần xử lý hôm nay.");
      setEnabled(true);
      setFrequency("daily");
      setSelectedTime("07:00");
      setSelectedDayOfWeek("1");
      setShowAdvancedCron(false);
    }
  }, [job, agentName]);

  // When frequency, time, or day of week changes, calculate cronExpr automatically
  const updateCronFromFriendly = (freq: FrequencyType, time: string, dow: string) => {
    const [hStr, mStr] = time.split(":");
    const h = parseInt(hStr || "9", 10);
    const m = parseInt(mStr || "0", 10);

    let generatedCron = cronExpr;
    if (freq === "daily") {
      generatedCron = `${m} ${h} * * *`;
    } else if (freq === "workdays") {
      generatedCron = `${m} ${h} * * 1-5`;
    } else if (freq === "weekly") {
      generatedCron = `${m} ${h} * * ${dow}`;
    } else if (freq === "hourly") {
      generatedCron = `0 * * * *`;
    } else if (freq === "interval15") {
      generatedCron = `*/15 * * * *`;
    }
    setCronExpr(generatedCron);
  };

  const handleFrequencyChange = (newFreq: FrequencyType) => {
    setFrequency(newFreq);
    if (newFreq === "custom") {
      setShowAdvancedCron(true);
    } else {
      updateCronFromFriendly(newFreq, selectedTime, selectedDayOfWeek);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
    if (frequency !== "custom") {
      updateCronFromFriendly(frequency, newTime, selectedDayOfWeek);
    }
  };

  const handleDayOfWeekChange = (newDow: string) => {
    setSelectedDayOfWeek(newDow);
    if (frequency === "weekly") {
      updateCronFromFriendly("weekly", selectedTime, newDow);
    }
  };

  // Human-readable summary of schedule
  const humanReadableSummary = useMemo(() => {
    if (frequency === "daily") {
      return `Chạy mỗi ngày vào lúc ${selectedTime}`;
    }
    if (frequency === "workdays") {
      return `Chạy từ Thứ 2 đến Thứ 6 vào lúc ${selectedTime}`;
    }
    if (frequency === "weekly") {
      const dayName = DAYS_OF_WEEK.find((d) => d.value === selectedDayOfWeek)?.label || "Thứ 2";
      return `Chạy vào ${dayName} hằng tuần lúc ${selectedTime}`;
    }
    if (frequency === "hourly") {
      return "Chạy mỗi giờ một lần (vào đầu mỗi giờ)";
    }
    if (frequency === "interval15") {
      return "Chạy liên tục mỗi 15 phút";
    }
    return `Chạy theo biểu thức tùy chỉnh: ${cronExpr}`;
  }, [frequency, selectedTime, selectedDayOfWeek, cronExpr]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
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
          {/* 1. Name */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-neutral-300 font-medium text-xs">
              Tên công việc (Routine Title)
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

          {/* 2. End-User Friendly Frequency & Time Configuration */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432]">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#f8a87c]" />
                <span>Thời gian & Tần suất thực hiện</span>
              </span>
              <span className="text-[11px] font-mono font-normal text-[#e0682b] dark:text-[#f8a87c]">
                {humanReadableSummary}
              </span>
            </div>

            {/* Frequency Options Radio Pills */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: "daily", label: "Mỗi ngày" },
                { id: "workdays", label: "Thứ 2 - Thứ 6" },
                { id: "weekly", label: "Hằng tuần" },
                { id: "hourly", label: "Mỗi giờ" },
                { id: "interval15", label: "15 phút / lần" },
                { id: "custom", label: "Tùy chỉnh..." },
              ].map((opt) => {
                const isSelected = frequency === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleFrequencyChange(opt.id as FrequencyType)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer text-center ${
                      isSelected
                        ? "bg-[#f8a87c]/20 border-[#f8a87c] text-[#e0682b] dark:text-[#f8a87c] font-semibold shadow-xs"
                        : "bg-white dark:bg-[#181824] hover:bg-slate-100 dark:hover:bg-[#20202e] border-slate-200 dark:border-[#28283a] text-slate-700 dark:text-neutral-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Time Picker & Day of Week Picker (when applicable) */}
            {(frequency === "daily" || frequency === "workdays" || frequency === "weekly") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/80 dark:border-white/10">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-600 dark:text-neutral-400 font-medium">
                    Giờ thực hiện:
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-full bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#2a2a3c] rounded-xl px-3 py-1.5 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[#f8a87c] hover:border-slate-300 dark:hover:border-[#3a3a50]"
                  />
                </div>

                {frequency === "weekly" && (
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-600 dark:text-neutral-400 font-medium">
                      Ngày trong tuần:
                    </label>
                    <CustomSelect
                      value={selectedDayOfWeek}
                      onChange={handleDayOfWeekChange}
                      options={DAYS_OF_WEEK}
                      className="w-full"
                      triggerClassName="w-full bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#2a2a3c] hover:border-slate-300 dark:hover:border-[#3a3a50] rounded-xl px-3 py-1.5 text-slate-800 dark:text-white font-sans text-xs"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Expandable Advanced Cron Input for Power Users */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedCron(!showAdvancedCron)}
                className="text-[10px] font-mono text-slate-500 dark:text-neutral-500 hover:text-[#e0682b] dark:hover:text-[#f8a87c] flex items-center gap-1 cursor-pointer"
              >
                <Sliders size={11} />
                <span>{showAdvancedCron ? "Ẩn biểu thức Cron kỹ thuật" : "Hiển thị biểu thức Cron kỹ thuật (Nâng cao)"}</span>
              </button>

              {showAdvancedCron && (
                <div className="mt-2 space-y-1 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-neutral-400">
                    <span>Cron Expression (phút giờ ngày tháng thứ):</span>
                    <span className="text-[#e0682b] dark:text-[#f8a87c]">{cronExpr}</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={cronExpr}
                    onChange={(e) => {
                      setCronExpr(e.target.value);
                      setFrequency("custom");
                    }}
                    placeholder="VD: 0 21 * * *"
                    className="w-full bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#2a2a3c] rounded-xl px-3.5 py-1.5 text-[#e0682b] dark:text-[#f8a87c] font-mono text-xs focus:outline-none focus:border-[#f8a87c]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3. Dispatch Channel */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-neutral-300 font-medium text-xs">
              Kênh gửi thông báo (Dispatch Channel)
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

          {/* 4. Instruction Prompt */}
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

          {/* 5. Active Status Card with Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432]">
            <div className="flex flex-col min-w-0 pr-3">
              <span className="font-semibold text-slate-900 dark:text-white text-xs">
                Trạng thái kích hoạt (Active Status)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-sans mt-0.5">
                {enabled ? "Lịch đang hoạt động và sẽ tự động bắn lệnh theo chu kỳ" : "Lịch đang tạm dừng (paused)"}
              </span>
            </div>

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
